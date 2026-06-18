const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  city:    { type: String, required: true },
});

module.exports = mongoose.model('Location', locationSchema);
