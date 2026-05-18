const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware Setup
// Dynamic CORS Setup for Localhost and Production Vercel Domain
const allowedOrigins = [
    'http://localhost:5173', 
    'https://vercel.app' // ডেপ্লয় করার পর এখানে আপনার ফ্রন্টএন্ড লিংকটি বসবে
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(cookieParser());

// Database Connection URI from your .env
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Custom Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized access' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.user = decoded;
        next();
    });
};

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        
        const db = client.db("petAdoptionDB");
        const petsCollection = db.collection("pets");
        const requestsCollection = db.collection("requests");

        // =========================================================================
        // [1. JWT AUTHENTICATION ENDPOINTS]
        // =========================================================================
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
            }).send({ success: true });
        });

        app.post('/logout', async (req, res) => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
            }).send({ success: true });
        });

        // =========================================================================
        // [2. PET LISTINGS CRUD ENDPOINTS] - Advanced Search & Filters ($regex & $in)
        // =========================================================================
        app.get('/pets', async (req, res) => {
            const { search, species } = req.query;
            let query = {};

            // Search by name using MongoDB $regex
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }

            // Filter by species using MongoDB $in
            if (species) {
                const speciesArray = species.split(',');
                query.species = { $in: speciesArray };
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
            const pet = req.body;
            const result = await petsCollection.insertOne(pet);
            res.send(result);
        });

        app.put('/pets/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const updatedPet = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: updatedPet };
            const result = await petsCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        app.delete('/pets/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const result = await petsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.get('/my-listings', verifyToken, async (req, res) => {
            const email = req.query.email;
            if (req.user.email !== email) {
                return res.status(403).send({ message: 'Forbidden Access' });
            }
            const query = { ownerEmail: email };
            const listings = await petsCollection.find(query).toArray();
            
            const totalListings = listings.length;
            const available = listings.filter(p => p.status !== 'adopted').length;
            const adopted = listings.filter(p => p.status === 'adopted').length;

            res.send({ listings, stats: { totalListings, available, adopted } });
        });

        // =========================================================================
        // [3. ADOPTION REQUEST CONTROLS] - Handles Locks & Business Rules
        // =========================================================================
        app.post('/requests', verifyToken, async (req, res) => {
            const request = req.body;

            const pet = await petsCollection.findOne({ _id: new ObjectId(request.petId) });
            if (pet && pet.status === 'adopted') {
                return res.status(400).send({ message: 'This pet has already been adopted!' });
            }

            if (pet && pet.ownerEmail === request.userEmail) {
                return res.status(403).send({ message: 'You cannot adopt your own listed pet.' });
            }

            const result = await requestsCollection.insertOne(request);
            res.send(result);
        });

        app.get('/my-requests', verifyToken, async (req, res) => {
            const email = req.query.email;
            if (req.user.email !== email) {
                return res.status(403).send({ message: 'Forbidden Access' });
            }
            const result = await requestsCollection.find({ userEmail: email }).toArray();
            res.send(result);
        });

        app.delete('/requests/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const result = await requestsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.get('/pet-requests/:petId', verifyToken, async (req, res) => {
            const petId = req.params.petId;
            const result = await requestsCollection.find({ petId: petId }).toArray();
            res.send(result);
        });

        // এই সেই সম্পূর্ণ এপিআই যা আপনার কোডে কেটে গিয়েছিল
        app.patch('/requests/approve/:id', verifyToken, async (req, res) => {
            const requestId = req.params.id;
            const { petId } = req.body;

            await requestsCollection.updateOne(
                { _id: new ObjectId(requestId) },
                { $set: { status: 'Approved' } }
            );

            await requestsCollection.updateMany(
                { petId: petId, _id: { $ne: new ObjectId(requestId) } },
                { $set: { status: 'Rejected' } }
            );

            await petsCollection.updateOne(
                { _id: new ObjectId(petId) },
                { $set: { status: 'adopted' } }
            );

            res.send({ success: true, message: 'Adoption request approved successfully!' });
        });

        app.patch('/requests/reject/:id', verifyToken, async (req, res) => {
            const requestId = req.params.id;
            const result = await requestsCollection.updateOne(
                { _id: new ObjectId(requestId) },
                { $set: { status: 'Rejected' } }
            );
            res.send(result);
        });

        console.log("Successfully connected to MongoDB Cluster!");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Pet Adoption Server API is fully operational.');
});
// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});


app.listen(port, () => {
    console.log(`Server is running smoothly on port ${port}`);
});
