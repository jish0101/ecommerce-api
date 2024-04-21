const router = require('express').Router();
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../../controllers/user/userController');
const { multerInstance } = require('../../middlewares/multer');
// const jsonParser = require('../../middlewares/jsonParser');
const { requestOTP } = require('../../middlewares/otpHandler');
const roleHandler = require('../../middlewares/roleHandler');
const verifyJWT = require('../../middlewares/verifyJWT');
const { validator } = require('../../middlewares/validator');
const { ADMIN_ROLES } = require('../../utils/globals');
const { createUserSchema } = require('../../models/User/userValidationSchema');

router
  .route('/')
  .post(multerInstance.single('profile'), requestOTP, validator(createUserSchema), createUser)
  .get(verifyJWT, roleHandler(ADMIN_ROLES), getUsers)
  .put(verifyJWT, multerInstance.single('profile'), requestOTP, updateUser)
  .delete(verifyJWT, roleHandler(ADMIN_ROLES), deleteUser);

module.exports = router;
