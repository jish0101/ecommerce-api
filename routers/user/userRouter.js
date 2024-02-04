const router = require('express').Router();
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../../controllers/user/userController');
const jsonParser = require('../../middlewares/jsonParser');
const { requestOTP } = require('../../middlewares/otpHandler');
const roleHandler = require('../../middlewares/roleHandler');
const { schemaValidator } = require('../../middlewares/schemaValidator');
const { uploadPhoto, imageValidator } = require('../../middlewares/uploadImage');
const verifyJWT = require('../../middlewares/verifyJWT');
const { userValidationSchema, userIdSchema } = require('../../models/User/userValidationSchema');
const { USER_ROLES } = require('../../utils/globals');

const adminRoles = Object.values(USER_ROLES).filter((v) => v > USER_ROLES.moderator);

router
  .route('/')
  .post(
    uploadPhoto.single('profile'),
    jsonParser(['address']),
    imageValidator,
    schemaValidator.body(userValidationSchema),
    requestOTP,
    createUser,
  )
  .get(verifyJWT, roleHandler(adminRoles), getUsers)
  .put(
    verifyJWT,
    uploadPhoto.single('profile'),
    jsonParser(['address']),
    imageValidator,
    schemaValidator.query(userIdSchema),
    schemaValidator.body(userValidationSchema),
    requestOTP,
    updateUser,
  )
  .delete(verifyJWT, schemaValidator.query(userIdSchema), deleteUser);

module.exports = router;
