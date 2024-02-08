const mongoose = require('mongoose');
const { STATUSTYPES } = require('../../utils/globals');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    status: STATUSTYPES.active,
    required: true,
  },
});

const ProductCategory = mongoose.model('ProductCategory', categorySchema);

module.exports = {
  categorySchema,
  ProductCategory,
};
