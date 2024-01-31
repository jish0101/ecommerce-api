const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController');
const { uploadPhoto } = require('../../middlewares/uploadImage');

router.post('/create', uploadPhoto.single('profile'), authController.createUser);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);
router.get('/test', (req, res) => {
  res.json({
    message: 'This is allowed!',
  });
});

module.exports = router;
