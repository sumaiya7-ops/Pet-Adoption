const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// =======================
// CORS (PRODUCTION SAFE)
// =======================
const allowedOrigins = [
    'http://localhost:5173',
    'https://pet-adoption-one-tau.vercel.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.options('/{*splat}', cors());


app.use(express.json());
app.use(cookieParser());

// =======================
// MONGO (Vercel SAFE CACHE)
// =======================
let cachedClient = null;

async function getClient() {
    if (cachedClient) return cachedClient;

    const client = new MongoClient(process.env.MONGO_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();
    cachedClient = client;

    return client;
}

// =======================
// COLLECTION HELPERS
// =======================
const getPetsCollection = async () => {
    const client = await getClient();
    return client.db("petAdoptionDB").collection("pets");
};

const getRequestsCollection = async () => {
    const client = await getClient();
    return client.db("petAdoptionDB").collection("requests");
};

// =======================
// JWT VERIFY
// =======================
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden' });
        }
        req.user = decoded;
        next();
    });
};

// =======================
// AUTH
// =======================
app.post('/jwt', (req, res) => {
    const user = req.body;

    const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }).send({ success: true });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }).send({ success: true });
});

// =======================
// PETS
// =======================
app.get('/pets', async (req, res) => {
    try {
        const petsCollection = await getPetsCollection();
        const result = await petsCollection.find().toArray();
        res.send(result);
    } catch {
        res.status(500).send([]);
    }
});

app.get('/pets/:id', async (req, res) => {
    try {
        const petsCollection = await getPetsCollection();
        const result = await petsCollection.findOne({
            _id: new ObjectId(req.params.id)
        });
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.post('/pets', verifyToken, async (req, res) => {
    try {
        const petsCollection = await getPetsCollection();
        const result = await petsCollection.insertOne(req.body);
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.put('/pets/:id', verifyToken, async (req, res) => {
    try {
        const petsCollection = await getPetsCollection();
        const result = await petsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.delete('/pets/:id', verifyToken, async (req, res) => {
    try {
        const petsCollection = await getPetsCollection();

        const result = await petsCollection.deleteOne({
            _id: new ObjectId(req.params.id),
            ownerEmail: req.user.email
        });

        if (result.deletedCount === 0) {
            return res.status(403).send({ message: "Not allowed" });
        }

        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// =======================
// REQUESTS
// =======================
app.post('/requests', verifyToken, async (req, res) => {
    try {
        const petsCollection = await getPetsCollection();
        const requestsCollection = await getRequestsCollection();

        const request = req.body;

        const pet = await petsCollection.findOne({
            _id: new ObjectId(request.petId)
        });

        if (!pet) return res.status(404).send({ message: "Pet not found" });
        if (pet.status === 'adopted') return res.status(400).send({ message: 'Already adopted' });

        const exists = await requestsCollection.findOne({
            petId: request.petId,
            userEmail: request.userEmail
        });

        if (exists) return res.status(400).send({ message: "Already requested" });

        const result = await requestsCollection.insertOne(request);
        res.send(result);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.get('/my-requests', verifyToken, async (req, res) => {
    try {
        const requestsCollection = await getRequestsCollection();

        const result = await requestsCollection
            .find({ userEmail: req.user.email })
            .toArray();

        res.send(result);
    } catch {
        res.status(500).send([]);
    }
});

// রিকোয়েস্ট ক্যানসেল/ডিলিট করার রাউট
app.delete('/requests/:id', verifyToken, async (req, res) => {
    try {
        const requestsCollection = await getRequestsCollection();
        const result = await requestsCollection.deleteOne({
            _id: new ObjectId(req.params.id),
            userEmail: req.user.email // নিরাপত্তার জন্য নিশ্চিত করা হচ্ছে যেন ইউজার শুধু নিজের রিকোয়েস্টই ডিলিট করতে পারে
        });
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// ২. মাই লিস্টিং ও স্ট্যাটস দেখানোর রাউট
app.get('/my-listings', verifyToken, async (req, res) => {
    try {
        const petsCollection = await getPetsCollection();
        const queryEmail = req.query.email;

        if (req.user.email !== queryEmail) {
            return res.status(403).send({ message: "Forbidden Access" });
        }

        const userPets = await petsCollection.find({ ownerEmail: queryEmail }).toArray();

        const totalListings = userPets.length;
        const available = userPets.filter(pet => pet.status === 'available' || pet.status !== 'adopted').length;
        const shadowAdopted = userPets.filter(pet => pet.status === 'adopted').length;

        res.send({
            listings: userPets,
            stats: { totalListings, available, adopted: shadowAdopted }
        });
    } catch (err) {
        res.status(500).send({ listings: [], stats: { totalListings: 0, available: 0, adopted: 0 } });
    }
});

// ৩. মডালের ভেতরে অ্যাপ্লিকেশনের লিস্ট দেখানোর রাউট
app.get('/pet-requests/:petId', verifyToken, async (req, res) => {
    try {
        const requestsCollection = await getRequestsCollection();
        const petId = req.params.petId;

        const query = {
            $or: [
                { petId: petId },
                { petId: new ObjectId(petId) }
            ]
        };

        const result = await requestsCollection.find(query).toArray();
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
// =======================
// APPROVE / REJECT
// =======================
app.patch('/requests/approve/:id', verifyToken, async (req, res) => {
    try {
        const petsCollection = await getPetsCollection();
        const requestsCollection = await getRequestsCollection();

        const { petId } = req.body;

        const pet = await petsCollection.findOne({
            _id: new ObjectId(petId)
        });

        if (!pet) return res.status(404).send({ message: "Pet not found" });
        if (pet.ownerEmail !== req.user.email) {
            return res.status(403).send({ message: "Not allowed" });
        }

        await requestsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status: 'Approved' } }
        );

        await petsCollection.updateOne(
            { _id: new ObjectId(petId) },
            { $set: { status: 'adopted' } }
        );

        res.send({ success: true });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.patch('/requests/reject/:id', verifyToken, async (req, res) => {
    try {
        const requestsCollection = await getRequestsCollection();

        await requestsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status: 'Rejected' } }
        );

        res.send({ success: true });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// =======================
// ROOT
// =======================
app.get('/', (req, res) => {
    res.send('Server Running Smoothly 🚀');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});