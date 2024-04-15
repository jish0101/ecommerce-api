const router = require('express').Router();
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../../controllers/user/userController');
// const jsonParser = require('../../middlewares/jsonParser');
const { requestOTP } = require('../../middlewares/otpHandler');
const roleHandler = require('../../middlewares/roleHandler');
const { uploadPhoto, imageValidator } = require('../../middlewares/uploadImage');
const verifyJWT = require('../../middlewares/verifyJWT');
const { ADMIN_ROLES } = require('../../utils/globals');

router
  .route('/')
  .post(uploadPhoto.single('profile'), imageValidator, requestOTP, createUser)
  .get(verifyJWT, roleHandler(ADMIN_ROLES), getUsers)
  .put(verifyJWT, uploadPhoto.single('profile'), imageValidator, requestOTP, updateUser)
  .delete(verifyJWT, roleHandler(ADMIN_ROLES), deleteUser);

module.exports = router;
