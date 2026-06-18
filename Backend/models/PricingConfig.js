const mongoose = require('mongoose');

// Singleton document holding the variables used to compute a parcel's price.
// See routes/pricing.js computePrice() for the exact formula — the fuel
// component is the parcel's weight-proportional share of a full trip's cost,
// not the whole tank, since one trip carries many parcels.
const pricingConfigSchema = new mongoose.Schema({
  baseFare:            { type: Number, default: 150 },
  ratePerKgPerKm:       { type: Number, default: 0.03 },
  fuelPricePerLiter:    { type: Number, default: 280 },
  mileageKmPerLiter:    { type: Number, default: 35 },
}, { timestamps: true });

module.exports = mongoose.model('PricingConfig', pricingConfigSchema);
