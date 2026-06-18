const express = require('express');
const router = express.Router();
const ParcelLog = require('../models/ParcelLog');
const Parcel = require('../models/Parcel');

// GET /api/parcelLog?parcelID=...
router.get('/', async (req, res) => {
  try {
    const log = await ParcelLog.findOne({ parcel: req.query.parcelID })
      .populate({ path: 'parcel', populate: ['origin', 'destination'] })
      .populate('location');
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/parcelLog/changeStatus
router.post('/changeStatus', async (req, res) => {
  try {
    const { parcelId, status } = req.body;

    const log = await ParcelLog.findOne({ parcel: parcelId });
    if (!log) return res.status(404).json({ error: 'Parcel log not found' });

    log.status = status;
    await log.save();

    res.json('Status Changed Successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/parcelLog/changeDeliveredDate
router.post('/changeDeliveredDate', async (req, res) => {
  try {
    const { parcelId, deliveredDate } = req.body;

    const log = await ParcelLog.findOne({ parcel: parcelId });
    if (!log) return res.status(404).json({ error: 'Parcel log not found' });

    log.deliveredDate = deliveredDate;
    log.status = 'DELIVERED';
    await log.save();

    res.json('Status Changed Successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
