const expressAsyncHandler = require('express-async-handler');
const Product = require('../../models/Products/Product');
const { ProductCategory } = require('../../models/ProductCategory/ProductCategory');
const { ProductCurrency } = require('../../models/ProductCurrency/ProductCurrency');
const { STATUSTYPES } = require('../../utils/globals');

const createProduct = expressAsyncHandler(async (req, res) => {
  const { name, image, price, stock, categoryId, currencyId, productMaterial, productDescription } =
    req.body;

  // Validate category
  const category = await ProductCategory.findById(categoryId);
  if (!category) {
    return res.status(400).json({ status: false, message: 'Invalid category ID' });
  }

  // Validate currency
  const currency = await ProductCurrency.findById(currencyId);
  if (!currency) {
    return res.status(400).json({ status: false, message: 'Invalid currency ID' });
  }

  const product = new Product({
    name,
    image,
    price,
    stock,
    category: category._id,
    currency: currency._id,
    productMaterial,
    productDescription,
  });

  await product.save();

  return res.json({ status: true, message: 'Successfully created a product', data: product });
});

const getProducts = expressAsyncHandler(async (req, res) => {
  const { id, name, categoryId, currencyId, status, page = 1, rowCount = 10 } = req.query;

  const pageNum = parseInt(page, 10);
  const size = parseInt(rowCount, 10);

  const allowedStatusToSend = [STATUSTYPES.active, STATUSTYPES.inactive];

  const query = {
    status: { $in: allowedStatusToSend },
  };

  if (categoryId) {
    query.category = categoryId;
  }

  if (currencyId) {
    query.currency = currencyId;
  }

  if (name) {
    query.name = { $regex: new RegExp(name, 'i') };
  }

  if (status && allowedStatusToSend.includes(status)) {
    query.status = status;
  }

  if (id) {
    const foundRes = await Product.findById(id).populate('category').populate('currency');
    if (foundRes) {
      return res.json({ status: true, data: foundRes });
    }
    throw Error('No product found with provided Id');
  }

  const skip = (pageNum - 1) * size;
  const totalRecords = await Product.countDocuments(query);
  const foundProducts = await Product.find(query)
    .populate('category')
    .populate('currency')
    .skip(skip)
    .limit(size)
    .sort({ createdAt: 1 });

  if (foundProducts.length > 0) {
    const totalPages = Math.ceil(totalRecords / size);
    return res.json({
      status: true,
      data: foundProducts,
      pagination: {
        totalPages,
        totalRecords,
        page: pageNum,
      },
    });
  }

  return res.json({ status: true, data: [] });
});

const updateProduct = expressAsyncHandler(async (req, res) => {
  const { id, name, image, price, stock, categoryId, currencyId, status } = req.body;
  const isImageUpdate = req.file;
  const updatedAt = Date.now();

  // Validate category
  const category = await ProductCategory.findById(categoryId);
  if (!category) {
    return res.status(400).json({ status: false, message: 'Invalid category ID' });
  }

  // Validate currency
  const currency = await ProductCurrency.findById(currencyId);
  if (!currency) {
    return res.status(400).json({ status: false, message: 'Invalid currency ID' });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name,
      image: isImageUpdate ? image : undefined,
      price,
      category: category._id,
      currency: currency._id,
      stock,
      status,
      updatedAt,
    },
    { new: true },
  )
    .populate('category')
    .populate('currency');

  return res.json({
    status: true,
    message: 'Successfully updated a product',
    data: updatedProduct,
  });
});

const deleteProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.query;

  const updatedProduct = await Product.findByIdAndUpdate(id, { status: STATUSTYPES.deleted });

  if (updatedProduct) {
    return res.json({ status: true, message: 'Successfully deleted a product' });
  }

  throw Error('Could not update product');
});

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
