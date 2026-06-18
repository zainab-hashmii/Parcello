const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
  type:        { type: String },
  weight:      { type: Number, required: true },
  origin:      { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  address:     { type: String },
  sendAddress: { type: String },
  customer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batch:       { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
}, { timestamps: true });

// Trigger: whenever a Parcel is newly inserted, automatically create its
// initial ParcelLog (WAITING) and a Pending Payment if they don't exist yet.
// This fires for every insertion path (API route, seed script, Compass, etc.),
// not just the /addParcel route — so the lifecycle records can never be skipped.
parcelSchema.post('save', async function (doc) {
  if (!this.wasNew) return;

  const ParcelLog = mongoose.model('ParcelLog');
  const Payment = mongoose.model('Payment');
  const Route = mongoose.model('Route');

  const existingLog = await ParcelLog.findOne({ parcel: doc._id });
  if (!existingLog) {
    await ParcelLog.create({
      parcel: doc._id,
      status: 'WAITING',
      placementDate: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
      location: doc.origin,
    });
  }

  const existingPayment = await Payment.findOne({ parcel: doc._id });
  if (!existingPayment && doc.origin && doc.destination) {
    const route = await Route.findOne({ origin: doc.origin, destination: doc.destination });
    let amount = null;

    if (route) {
      amount = route.basePayment * doc.weight;
    } else {
      const Location = mongoose.model('Location');
      const { getOrCreateConfig, computePrice } = require('../routes/pricing');
      const [origin, destination] = await Promise.all([
        Location.findById(doc.origin),
        Location.findById(doc.destination),
      ]);
      if (origin?.lat != null && destination?.lat != null) {
        const { haversineKm } = require('../utils/distance');
        const distanceKm = haversineKm(origin, destination);
        const config = await getOrCreateConfig();
        amount = computePrice(config, doc.weight, distanceKm).amount;
      }
    }

    if (amount != null) {
      await Payment.create({ amount, paymentStatus: 'Pending', parcel: doc._id });
    }
  }
});

parcelSchema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

module.exports = mongoose.model('Parcel', parcelSchema);
