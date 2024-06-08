const router = require('express').Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../../controllers/products/productController');
const roleHandler = require('../../middlewares/roleHandler');
const { schemaValidator } = require('../../middlewares/schemaValidator');
const { uploadPhoto, imageValidator } = require('../../middlewares/uploadImage');
const { userIdSchema } = require('../../models/User/userValidationSchema');
const { USER_ROLES } = require('../../utils/globals');

const adminRoles = Object.values(USER_ROLES).filter((v) => v > USER_ROLES.moderator);

router
  .route('/')
  .post(roleHandler(adminRoles), uploadPhoto.single('image'), imageValidator, createProduct)
  .get(getProducts)
  .put(
    roleHandler(adminRoles),
    uploadPhoto.single('image'),
    imageValidator,
    schemaValidator.body(userIdSchema),
    updateProduct,
  )
  .delete(roleHandler(adminRoles), deleteProduct);

module.exports = router;
