const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');

// GET /api/Rating
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find().populate('rider');
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/Rating
router.post('/', async (req, res) => {
  try {
    const rating = await Rating.create(req.body);
    res.json(rating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
