const mongoose = require('mongoose');

const parcelLogSchema = new mongoose.Schema({
  parcel:        { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel', required: true },
  status:        {
    type: String,
    enum: ['PICKED_UP', 'WAITING', 'IN_TRANSIT', 'AT_WAREHOUSE', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY'],
    default: 'WAITING',
  },
  placementDate: { type: String },
  location:      { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  deliveredDate: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('ParcelLog', parcelLogSchema);
