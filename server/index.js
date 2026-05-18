const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware Setup
app.use(cors({
    origin: ['http://localhost:5173', 'https://vercel.app'],
    credentials: true
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

        // ==========================================
        // 1. JWT Authentication APIs
        // ==========================================
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

        // ==========================================
        // 2. Pet Listings CRUD APIs
        // ==========================================

        // Get all pets with Advanced Search and Filter ($regex & $in)
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

        // Get single pet details
        app.get('/pets/:id', async (req, res) => {
            const id = req.params.id;
            const result = await petsCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Add a new Pet (Private Route)
        app.post('/pets', verifyToken, async (req, res) => {
            const pet = req.body;
            const result = await petsCollection.insertOne(pet);
            res.send(result);
        });

        // Update an existing Pet (Private Route)
        app.put('/pets/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const updatedPet = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: updatedPet };
            const result = await petsCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // Delete a Pet listing (Private Route)
        app.delete('/pets/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const result = await petsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Get all pet listings created by a specific owner
        app.get('/my-listings', verifyToken, async (req, res) => {
            const email = req.query.email;
            if (req.user.email !== email) {
                return res.status(403).send({ message: 'Forbidden Access' });
            }
            const query = { ownerEmail: email };
            const listings = await petsCollection.find(query).toArray();
            
            // Generate real-time stats for the user dashboard
            const totalListings = listings.length;
            const available = listings.filter(p => p.status !== 'adopted').length;
            const adopted = listings.filter(p => p.status === 'adopted').length;

            res.send({ listings, stats: { totalListings, available, adopted } });
        });

        // ==========================================
        // 3. Adoption Requests APIs (Adoption Controls)
        // ==========================================

        // Submit an Adoption Request (Private Route)
        app.post('/requests', verifyToken, async (req, res) => {
            const request = req.body;

            // Rule 1: Check if the pet is already adopted
            const pet = await petsCollection.findOne({ _id: new ObjectId(request.petId) });
            if (pet && pet.status === 'adopted') {
                return res.status(400).send({ message: 'This pet has already been adopted!' });
            }

            // Rule 2: Pet owners cannot request their own pet
            if (pet && pet.ownerEmail === request.userEmail) {
                return res.status(403).send({ message: 'You cannot adopt your own listed pet.' });
            }

            const result = await requestsCollection.insertOne(request);
            res.send(result);
        });

        // Get adoption requests made by the logged-in user
        app.get('/my-requests', verifyToken, async (req, res) => {
            const email = req.query.email;
            if (req.user.email !== email) {
                return res.status(403).send({ message: 'Forbidden Access' });
            }
            const result = await requestsCollection.find({ userEmail: email }).toArray();
            res.send(result);
        });

        // Cancel/Delete an adoption request
        app.delete('/requests/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const result = await requestsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Get all pending requests for a specific pet listing (For Owner Modal)
        app.get('/pet-requests/:petId', verifyToken, async (req, res) => {
            const petId = req.params.petId;
            const result = await requestsCollection.find({ petId: petId }).toArray();
            res.send(result);
        });

        // Approve an Adoption Request (Locks the pet and updates all statuses)
        app.patch('/requests/approve/:id', verifyToken, async (req, res) => {
            const requestId = req.params.id;
            const { petId } = req.body;

            // Step A: Mark the chosen request as 'Approved'
            await requestsCollection.updateOne(
                { _id: new ObjectId(requestId) },
                { $set: { status: 'Approved' } }
            );

            // Step B: Automatically reject all other requests for this pet
            await requestsCollection.updateMany(
                { petId: petId, _id: { $ne: new ObjectId(requestId) } },
                { $set: { status: 'Rejected' } }
            );

            // Step C: Mark the main pet document as 'adopted' to prevent future operations
            await petsCollection.updateOne(
                { _id: new ObjectId(petId) },
                { $set: { status: 'adopted' } }
            );

            res.send({ success: true, message: 'Adoption request approved successfully!' });
        });

        // Reject an Adoption Request individually
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

// Basic Route for server health check
app.get('/', (req, res) => {
    res.send('Pet Adoption Server API is fully operational.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running smoothly on port ${port}`);
});
// =========================================================================
// [PETS COLLECTION CRUD OPERATORS] - Handles Add, Update, Delete & Details
// =========================================================================

// API 1: Fetch all pets with dynamic MongoDB $regex search and $in filtering
app.get('/pets', async (req, res) => { /* ...existing code... */ });

// API 2: Fetch single pet deep specification by its unique Object ID
app.get('/pets/:id', async (req, res) => { /* ...existing code... */ });

// API 3: Insert new pet listing data secure bound to verifyToken middleware
app.post('/pets', verifyToken, async (req, res) => { /* ...existing code... */ });

// API 4: Modify existing pet profile payload via transactional updateOne
app.put('/pets/:id', verifyToken, async (req, res) => { /* ...existing code... */ });

// API 5: Permanent removal of a specific listing with secure state clearance
app.delete('/pets/:id', verifyToken, async (req, res) => { /* ...existing code... */ });
