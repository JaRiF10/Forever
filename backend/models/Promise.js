const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromiseSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ['open', 'doing', 'done', 'missed'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Promise', PromiseSchema);
