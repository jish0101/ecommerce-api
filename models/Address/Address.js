const mongoose = require('mongoose');
const { STATUSTYPES } = require('../../utils/globals');

const AddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: STATUSTYPES.active,
  },
});

const Address = mongoose.model('Address', AddressSchema);
module.exports = { Address, AddressSchema };
