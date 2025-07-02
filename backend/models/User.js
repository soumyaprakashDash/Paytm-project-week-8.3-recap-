const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: String,
  firstName: String,
  lastName: String
});

module.exports = mongoose.model('User', userSchema);
