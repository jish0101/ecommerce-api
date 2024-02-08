const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ProductCategory = mongoose.model('ProductCategory', categorySchema);

module.exports = {
  categorySchema,
  ProductCategory,
};
