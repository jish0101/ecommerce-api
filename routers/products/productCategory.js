const router = require('express').Router();
const {
  createProductCategory,
  getProductsCategory,
  updateProductCategory,
  deleteProductCategory,
} = require('../../controllers/products/productCategoryController');
const roleHandler = require('../../middlewares/roleHandler');
const { schemaValidator } = require('../../middlewares/schemaValidator');
const { idSchema } = require('../../models/CommonSchemas/IdSchema');
const {
  productCategorySchema,
  productCategoryUpdateSchema,
} = require('../../models/ProductCategory/ProductCategorySchema');
const { ADMIN_ROLES } = require('../../utils/globals');

router
  .route('/')
  .post(
    roleHandler(ADMIN_ROLES),
    schemaValidator.body(productCategorySchema),
    createProductCategory,
  )
  .get(getProductsCategory)
  .put(
    roleHandler(ADMIN_ROLES),
    schemaValidator.body(productCategoryUpdateSchema),
    updateProductCategory,
  )
  .delete(roleHandler(ADMIN_ROLES), schemaValidator.body(idSchema), deleteProductCategory);

module.exports = router;
