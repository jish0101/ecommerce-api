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
const { schemaValidator } = require('../../middlewares/schemaValidator');
const { uploadPhoto, imageValidator } = require('../../middlewares/uploadImage');
const verifyJWT = require('../../middlewares/verifyJWT');
const { idSchema } = require('../../models/CommonSchemas/IdSchema');
const { userValidationSchema } = require('../../models/User/userValidationSchema');
const { ADMIN_ROLES } = require('../../utils/globals');

router
  .route('/')
  .post(
    uploadPhoto.single('profile'),
    imageValidator,
    schemaValidator.body(userValidationSchema),
    requestOTP,
    createUser,
  )
  .get(verifyJWT, roleHandler(ADMIN_ROLES), getUsers)
  .put(
    verifyJWT,
    uploadPhoto.single('profile'),
    imageValidator,
    schemaValidator.body(idSchema),
    schemaValidator.body(userValidationSchema),
    requestOTP,
    updateUser,
  )
  .delete(verifyJWT, roleHandler(ADMIN_ROLES), schemaValidator.query(idSchema), deleteUser);

module.exports = router;
