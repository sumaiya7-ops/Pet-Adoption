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
    'http://localhost:5173',
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
// MongoDB
// =======================
const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

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
// MAIN
// =======================
async function run() {
    try {
        await client.connect();

        const db = client.db("petAdoptionDB");
        const petsCollection = db.collection("pets");
        const requestsCollection = db.collection("requests");

        // =======================
        // JWT LOGIN
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
            res.clearCookie('token').send({ success: true });
        });

        // =======================
        // PETS
        // =======================
        app.get('/pets', async (req, res) => {
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
        });

        app.get('/pets/:id', async (req, res) => {
            const result = await petsCollection.findOne({
                _id: new ObjectId(req.params.id)
            });
            res.send(result);
        });

        app.post('/pets', verifyToken, async (req, res) => {
            const result = await petsCollection.insertOne(req.body);
            res.send(result);
        });

        app.put('/pets/:id', verifyToken, async (req, res) => {
            const result = await petsCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );
            res.send(result);
        });

        app.delete('/pets/:id', verifyToken, async (req, res) => {
            const result = await petsCollection.deleteOne({
                _id: new ObjectId(req.params.id),
                ownerEmail: req.user.email
            });

            if (result.deletedCount === 0) {
                return res.status(403).send({ message: "Not allowed" });
            }

            res.send(result);
        });

        // =======================
        // REQUESTS
        // =======================
        app.post('/requests', verifyToken, async (req, res) => {
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
        });

        app.get('/my-requests', verifyToken, async (req, res) => {
            const result = await requestsCollection.find({
                userEmail: req.user.email
            }).toArray();

            res.send(result);
        });

        app.delete('/requests/:id', verifyToken, async (req, res) => {
            const result = await requestsCollection.deleteOne({
                _id: new ObjectId(req.params.id)
            });

            res.send(result);
        });

        // =======================
        // APPROVE / REJECT
        // =======================
        app.patch('/requests/approve/:id', verifyToken, async (req, res) => {
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
        });

        app.patch('/requests/reject/:id', verifyToken, async (req, res) => {
            await requestsCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: { status: 'Rejected' } }
            );

            res.send({ success: true });
        });

        console.log("✅ Server connected successfully");

    } catch (error) {
        console.error("❌ Server Error:", error);
    }
}

run().catch(console.dir);

// =======================
// ROOT
// =======================
app.get('/', (req, res) => {
    res.send('Server Running');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});