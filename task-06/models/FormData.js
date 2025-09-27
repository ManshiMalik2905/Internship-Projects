const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  message: String
});

module.exports = mongoose.model('FormData', formSchema);
