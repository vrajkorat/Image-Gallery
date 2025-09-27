const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  caption: { type: String, default: '' },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploaderName: String,
  uploaderEmail: String,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', ImageSchema);