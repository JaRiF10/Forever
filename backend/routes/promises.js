const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Promise = require('../models/Promise');

// Create a new promise
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const promise = new Promise({
      createdBy: req.user.id,
      title,
      description: description || '',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: 'open'
    });
    await promise.save();
    res.status(201).json(promise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List promises for current user
router.get('/', auth, async (req, res) => {
  try {
    const promises = await Promise.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(promises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a promise by id
router.get('/:id', auth, async (req, res) => {
  try {
    const promise = await Promise.findById(req.params.id);
    if (!promise) return res.status(404).json({ message: 'Not found' });
    if (String(promise.createdBy) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
    res.json(promise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update promise status (or other fields)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status, title, description, dueDate } = req.body;
    const promise = await Promise.findById(req.params.id);
    if (!promise) return res.status(404).json({ message: 'Not found' });
    if (String(promise.createdBy) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
    
    if (status && ['open', 'doing', 'done', 'missed'].includes(status)) promise.status = status;
    if (title !== undefined) promise.title = title;
    if (description !== undefined) promise.description = description;
    if (dueDate !== undefined) promise.dueDate = dueDate ? new Date(dueDate) : undefined;
    
    await promise.save();
    res.json(promise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a promise
router.delete('/:id', auth, async (req, res) => {
  try {
    const promise = await Promise.findById(req.params.id);
    if (!promise) return res.status(404).json({ message: 'Not found' });
    if (String(promise.createdBy) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
    await promise.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
