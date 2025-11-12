const express = require('express');
const router = express.Router();
const TimeCapsule = require('../models/TimeCapsule');
const authMiddleware = require('../middleware/auth');

// Create a new capsule
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content, unlockAt, recipientId } = req.body;

        if (!content || !unlockAt) {
            return res.status(400).json({ error: 'Content and unlockAt are required' });
        }

        const capsule = new TimeCapsule({
            authorId: req.userId,
            recipientId: recipientId || null,
            title: title || 'Untitled Capsule',
            content,
            unlockAt: new Date(unlockAt)
        });

        await capsule.save();
        await capsule.populate('authorId', 'email name');

        res.status(201).json(capsule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all capsules for the current user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const capsules = await TimeCapsule.find({
            $or: [
                { authorId: req.userId },
                { recipientId: req.userId }
            ]
        })
        .populate('authorId', 'email name')
        .sort({ createdAt: -1 });

        res.json(capsules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific capsule (with unlock guard)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const capsule = await TimeCapsule.findById(req.params.id)
            .populate('authorId', 'email name');

        if (!capsule) {
            return res.status(404).json({ error: 'Capsule not found' });
        }

        // Check permission (author or recipient)
        if (capsule.authorId._id.toString() !== req.userId && 
            capsule.recipientId?.toString() !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Check if unlocked
        const now = new Date();
        if (capsule.unlockAt > now) {
            // Return locked state but not content
            return res.json({
                _id: capsule._id,
                title: capsule.title,
                createdAt: capsule.createdAt,
                unlockAt: capsule.unlockAt,
                isLocked: true,
                daysRemaining: Math.ceil((capsule.unlockAt - now) / (1000 * 60 * 60 * 24))
            });
        }

        // Unlocked - mark as opened if not already
        if (!capsule.isOpened) {
            capsule.isOpened = true;
            capsule.openedAt = now;
            await capsule.save();
        }

        res.json(capsule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a capsule (only if locked)
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const capsule = await TimeCapsule.findById(req.params.id);

        if (!capsule) {
            return res.status(404).json({ error: 'Capsule not found' });
        }

        if (capsule.authorId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Only author can edit' });
        }

        if (capsule.unlockAt <= new Date()) {
            return res.status(400).json({ error: 'Cannot edit unlocked capsule' });
        }

        const { title, content, unlockAt } = req.body;
        if (title) capsule.title = title;
        if (content) capsule.content = content;
        if (unlockAt) capsule.unlockAt = new Date(unlockAt);
        capsule.updatedAt = new Date();

        await capsule.save();
        res.json(capsule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a capsule
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const capsule = await TimeCapsule.findById(req.params.id);

        if (!capsule) {
            return res.status(404).json({ error: 'Capsule not found' });
        }

        if (capsule.authorId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Only author can delete' });
        }

        await TimeCapsule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Capsule deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
