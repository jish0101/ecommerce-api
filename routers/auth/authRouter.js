const express = require('express');
const authController = require('../../controllers/auth/authController');
const { uploadPhoto } = require('../../middlewares/uploadImage');

const router = express.Router();

router.post('/create', uploadPhoto.single('profile'), authController.createUser);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;
