const expressAsyncHandler = require('express-async-handler');

const createProductCategory = expressAsyncHandler(async (req, res) =>
  res.json({ status: true, message: 'Successfully created a product' }),
);
const getProductsCategory = expressAsyncHandler(async (req, res) =>
  res.json({ status: true, data: null }),
);

const updateProductCategory = expressAsyncHandler(async (req, res) =>
  res.json({ status: true, message: 'Successfully updated a product' }),
);
const deleteProductCategory = expressAsyncHandler(async (req, res) =>
  res.json({ status: true, message: 'Successfully deleted a product' }),
);

module.exports = {
  createProductCategory,
  getProductsCategory,
  updateProductCategory,
  deleteProductCategory,
};
