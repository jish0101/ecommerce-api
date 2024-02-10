const express = require('express');
const {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} = require('../../controllers/orders/orderController');

const router = express.Router();

router.route('/').get(getOrders).post(createOrder).put(updateOrder).delete(deleteOrder);

module.exports = router;
