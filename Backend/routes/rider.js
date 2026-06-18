const express = require('express');
const router = express.Router();
const Rider = require('../models/Rider');
const Vehicle = require('../models/Vehicle');

// GET /api/rider
router.get('/', async (req, res) => {
  try {
    const riders = await Rider.find().populate('vehicle');
    res.json(riders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rider
router.post('/', async (req, res) => {
  try {
    const rider = await Rider.create(req.body);
    res.json(rider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rider/registerVehicle
router.post('/registerVehicle', async (req, res) => {
  try {
    const { riderId, vehicleType, model, licenseNumber, status, truckCapacity, cargoCapacity, maxAltitude } = req.body;

    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ error: 'Rider not found' });

    const vehicleData = { vehicleType, model, licenseNumber, status };

    if (vehicleType === 'TRUCK') vehicleData.truckCapacity = truckCapacity;
    else if (vehicleType === 'SHIP') vehicleData.cargoCapacity = cargoCapacity;
    else if (vehicleType === 'AIRPLANE') vehicleData.maxLoad = maxAltitude;

    const vehicle = await Vehicle.create(vehicleData);

    rider.vehicle = vehicle._id;
    await rider.save();

    res.json('Vehicle registered and assigned to rider');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
