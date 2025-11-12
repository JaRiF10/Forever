const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Voice = require('../models/Voice');
const authMiddleware = require('../middleware/auth');

// Setup multer for voice uploads
const uploadDir = path.join(__dirname, '../uploads/voice');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webm`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files allowed'));
        }
    }
});

// Upload voice memo
router.post('/upload', authMiddleware, upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { lengthSeconds, tags, isPublic } = req.body;

        const voice = new Voice({
            userId: req.userId,
            filename: req.file.filename,
            url: `/uploads/voice/${req.file.filename}`,
            mimeType: req.file.mimetype,
            lengthSeconds: lengthSeconds || 0,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            isPublic: isPublic === 'true'
        });

        await voice.save();
        res.status(201).json(voice);
    } catch (err) {
        if (req.file) {
            fs.unlink(req.file.path, (e) => {});
        }
        res.status(500).json({ error: err.message });
    }
});

// Get all voice memos for user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const voices = await Voice.find({ userId: req.userId })
            .sort({ createdAt: -1 });
        res.json(voices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific voice memo
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const voice = await Voice.findById(req.params.id);

        if (!voice) {
            return res.status(404).json({ error: 'Voice not found' });
        }

        if (voice.userId.toString() !== req.userId && !voice.isPublic) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(voice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update voice memo
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const voice = await Voice.findById(req.params.id);

        if (!voice) {
            return res.status(404).json({ error: 'Voice not found' });
        }

        if (voice.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Only owner can update' });
        }

        const { tags, isPublic, transcript } = req.body;
        if (tags) voice.tags = tags.split(',').map(t => t.trim());
        if (isPublic !== undefined) voice.isPublic = isPublic;
        if (transcript) voice.transcript = transcript;
        voice.updatedAt = new Date();

        await voice.save();
        res.json(voice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete voice memo
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const voice = await Voice.findById(req.params.id);

        if (!voice) {
            return res.status(404).json({ error: 'Voice not found' });
        }

        if (voice.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Only owner can delete' });
        }

        // Delete file
        const filePath = path.join(__dirname, '..', voice.url.substring(1));
        fs.unlink(filePath, (err) => {});

        await Voice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Voice deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
