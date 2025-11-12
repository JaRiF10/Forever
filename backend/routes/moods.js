const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const authMiddleware = require('../middleware/auth');

// Create mood entry
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { date, mood, intensity, note, tags, isPublic } = req.body;

        if (!date || !mood) {
            return res.status(400).json({ error: 'Date and mood are required' });
        }

        const moodEntry = new Mood({
            userId: req.userId,
            date: new Date(date),
            mood,
            intensity: intensity || 3,
            note: note || '',
            tags: tags || [],
            isPublic: isPublic || false
        });

        await moodEntry.save();
        res.status(201).json(moodEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get moods for date range
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { userId: req.userId };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const moods = await Mood.find(query).sort({ date: -1 });
        res.json(moods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific mood entry
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id);

        if (!mood) {
            return res.status(404).json({ error: 'Mood not found' });
        }

        if (mood.userId.toString() !== req.userId && !mood.isPublic) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(mood);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update mood entry
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id);

        if (!mood) {
            return res.status(404).json({ error: 'Mood not found' });
        }

        if (mood.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Only owner can update' });
        }

        const { mood: moodVal, intensity, note, tags, isPublic } = req.body;
        if (moodVal) mood.mood = moodVal;
        if (intensity) mood.intensity = intensity;
        if (note !== undefined) mood.note = note;
        if (tags) mood.tags = tags;
        if (isPublic !== undefined) mood.isPublic = isPublic;
        mood.updatedAt = new Date();

        await mood.save();
        res.json(mood);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete mood entry
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id);

        if (!mood) {
            return res.status(404).json({ error: 'Mood not found' });
        }

        if (mood.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Only owner can delete' });
        }

        await Mood.findByIdAndDelete(req.params.id);
        res.json({ message: 'Mood deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
