const Joi = require('joi');

const idSchema = Joi.object({
  id: Joi.string().hex().required().length(24).messages({
    'any.required': 'User ID is required',
    'string.hex': 'User ID is invalid',
    'string.length': 'Invalid user id',
  }),
});

module.exports = { idSchema };
