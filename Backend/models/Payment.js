const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount:        { type: Number, required: true },
  paymentDate:   { type: String, default: null },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Partially_Paid'], default: 'Pending' },
  parcel:        { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
