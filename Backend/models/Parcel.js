const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
  type:        { type: String },
  weight:      { type: Number, required: true },
  origin:      { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  address:     { type: String },
  sendAddress: { type: String },
  customer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batch:       { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
}, { timestamps: true });

module.exports = mongoose.model('Parcel', parcelSchema);
