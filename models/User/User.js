const mongoose = require('mongoose');
const { STATUSTYPES, USER_ROLES } = require('../../utils/globals');

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
  tempOtp: {
    otp: Number,
    expiredAfter: Number,
    type: {
      type: String,
    },
  },
  profile: {
    type: String,
    require: true,
  },
  isVerifiedEmail: {
    type: Boolean,
    default: false,
    require: true,
  },
  status: {
    type: String,
    default: STATUSTYPES.active,
    require: true,
  },
  role: {
    type: Number,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.member,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedBy: {
    type: String,
    default: '',
  },
  refreshToken: {
    type: String,
    require: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
