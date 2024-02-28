const mongoose = require('mongoose');

const Feedback = new mongoose.Schema({
  productId: mongoose.Schema.ObjectId,
  userId: mongoose.Schema.ObjectId,
  rating: {
    type: String,
    required: true,
    trim: true,
    enum: [1, 2, 3, 4, 5],
  },
  feedback: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 100,
  },
});

module.exports = mongoose.model('Feedback', Feedback);
