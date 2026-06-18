const express = require('express');
const router = express.Router();
const PricingConfig = require('../models/PricingConfig');
const Location = require('../models/Location');
const { haversineKm } = require('../utils/distance');

async function getOrCreateConfig() {
  let config = await PricingConfig.findOne();
  if (!config) config = await PricingConfig.create({});
  return config;
}

// A delivery vehicle carries many parcels per trip, so a single parcel only
// owes its proportional share of that trip's fuel cost — not the whole tank.
// STANDARD_LOAD_KG mirrors the batch "Ready" threshold used elsewhere (80kg).
const STANDARD_LOAD_KG = 80;

function computePrice(config, weight, distanceKm) {
  const distanceCost = weight * distanceKm * config.ratePerKgPerKm;
  const litersUsed = distanceKm / config.mileageKmPerLiter;
  const tripFuelCost = litersUsed * config.fuelPricePerLiter;
  const fuelCost = tripFuelCost * (weight / STANDARD_LOAD_KG);
  const amount = config.baseFare + distanceCost + fuelCost;
  return {
    baseFare: config.baseFare,
    distanceCost: Math.round(distanceCost * 100) / 100,
    fuelCost: Math.round(fuelCost * 100) / 100,
    amount: Math.round(amount * 100) / 100,
  };
}

// GET /api/pricing — current pricing config (admin)
router.get('/', async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pricing — update pricing config (admin)
router.post('/', async (req, res) => {
  try {
    const { baseFare, ratePerKgPerKm, fuelPricePerLiter, mileageKmPerLiter } = req.body;
    const config = await getOrCreateConfig();

    if (baseFare !== undefined) config.baseFare = baseFare;
    if (ratePerKgPerKm !== undefined) config.ratePerKgPerKm = ratePerKgPerKm;
    if (fuelPricePerLiter !== undefined) config.fuelPricePerLiter = fuelPricePerLiter;
    if (mileageKmPerLiter !== undefined) config.mileageKmPerLiter = mileageKmPerLiter;

    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pricing/quote?originId=...&destinationId=...&weight=...
router.get('/quote', async (req, res) => {
  try {
    const { originId, destinationId, weight } = req.query;
    const w = Number(weight);
    if (!originId || !destinationId || !w || w <= 0) {
      return res.status(400).json({ error: 'originId, destinationId and a positive weight are required' });
    }

    const [origin, destination] = await Promise.all([
      Location.findById(originId),
      Location.findById(destinationId),
    ]);
    if (!origin || !destination) return res.status(404).json({ error: 'Origin or destination not found' });
    if (origin.lat == null || destination.lat == null) {
      return res.status(422).json({ error: 'Selected locations are missing coordinates for distance pricing' });
    }

    const distanceKm = Math.round(haversineKm(origin, destination) * 10) / 10;
    const config = await getOrCreateConfig();
    const price = computePrice(config, w, distanceKm);

    res.json({ distanceKm, weight: w, ...price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.computePrice = computePrice;
module.exports.getOrCreateConfig = getOrCreateConfig;
