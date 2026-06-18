const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  stars:  { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  rider:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
