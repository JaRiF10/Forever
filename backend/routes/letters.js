const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Letter = require('../models/Letter');

// Create a new letter
router.post('/', auth, async (req, res) => {
  try {
    const { body, unlockAt } = req.body;
    if (!body) return res.status(400).json({ message: 'Body is required' });
    const letter = new Letter({ authorId: req.user.id, body, unlockAt: unlockAt ? new Date(unlockAt) : undefined, versions: [] });
    await letter.save();
    res.status(201).json(letter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List letters for current user
router.get('/', auth, async (req, res) => {
  try {
    const letters = await Letter.find({ authorId: req.user.id }).sort({ createdAt: -1 });
    res.json(letters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a letter by id
router.get('/:id', auth, async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) return res.status(404).json({ message: 'Not found' });
    if (String(letter.authorId) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
    res.json(letter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Append a new version to a letter (patch-version)
router.patch('/:id/version', auth, async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ message: 'Body is required' });
    const letter = await Letter.findById(req.params.id);
    if (!letter) return res.status(404).json({ message: 'Not found' });
    if (String(letter.authorId) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
    // push current body into versions
    letter.versions.push({ body: letter.body, editedAt: new Date() });
    // set new body
    letter.body = body;
    await letter.save();
    res.json(letter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a letter
router.delete('/:id', auth, async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) return res.status(404).json({ message: 'Not found' });
    if (String(letter.authorId) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
    await letter.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
