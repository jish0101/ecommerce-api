const router = require('express').Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../../controllers/products/productController');
const jsonParser = require('../../middlewares/jsonParser');
const { multerInstance } = require('../../middlewares/multer');
const roleHandler = require('../../middlewares/roleHandler');
// const { uploadPhoto, imageValidator } = require('../../middlewares/uploadImage');
const { USER_ROLES } = require('../../utils/globals');

const adminRoles = Object.values(USER_ROLES).filter((v) => v > USER_ROLES.moderator);

router
  .route('/')
  .post(
    roleHandler(adminRoles),
    multerInstance.single('image'),
    jsonParser(['category']),
    createProduct,
  )
  .get(getProducts)
  .put(
    roleHandler(adminRoles),
    multerInstance.single('image'),
    jsonParser(['category']),
    updateProduct,
  )
  .delete(roleHandler(adminRoles), deleteProduct);

module.exports = router;
