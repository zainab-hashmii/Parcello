const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

// GET /api/route
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().populate('origin destination');
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/route
router.post('/', async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
