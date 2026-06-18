const mongoose = require('mongoose');

// Singleton document holding the variables used to compute a parcel's price:
// price = baseFare + (weight * distanceKm * ratePerKgPerKm) + (distanceKm / mileageKmPerLiter * fuelPricePerLiter)
const pricingConfigSchema = new mongoose.Schema({
  baseFare:            { type: Number, default: 100 },
  ratePerKgPerKm:       { type: Number, default: 0.5 },
  fuelPricePerLiter:    { type: Number, default: 280 },
  mileageKmPerLiter:    { type: Number, default: 12 },
}, { timestamps: true });

module.exports = mongoose.model('PricingConfig', pricingConfigSchema);
