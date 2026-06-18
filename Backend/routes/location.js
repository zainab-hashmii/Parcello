const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// GET /api/Location
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/Location
router.post('/', async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
