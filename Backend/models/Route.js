const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  origin:      { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  basePayment: { type: Number, required: true },
});

module.exports = mongoose.model('Route', routeSchema);
