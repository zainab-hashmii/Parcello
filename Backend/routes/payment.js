const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Parcel = require('../models/Parcel');

// GET /api/Payment
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().populate('parcel');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/Payment
router.post('/', async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/Payment/getpaymentfromparcel?id=...
router.get('/getpaymentfromparcel', async (req, res) => {
  try {
    const payment = await Payment.findOne({ parcel: req.query.id }).populate('parcel');
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
