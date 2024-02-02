const express = require('express');
const {
  createUser,
  loginUser,
  logoutUser,
  verifyEmail,
  newPasswordHandler,
} = require('../../controllers/auth/authController');
const { uploadPhoto, imageValidator } = require('../../middlewares/uploadImage');
const { userValidationSchema } = require('../../models/User/userValidationSchema');
const { schemaValidator } = require('../../middlewares/schemaValidator');
const jsonParser = require('../../middlewares/jsonParser');
const { validateOTP, requestOTP } = require('../../middlewares/otpHandler');

const router = express.Router();

router.post(
  '/create',
  uploadPhoto.single('profile'),
  jsonParser(['address']),
  imageValidator,
  schemaValidator.body(userValidationSchema),
  requestOTP,
  createUser,
);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/send-otp', requestOTP);
router.post('/verify-email', validateOTP, verifyEmail);
router.post('/forgot-password', validateOTP, newPasswordHandler);

module.exports = router;
