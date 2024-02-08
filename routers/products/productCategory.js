const router = require('express').Router();
const {
  createProductCategory,
  getProductsCategory,
  updateProductCategory,
  deleteProductCategory,
} = require('../../controllers/products/productCategoryController');

router
  .route('/')
  .post(createProductCategory)
  .get(getProductsCategory)
  .put(updateProductCategory)
  .delete(deleteProductCategory);

module.exports = router;
