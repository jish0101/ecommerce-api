const crypto = require('crypto');
const expressAsyncHandler = require('express-async-handler');
// const Razorpay = require('razorpay');
const { CLIENT_BASE_URL, RAZORPAY_KEYSECRET } = require('../../utils/globals');
const { PaymentModel } = require('../../models/Payments/PaymentModel');
const { OrderModel } = require('../../models/Orders/OrdersModel');

const getPayments = expressAsyncHandler(async (req, res) => {
  const payments = await PaymentModel.find();

  res.json({ status: true, data: payments });
});

const verifyPayments = async (req, res) => {
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: paymentSignature,
  } = req.body;
  console.log('🚀 ~ verifyPayments ~ req.body:', req.body);

  const body = `${orderId}|${paymentId}`;

  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEYSECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === paymentSignature;

  if (isAuthentic) {
    await PaymentModel.create({
      orderId,
      paymentId,
      paymentSignature,
    });

    await OrderModel.findOneAndUpdate({ orderId }, { isPaid: true });

    return res.redirect(`${CLIENT_BASE_URL}paymentsuccess?reference=${paymentId}`);
  }
  res.status(400).json({
    success: false,
  });
};

const getKey = async (req, res) => {
  res.status(200).json({
    status: true,
    data: RAZORPAY_KEYSECRET,
  });
};

module.exports = {
  verifyPayments,
  getKey,
  getPayments,
};
