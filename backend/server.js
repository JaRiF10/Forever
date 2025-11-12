require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

// Routes
const authRoutes = require('./routes/auth');
const capsuleRoutes = require('./routes/capsules');
const voiceRoutes = require('./routes/voice');
const lettersRoutes = require('./routes/letters');
const promisesRoutes = require('./routes/promises');
const moodRoutes = require('./routes/moods');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Setup ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/letters', lettersRoutes);
app.use('/api/promises', promisesRoutes);
app.use('/api/moods', moodRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// --- Database Connection ---
async function connectDB() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/my-sayang';
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB connected:', mongoUri);
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
}

// --- Scheduled Jobs ---
// Optional: Mark opened capsules as old and clean up (runs daily at 2am)
cron.schedule('0 2 * * *', async () => {
    try {
        console.log('🧹 Running capsule cleanup job...');
        const TimeCapsule = require('./models/TimeCapsule');
        
        // This could delete old opened capsules or log analytics
        // For now, just log count of recently unlocked capsules
        const recentlyUnlocked = await TimeCapsule.countDocuments({
            isOpened: true,
            openedAt: { $gt: new Date(Date.now() - 24*60*60*1000) }
        });
        
        console.log(`📊 Recently unlocked capsules (24h): ${recentlyUnlocked}`);
    } catch (err) {
        console.error('Error in cleanup job:', err.message);
    }
});

// Mark promises as 'missed' if dueDate is past and status is not 'done' (runs every hour)
cron.schedule('0 * * * *', async () => {
    try {
        console.log('⏰ Checking promises for missed deadlines...');
        const PromiseModel = require('./models/Promise');
        const now = new Date();
        const updated = await PromiseModel.updateMany(
            { dueDate: { $lt: now }, status: { $ne: 'done' } },
            { $set: { status: 'missed' } }
        );
        console.log(`✓ Marked ${updated.modifiedCount} promises as missed`);
    } catch (err) {
        console.error('Error in promise check job:', err.message);
    }
});

// --- Start Server ---
app.listen(PORT, async () => {
    await connectDB();
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`   Auth: POST /api/auth/register, POST /api/auth/login`);
    console.log(`   Capsules: GET/POST /api/capsules, GET/PATCH/DELETE /api/capsules/:id`);
    console.log(`   Voice: POST /api/voice/upload, GET /api/voice`);
    console.log(`   Moods: GET/POST /api/moods, GET/PATCH/DELETE /api/moods/:id`);
    console.log(`\n🔑 JWT Auth: Pass token in header: Authorization: Bearer <token>\n`);
});

module.exports = app;
