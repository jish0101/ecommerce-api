const Joi = require('joi');

const productCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(40).required(),
  status: Joi.string().trim().max(10),
});

const productCategoryUpdateSchema = Joi.object({
  id: Joi.string().hex().required().length(24).messages({
    'any.required': 'User ID is required',
    'string.hex': 'User ID is invalid',
    'string.length': 'Invalid user id',
  }),
  name: Joi.string().trim().min(3).max(40).required(),
  status: Joi.string().trim().max(10),
});

module.exports = { productCategorySchema, productCategoryUpdateSchema };
