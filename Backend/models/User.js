const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  phone:       { type: String },
  password:    { type: String, required: true },
  accountType: { type: String, enum: ['Rider', 'Customer', 'Admin'], required: true },
}, { timestamps: true, discriminatorKey: 'accountType' });

module.exports = mongoose.model('User', userSchema);
