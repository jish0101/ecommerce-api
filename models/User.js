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
    type: String,
    require: true,
  },
  tempOtp: {
    type: Object,
    require: true,
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
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
