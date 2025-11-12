const mongoose = require('mongoose');

const timeCapsuleSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    title: {
        type: String,
        default: 'Untitled Capsule'
    },
    content: {
        type: String,
        required: true
    },
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: Date
    }],
    unlockAt: {
        type: Date,
        required: true
    },
    isOpened: {
        type: Boolean,
        default: false
    },
    openedAt: {
        type: Date,
        default: null
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

// TTL index to auto-delete old opened capsules (optional, set to 90 days after opening)
timeCapsuleSchema.index({ openedAt: 1 }, { expireAfterSeconds: 7776000, sparse: true });

module.exports = mongoose.model('TimeCapsule', timeCapsuleSchema);
