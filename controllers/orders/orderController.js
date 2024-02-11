/* eslint-disable no-underscore-dangle */
// const Razorpay = require('razorpay');
const expressAsyncHandler = require('express-async-handler');
// const { RAZORPAY_KEYID, RAZORPAY_KEYSECRET } = require('../../utils/globals');
const { OrderModel } = require('../../models/Orders/OrdersModel');
const Product = require('../../models/Products/Product');
const { normaliseDate } = require('../../utils/utility');

// const razorpayInstance = new Razorpay({
//   key_id: RAZORPAY_KEYID,
//   key_secret: RAZORPAY_KEYSECRET,
// });

const createOrder = expressAsyncHandler(async (req, res) => {
  const { products } = req.body;
  const productIds = products.map((product) => product._id);
  const allSelectedProducts = await Product.find({ _id: { $in: productIds } });

  const orderProducts = [];
  const insufficientStockProducts = [];

  let orderAmount = 0;
  products.forEach(async (product) => {
    const selectedProduct = allSelectedProducts.find((p) => p._id.toString() === product._id);
    const productUnits = parseInt(product.units, 10);
    const price = selectedProduct.price * productUnits;

    if (selectedProduct.stock < productUnits) {
      insufficientStockProducts.push({
        product: selectedProduct,
        requestedUnits: productUnits,
        availableStock: selectedProduct.stock,
      });
    } else {
      selectedProduct.stock -= productUnits;

      orderProducts.push({
        productId: selectedProduct._id,
        units: productUnits,
        pricePerUnit: selectedProduct.price,
      });

      orderAmount += price;
      await selectedProduct.save();
    }
  });

  console.log('orderProducts', orderProducts);

  let order;
  if (orderProducts.length > 0) {
    order = await OrderModel.create({
      orderId: 'Test ID',
      userId: req.userId,
      orderAmount,
      addressId: 'default',
      products: orderProducts,
    });
  }

  return res.status(201).json({
    status: true,
    message: 'Order placed successfully.',
    data: {
      order,
      insufficientStockProducts,
    },
  });
});

const getOrders = expressAsyncHandler(async (req, res) => {
  const { startDate, endDate, page = 1, rowCount = 10 } = req.query;
  const dateFrom = normaliseDate(startDate);
  const dateTo = normaliseDate(endDate);
  const query = { userId: req.userId };
  const size = parseInt(rowCount, 10);

  if (dateFrom && dateTo) {
    query.createdAt = { $gte: new Date(dateFrom), $lte: new Date(dateTo) };
  }

  const options = {
    sort: { createdAt: -1 },
    limit: size,
    skip: (parseInt(page, 10) - 1) * size,
  };

  const orders = await OrderModel.find(query, null, options);
  const totalRecords = await OrderModel.countDocuments(query);
  const totalPages = Math.ceil(totalRecords / rowCount);

  res.json({
    status: true,
    message: 'Successfully fetched orders',
    data: orders,
    pagination: {
      totalPages,
      totalRecords,
      page,
    },
  });
});

const updateOrder = expressAsyncHandler(async (req, res) => {
  res.json({ status: true, message: 'Successfully updated an order' });
});

const deleteOrder = expressAsyncHandler(async (req, res) => {
  res.json({ status: true, message: 'Successfully deleted an order' });
});

module.exports = { createOrder, getOrders, updateOrder, deleteOrder };
