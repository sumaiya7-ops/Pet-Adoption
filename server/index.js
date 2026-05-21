const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// =======================
// Middleware
// =======================
const allowedOrigins = [
    'https://pet-adoption-one-tau.vercel.app',
    process.env.CLIENT_URL
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS Not Allowed'));
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// =======================
// MongoDB Connection
// =======================
const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// ডাটাবেজ ও কালেকশন গ্লোবালি ডিফাইন করা (যাতে সব রুট এক্সেস পায়)
let petsCollection;
let requestsCollection;

// =======================
// JWT VERIFY MIDDLEWARE
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
// JWT AUTH ROUTES (Root Level)
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
    // 🐾 লাইভ সাইটে ব্রাউজার থেকে কুকি সাকসেসফুলি রিমুভ করার জন্য অপ্টিমাইজড
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }).send({ success: true });
});

// =======================
// MAIN DATABASE RUN
// =======================
async function run() {
    try {
        await client.connect();

        const db = client.db("petAdoptionDB");
        petsCollection = db.collection("pets");
        requestsCollection = db.collection("requests");

        console.log("✅ MongoDB connected successfully");

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
}
run().catch(console.dir);

// =======================
// PETS API ROUTES
// =======================
app.get('/pets', async (req, res) => {
    try {
        const { search, species } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (species) {
            query.species = { $in: species.split(',') };
        }

        const result = await petsCollection.find(query).toArray();
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.get('/pets/:id', async (req, res) => {
    try {
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
        const result = await petsCollection.insertOne(req.body);
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.put('/pets/:id', verifyToken, async (req, res) => {
    try {
        const result = await petsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { ...req.body } }
        );
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.delete('/pets/:id', verifyToken, async (req, res) => {
    try {
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
// REQUESTS API ROUTES
// =======================
app.post('/requests', verifyToken, async (req, res) => {
    try {
        const request = req.body;

        const pet = await petsCollection.findOne({
            _id: new ObjectId(request.petId)
        });

        if (!pet) {
            return res.status(404).send({ message: "Pet not found" });
        }

        if (pet.status === 'adopted') {
            return res.status(400).send({ message: 'Already adopted' });
        }

        // duplicate request check
        const exists = await requestsCollection.findOne({
            petId: request.petId,
            userEmail: request.userEmail
        });

        if (exists) {
            return res.status(400).send({ message: "Already requested" });
        }

        const result = await requestsCollection.insertOne(request);
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.get('/my-requests', verifyToken, async (req, res) => {
    try {
        const result = await requestsCollection.find({
            userEmail: req.user.email
        }).toArray();

        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.delete('/requests/:id', verifyToken, async (req, res) => {
    try {
        const result = await requestsCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        });
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// =======================
// APPROVE / REJECT ROUTES
// =======================
app.patch('/requests/approve/:id', verifyToken, async (req, res) => {
    try {
        const { petId } = req.body;

        const pet = await petsCollection.findOne({
            _id: new ObjectId(petId)
        });

        if (!pet) {
            return res.status(404).send({ message: "Pet not found" });
        }

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
// ROOT & BASE LISTEN
// =======================
app.get('/', (req, res) => {
    res.send('Server Running');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
