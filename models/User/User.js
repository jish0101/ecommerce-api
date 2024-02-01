const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    code: String,
  },
  tempOtp: {
    otp: Number,
    expiredAfter: Number,
  },
  profile: {
    type: String,
    required: true,
  },
  isVerifiedEmail: {
    type: Boolean,
    require: true,
    default: false,
  },
  role: {
    type: String,
    enum: ['member', 'moderator', 'admin', 'super-admin'],
    default: 'member',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
