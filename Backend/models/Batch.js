const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  weight:          { type: Number, default: 0 },
  destination:     { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  currentLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  status:          { type: String, enum: ['Pending', 'Ready', 'IN_TRANSIT', 'Delivered'], default: 'Pending' },
  rider:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

// Trigger: a batch is auto-promoted to Ready once it carries >= 80kg, so the
// rule lives in one place instead of being re-implemented in every route that
// touches batch.weight.
batchSchema.pre('save', function (next) {
  if (this.isModified('weight') && this.status === 'Pending' && this.weight >= 80) {
    this.status = 'Ready';
  }
  next();
});

module.exports = mongoose.model('Batch', batchSchema);
