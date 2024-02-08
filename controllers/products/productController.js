const expressAsyncHandler = require('express-async-handler');
const Product = require('../../models/Products/Product');
const { STATUSTYPES } = require('../../utils/globals');
const { defaultProductCurrency } = require('../../models/ProductCurrency/ProductCurrency');

const createProduct = expressAsyncHandler(async (req, res) => {
  const { name, image, price, stock, category } = req.body;

  const product = new Product({
    name,
    image,
    price,
    category,
    stock,
    currency: defaultProductCurrency,
  });

  res.json({ status: true, message: 'Successfully created a product', data: product });
});

const getProducts = expressAsyncHandler(async (req, res) => {
  const { id, name, categoryId, status, page = 1, rowCount = 10 } = req.query;

  const pageNum = parseInt(page, 10);
  const size = parseInt(rowCount, 10);

  const allowedStatusToSend = [STATUSTYPES.active, STATUSTYPES.inactive];

  const query = {
    status: { $in: allowedStatusToSend },
  };

  if (categoryId) {
    query['category._id'] = categoryId;
  }

  if (name) {
    query.name = { $regex: new RegExp(name, 'i') };
  }

  if (status && allowedStatusToSend.includes(status)) {
    query.status = status;
  }

  if (id) {
    // eslint-disable-next-line no-underscore-dangle
    query._id = id;
    const foundRes = await Product.findById(id);
    if (foundRes) {
      return res.json({ status: true, data: foundRes });
    }
    throw Error('No product found with provided Id');
  }

  const skip = (pageNum - 1) * size;
  const totalRecords = await Product.countDocuments(query);
  const foundProducts = await Product.find(query).skip(skip).limit(size).sort({ createdAt: 1 });

  if (foundProducts.length > 0) {
    const totalPages = Math.ceil(totalRecords / size);
    return res.json({
      status: true,
      data: foundProducts,
      pagination: {
        totalPages,
        totalRecords,
        page,
      },
    });
  }

  return res.json({ status: true, data: [] });
});

const updateProduct = expressAsyncHandler(async (req, res) => {
  const { id, name, image, price, stock, category, status } = req.body;
  const isImageUpdate = req.file;
  const updatedAt = Date.now();

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name,
      image: isImageUpdate ? image : undefined,
      price,
      category,
      stock,
      currency: defaultProductCurrency,
      status,
      updatedAt,
    },
    { new: true },
  );

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
