const express = require('express');
const {
  verifyPayments,
  getKey,
  getPayments,
} = require('../../controllers/payments/paymentController');

const router = express.Router();

router.post('/paymentverification', verifyPayments);
router.get('/getPayments', getPayments);
router.get('/getKey', getKey);

module.exports = router;
