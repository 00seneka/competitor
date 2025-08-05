const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://smhwammet:shyU9yPELOtoJptm@appointmetnsdb.qkrlp8p.mongodb.net/?retryWrites=true&w=majority&appName=appointmetnsDB';
const DATABASE_NAME = 'videoscale';
const COLLECTION_NAME = 'waitlist';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB client
let db;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DATABASE_NAME);
        console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// API endpoint to store emails
app.post('/api/waitlist', async (req, res) => {
    try {
        const { email, timestamp, source } = req.body;
        
        // Validate email
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email address' 
            });
        }

        // Check if email already exists
        const existingEmail = await db.collection(COLLECTION_NAME).findOne({ email });
        if (existingEmail) {
            return res.status(200).json({ 
                success: true, 
                message: 'Email already registered',
                data: existingEmail
            });
        }

        // Insert new email
        const emailDoc = {
            email,
            timestamp: timestamp || new Date().toISOString(),
            source: source || 'unknown',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            createdAt: new Date()
        };

        const result = await db.collection(COLLECTION_NAME).insertOne(emailDoc);
        
        console.log(`📧 New email added: ${email}`);
        
        res.status(201).json({
            success: true,
            message: 'Email added to waitlist successfully',
            data: {
                id: result.insertedId,
                email: email,
                timestamp: emailDoc.timestamp
            }
        });

    } catch (error) {
        console.error('Error storing email:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// API endpoint to get all emails (for admin use)
app.get('/api/waitlist', async (req, res) => {
    try {
        const emails = await db.collection(COLLECTION_NAME)
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        
        res.json({
            success: true,
            count: emails.length,
            data: emails
        });
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// API endpoint to get waitlist stats
app.get('/api/waitlist/stats', async (req, res) => {
    try {
        const totalCount = await db.collection(COLLECTION_NAME).countDocuments();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayCount = await db.collection(COLLECTION_NAME).countDocuments({
            createdAt: { $gte: todayStart }
        });

        const recentEmails = await db.collection(COLLECTION_NAME)
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        res.json({
            success: true,
            stats: {
                total: totalCount,
                today: todayCount,
                recent: recentEmails.map(email => ({
                    email: email.email,
                    timestamp: email.timestamp,
                    source: email.source
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: db ? 'Connected' : 'Disconnected'
    });
});

// Start server
async function startServer() {
    await connectToMongoDB();
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Admin panel: http://localhost:${PORT}/api/waitlist`);
        console.log(`📈 Stats: http://localhost:${PORT}/api/waitlist/stats`);
    });
}

startServer().catch(console.error);
