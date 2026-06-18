const User = require('./User');
const mongoose = require('mongoose');

const Rider = User.discriminator('Rider', new mongoose.Schema({
  vehicle:   { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null },
  accountNo: { type: String, default: null },
  dueAmount: { type: Number, default: 0 },
}));

module.exports = Rider;
