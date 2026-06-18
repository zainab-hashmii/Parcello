const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  city:    { type: String, required: true },
  label:   { type: String }, // full searched/display address, e.g. "Gulberg III, Lahore, Punjab, Pakistan"
  lat:     { type: Number },
  lng:     { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
