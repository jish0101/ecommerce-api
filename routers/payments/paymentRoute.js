const express = require('express');
const {
  checkout,
  paymentVerification,
  getKey,
} = require('../../controllers/payments/paymentController');

const router = express.Router();

router.route('/checkout').post(checkout);

router.route('/paymentverification').post(paymentVerification);

router.get('/getKey', getKey);

module.exports = router;
