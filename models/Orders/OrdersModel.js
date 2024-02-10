const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  orderAmount: {
    type: Number,
    required: true,
  },
  addressId: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: String,
        required: true,
      },
      units: {
        type: Number,
        required: true,
      },
      pricePerUnit: {
        type: Number,
        required: true,
      },
    },
  ],
  isPaid: {
    type: Boolean,
    default: false,
  },
});

module.exports = {
  OrderModel: mongoose.model('Order', OrderSchema),
};
