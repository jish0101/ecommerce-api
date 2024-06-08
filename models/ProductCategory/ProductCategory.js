const mongoose = require('mongoose');
const { STATUSTYPES } = require('../../utils/globals');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: STATUSTYPES.active,
  },
});

const ProductCategory = mongoose.model('ProductCategory', categorySchema);

module.exports = {
  categorySchema,
  ProductCategory,
};
