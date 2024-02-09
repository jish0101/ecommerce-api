const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  paymentSignature: {
    type: String,
    required: true,
  },
});

const PaymentModel = mongoose.model('Payment', paymentSchema);

module.exports = { PaymentModel };
