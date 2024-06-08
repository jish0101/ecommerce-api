const mongoose = require('mongoose');
const { STATUSTYPES } = require('../../utils/globals');

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
  currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCurrency',
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 3000,
  },
  productMaterial: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 1000,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true,
  },
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
