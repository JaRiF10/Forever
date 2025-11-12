const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    mood: {
        type: String,
        enum: ['happy', 'sad', 'excited', 'angry', 'loved', 'blessed', 'grateful'],
        required: true
    },
    intensity: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    note: {
        type: String,
        default: ''
    },
    attachments: [{
        filename: String,
        url: String
    }],
    tags: [String],
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient date range queries
moodSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Mood', moodSchema);
