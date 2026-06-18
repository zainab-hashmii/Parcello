const User = require('./User');

const Admin = User.discriminator('Admin', new require('mongoose').Schema({
  authority: { type: String },
}));

module.exports = Admin;
