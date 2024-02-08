const router = require('express').Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../../controllers/products/productController');
const jsonParser = require('../../middlewares/jsonParser');
const { uploadPhoto } = require('../../middlewares/uploadImage');

router
  .route('/')
  .post(createProduct)
  .get(getProducts)
  .put(uploadPhoto.single('image'), jsonParser(['category']), updateProduct)
  .delete(deleteProduct);

module.exports = router;
