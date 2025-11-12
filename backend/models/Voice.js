const mongoose = require('mongoose');

const voiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        default: 'audio/webm'
    },
    lengthSeconds: {
        type: Number,
        default: 0
    },
    transcript: {
        type: String,
        default: null
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Voice', voiceSchema);
