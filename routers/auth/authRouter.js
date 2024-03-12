const express = require('express');
const {
  loginUser,
  logoutUser,
  verifyEmail,
  newPasswordHandler,
} = require('../../controllers/auth/authController');
const { validateOTP, requestOTP } = require('../../middlewares/otpHandler');
const { OTP_REQ_TYPES } = require('../../utils/globals');

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/send-otp', requestOTP);
router.post('/verify-email', validateOTP(OTP_REQ_TYPES['resend-otp']), verifyEmail);
router.post('/forgot-password', validateOTP(OTP_REQ_TYPES['forgot-password']), newPasswordHandler);

module.exports = router;
