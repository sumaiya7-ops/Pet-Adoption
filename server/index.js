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
    'https://pet-adoption.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (!allowedOrigins.includes(origin)) {
            return callback(new Error('CORS Not Allowed'), false);
        }
        return callback(null, true);
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
// JWT VERIFY (ONLY ONE PLACE - CLEAN)
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
// MAIN RUN
// =======================
async function run() {
    try {
        await client.connect();

        const db = client.db("petAdoptionDB");
        const petsCollection = db.collection("pets");
        const requestsCollection = db.collection("requests");

        // =======================
        // JWT
        // =======================
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
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
            const id = req.params.id;
            const result = await petsCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.post('/pets', verifyToken, async (req, res) => {
            const result = await petsCollection.insertOne(req.body);
            res.send(result);
        });

        app.put('/pets/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const result = await petsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: req.body }
            );
            res.send(result);
        });

        app.delete('/pets/:id', verifyToken, async (req, res) => {
            const id = req.params.id;

            // 🔐 SECURITY FIX: only owner can delete
            const result = await petsCollection.deleteOne({
                _id: new ObjectId(id),
                ownerEmail: req.user.email
            });

            res.send(result);
        });

        // =======================
        // MY LISTINGS
        // =======================
        app.get('/my-listings', verifyToken, async (req, res) => {
            const email = req.user.email;

            const listings = await petsCollection.find({
                ownerEmail: email
            }).toArray();

            const totalListings = listings.length;
            const available = listings.filter(p => p.status !== 'adopted').length;
            const adopted = listings.filter(p => p.status === 'adopted').length;

            res.send({
                listings,
                stats: { totalListings, available, adopted }
            });
        });

        // =======================
        // REQUESTS
        // =======================
        app.post('/requests', verifyToken, async (req, res) => {
            const request = req.body;

            const pet = await petsCollection.findOne({
                _id: new ObjectId(request.petId)
            });

            if (pet?.status === 'adopted') {
                return res.status(400).send({ message: 'Already adopted' });
            }

            const result = await requestsCollection.insertOne(request);
            res.send(result);
        });

        app.get('/my-requests', verifyToken, async (req, res) => {
            const email = req.user.email;

            const result = await requestsCollection.find({
                userEmail: email
            }).toArray();

            res.send(result);
        });

        app.delete('/requests/:id', verifyToken, async (req, res) => {
            const result = await requestsCollection.deleteOne({
                _id: new ObjectId(req.params.id)
            });

            res.send(result);
        });

        app.get('/pet-requests/:petId', verifyToken, async (req, res) => {
            const result = await requestsCollection.find({
                petId: req.params.petId
            }).toArray();

            res.send(result);
        });

        app.patch('/requests/approve/:id', verifyToken, async (req, res) => {
            const { petId } = req.body;

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

        console.log("MongoDB connected successfully");

    } catch (error) {
        console.error(error);
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
    console.log(`Server running on port ${port}`);
});