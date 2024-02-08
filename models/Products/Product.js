const mongoose = require('mongoose');
const { categorySchema } = require('../ProductCategory/ProductCategory');
const { STATUSTYPES } = require('../../utils/globals');
const { ProductCurrencySchema } = require('../ProductCurrency/ProductCurrency');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  currency: ProductCurrencySchema,
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: categorySchema,
  status: {
    type: String,
    default: STATUSTYPES.active,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
