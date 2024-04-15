const router = require('express').Router();
const {
  createProductCategory,
  getProductsCategory,
  updateProductCategory,
  deleteProductCategory,
} = require('../../controllers/products/productCategoryController');
const roleHandler = require('../../middlewares/roleHandler');
const { ADMIN_ROLES } = require('../../utils/globals');

router
  .route('/')
  .post(roleHandler(ADMIN_ROLES), createProductCategory)
  .get(getProductsCategory)
  .put(roleHandler(ADMIN_ROLES), updateProductCategory)
  .delete(roleHandler(ADMIN_ROLES), deleteProductCategory);

module.exports = router;
