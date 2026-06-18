const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  weight:          { type: Number, default: 0 },
  destination:     { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  currentLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  status:          { type: String, enum: ['Pending', 'Ready', 'IN_TRANSIT', 'Delivered'], default: 'Pending' },
  rider:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
