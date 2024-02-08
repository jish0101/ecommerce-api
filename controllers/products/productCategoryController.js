const expressAsyncHandler = require('express-async-handler');
const { ProductCategory } = require('../../models/ProductCategory/ProductCategory');
const { STATUSTYPES } = require('../../utils/globals');

const createProductCategory = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  const productCategory = new ProductCategory({ name, status: STATUSTYPES.active });
  await productCategory.save();

  res.json({ status: true, message: 'Successfully created a product', data: productCategory });
});

const getProductsCategory = expressAsyncHandler(async (req, res) => {
  const { id, name, status, page = 1, rowCount = 10 } = req.query;
  const allowedStatusToSend = [STATUSTYPES.active, STATUSTYPES.inactive];

  if (id) {
    const foundRes = await ProductCategory.findOne({
      _id: id,
      status: { $in: allowedStatusToSend },
    });
    if (foundRes) {
      return res.json({ status: true, data: foundRes });
    }
    res.status(404);
    throw Error('No product found with this id');
  }

  const query = {
    status: { $in: allowedStatusToSend },
  };

  if (status && allowedStatusToSend.includes(status)) {
    query.status = status;
  }

  if (name) {
    query.name = { $regex: new RegExp(name, 'i') };
  }

  const pageNum = parseInt(page, 10);
  const size = parseInt(rowCount, 10);

  const skip = (pageNum - 1) * size;
  const totalRecords = await ProductCategory.countDocuments(query);
  const foundRes = await ProductCategory.find(query).skip(skip).limit(size).sort({ createdAt: 1 });

  if (foundRes) {
    const totalPages = Math.ceil(totalRecords / size);
    return res.json({
      status: true,
      data: foundRes,
      pagination: {
        page,
        totalPages,
        totalRecords,
      },
    });
  }
  res.status(404);
  throw Error('No product found');
});

const updateProductCategory = expressAsyncHandler(async (req, res) => {
  const { id, name, status } = req.body;

  const updatedProductCategory = await ProductCategory.findByIdAndUpdate(
    id,
    { name, status },
    { new: true },
  );

  if (updatedProductCategory) {
    res.json({
      status: true,
      message: 'Successfully updated a product',
      data: updatedProductCategory,
    });
  }
  res.status(500);
  throw Error('Failed to update product category');
});

const deleteProductCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.query;

  const deletedProductCategory = await ProductCategory.findByIdAndUpdate(id, {
    status: STATUSTYPES.deleted,
  });

  if (deletedProductCategory) {
    res.json({ status: true, message: 'Successfully deleted the product category' });
  }
  throw Error('Failed to delete product category');
});

module.exports = {
  createProductCategory,
  getProductsCategory,
  updateProductCategory,
  deleteProductCategory,
};
