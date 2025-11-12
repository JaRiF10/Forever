const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VersionSchema = new Schema({
  body: { type: String, required: true },
  editedAt: { type: Date, default: Date.now }
}, { _id: false });

const LetterSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  unlockAt: { type: Date },
  versions: { type: [VersionSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Letter', LetterSchema);
