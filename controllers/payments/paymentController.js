const crypto = require('crypto');
const Razorpay = require('razorpay');
const { CLIENT_BASE_URL, RAZORPAY_KEYSECRET, RAZORPAY_KEYID } = require('../../utils/globals');
const { PaymentModel } = require('../../models/Payments/PaymentModel');

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEYID,
  key_secret: RAZORPAY_KEYSECRET,
});

const checkout = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({
      success: false,
      message: 'Amount is required',
    });
  }
  const options = {
    amount: +amount * 100,
    currency: 'INR',
  };

  const order = await razorpayInstance.orders.create(options);
  return res.status(200).json({
    success: true,
    clientSecret: order,
  });
};

const paymentVerification = async (req, res) => {
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: paymentSignature,
  } = req.body;

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

    res.redirect(`${CLIENT_BASE_URL}/paymentsuccess?reference=${paymentId}`);
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

const getKey = async (req, res) => {
  res.status(200).json({
    status: true,
    key: RAZORPAY_KEYSECRET,
  });
};

module.exports = {
  checkout,
  paymentVerification,
  getKey,
};
