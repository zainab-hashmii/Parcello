const express = require('express');
const router = express.Router();
const Parcel = require('../models/Parcel');
const ParcelLog = require('../models/ParcelLog');
const Payment = require('../models/Payment');
const Batch = require('../models/Batch');
const Location = require('../models/Location');
const Route = require('../models/Route');
const User = require('../models/User');

// POST /api/parcel/addParcel — main parcel creation flow
router.post('/addParcel', async (req, res) => {
  try {
    const {
      customerId, destinationCity, destinationCountry,
      originCity, originCountry, placementDate,
      type, weight, address, sendAddress,
    } = req.body;

    const customer = await User.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const destination = await Location.findOne({ city: destinationCity, country: destinationCountry });
    const origin = await Location.findOne({ city: originCity, country: originCountry });
    if (!destination || !origin) return res.status(404).json({ error: 'Origin or destination not found' });

    // Find or create batch
    let batch = await Batch.findOne({
      currentLocation: origin._id,
      destination: destination._id,
      status: 'Pending',
      weight: { $lt: 100 },
    });

    if (!batch || batch.weight + weight > 100) {
      const newStatus = weight >= 80 ? 'Ready' : 'Pending';
      batch = await Batch.create({ weight, destination: destination._id, currentLocation: origin._id, status: newStatus });
    } else {
      batch.weight += weight;
      if (batch.weight >= 80) batch.status = 'Ready';
      await batch.save();
    }

    const route = await Route.findOne({ origin: origin._id, destination: destination._id });
    if (!route) return res.status(404).json({ error: 'No route found from origin to destination' });

    // Parcel.post('save') trigger auto-creates the matching ParcelLog (WAITING)
    // and Payment (Pending, amount = route.basePayment * weight) once saved.
    await Parcel.create({
      type, weight, origin: origin._id, destination: destination._id,
      customer: customerId, address, sendAddress, batch: batch._id,
    });

    res.json('Parcel, Parcel_log, Payment Have been Added');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/parcel/getparcelsofbatch?batchId=...
router.get('/getparcelsofbatch', async (req, res) => {
  try {
    const parcels = await Parcel.find({ batch: req.query.batchId })
      .populate('origin destination customer batch');
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/parcel/getparcelsofcustomer?customerId=...
router.get('/getparcelsofcustomer', async (req, res) => {
  try {
    const parcels = await Parcel.find({ customer: req.query.customerId })
      .populate('origin destination batch');
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
