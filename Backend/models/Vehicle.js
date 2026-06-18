const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  model:         { type: String, required: true },
  licenseNumber: { type: String, required: true },
  status:        { type: String, enum: ['IN_TRANSIT', 'AVAILABLE', 'NOT_AVAILABLE'], default: 'AVAILABLE' },
  vehicleType:   { type: String, enum: ['TRUCK', 'SHIP', 'AIRPLANE'], required: true },
  // Truck
  truckCapacity: { type: Number },
  // Ship
  cargoCapacity: { type: Number },
  // Airplane
  maxLoad:       { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
