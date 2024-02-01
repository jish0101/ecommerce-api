const express = require('express');
const authController = require('../../controllers/auth/authController');
const { uploadPhoto } = require('../../middlewares/uploadImage');
const { userValidationSchema } = require('../../models/User/userValidationSchema');
const { schemaValidator } = require('../../middlewares/schemaValidator');
const jsonParser = require('../../middlewares/jsonParser');

const router = express.Router();

router.post(
  '/create',
  uploadPhoto.single('profile'),
  jsonParser(['address']),
  schemaValidator.body(userValidationSchema),
  authController.createUser,
);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;
