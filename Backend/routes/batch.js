const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');
const Location = require('../models/Location');
const Rider = require('../models/Rider');
const Route = require('../models/Route');

// GET /api/Batch
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find().populate('destination currentLocation rider');
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/Batch/byLocation?city=...&country=...
router.get('/byLocation', async (req, res) => {
  try {
    const { city, country } = req.query;
    const location = await Location.findOne({ city, country });
    if (!location) return res.json([]);

    const batches = await Batch.find({ currentLocation: location._id, status: 'Ready' })
      .populate('destination currentLocation rider');
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/Batch/getriderbatches?riderId=...
router.get('/getriderbatches', async (req, res) => {
  try {
    const batches = await Batch.find({ rider: req.query.riderId })
      .populate('destination currentLocation rider');
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/Batch
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.status) data.status = 'Pending';
    const batch = await Batch.create(data);
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/Batch/dropBatch?batchId=...
router.post('/dropBatch', async (req, res) => {
  try {
    const batch = await Batch.findById(req.query.batchId);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    batch.rider = null;
    batch.status = 'Ready';
    await batch.save();

    res.json('Dropped');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/Batch/changeCurrentRider
router.post('/changeCurrentRider', async (req, res) => {
  try {
    const { batchId, riderId } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    batch.rider = riderId;
    await batch.save();

    res.json('Status Changed Successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/Batch/changeLocation
router.post('/changeLocation', async (req, res) => {
  try {
    const { batchId, riderId, location: locationCity } = req.body;

    const batch = await Batch.findById(batchId).populate('currentLocation rider');
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    const newLocation = await Location.findOne({ city: locationCity });
    if (!newLocation) return res.status(404).json({ error: 'Location not found' });

    const oldLocation = batch.currentLocation;
    const rider = await Rider.findById(batch.rider);
    if (!rider) return res.status(404).json({ error: 'Rider not found' });

    const route = await Route.findOne({ origin: oldLocation._id, destination: newLocation._id });
    if (!route) return res.status(404).json({ error: 'Route not found' });

    const riderPayment = route.basePayment * batch.weight * 0.03;
    rider.dueAmount += riderPayment;
    await rider.save();

    batch.currentLocation = newLocation._id;
    await batch.save();

    res.json('Status Changed Successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/Batch/assignRider
router.post('/assignRider', async (req, res) => {
  try {
    const { batchId, riderId } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    batch.rider = riderId;
    batch.status = 'IN_TRANSIT';
    await batch.save();

    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
