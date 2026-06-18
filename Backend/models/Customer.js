const User = require('./User');

const Customer = User.discriminator('Customer', new require('mongoose').Schema({
  address: { type: String },
}));

module.exports = Customer;
