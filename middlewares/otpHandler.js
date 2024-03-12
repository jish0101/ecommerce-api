const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User/User');
const { sendEmail, templateList } = require('../utils/emailService');
const { OTP_REQ_TYPES } = require('../utils/globals');

const getOTP = (type, expirationTimeInMinutes = 10) => {
  const otp = crypto.randomInt(100000, 1000000);
  const currentTimestamp = Date.now();
  const expiredAfter = currentTimestamp + expirationTimeInMinutes * 60 * 1000;
  return { otp, expiredAfter, type };
};

const validateOTP = (type) =>
  asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!otp) {
      res.status(400);
      throw new Error('No OTP Provided!');
    }

    if (!email) {
      res.status(400);
      throw new Error('Provide Email!');
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(404);
      throw new Error('No user found with this email!');
    }

    if (existingUser.tempOtp?.otp === parseInt(otp, 10)) {
      if (type && type !== existingUser.tempOtp?.type) {
        res.status(400);
        throw new Error('Invalid Action!');
      }
      if (Date.now() > existingUser.tempOtp?.expiredAfter) {
        throw new Error('OTP has been expired!');
      }
      // marking token used
      await User.findOneAndUpdate({ email }, { tempOtp: {} });
      return next();
    }
    res.status(400);
    throw new Error('Invalid OTP!');
  });

const requestOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const { type } = req.query;
  const tempOtp = getOTP(type, 10);

  if (email && type) {
    if (OTP_REQ_TYPES[type]) {
      const updatedUser = await User.findOneAndUpdate({ email }, { tempOtp });
      if (updatedUser) {
        const isOTPSent = await sendEmail(email, templateList?.otp?.name, { otp: tempOtp?.otp });
        if (!isOTPSent) {
          throw new Error('Error in sending otp.');
        }
        return res.json({ status: true, message: `Otp successfully sent to user email` });
      }
    }
  }
  if (tempOtp) {
    req.body.tempOtp = tempOtp;
    return next();
  }
  throw new Error('Failed to generate otp.');
});

module.exports = {
  requestOTP,
  validateOTP,
};
