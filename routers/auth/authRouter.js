const express = require('express');
const {
  loginUser,
  logoutUser,
  verifyEmail,
  newPasswordHandler,
} = require('../../controllers/auth/authController');
const { validateOTP, requestOTP } = require('../../middlewares/otpHandler');

const router = express.Router();

router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/send-otp', requestOTP);
router.post('/verify-email', validateOTP, verifyEmail);
router.post('/forgot-password', validateOTP, newPasswordHandler);

module.exports = router;
