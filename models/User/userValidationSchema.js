const Joi = require('joi');
const { PASSWORD_REGEX } = require('../../utils/regex');

const userValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(PASSWORD_REGEX)
    .message('Password needs to have minimum eight characters, at least one letter and one number'),
  image: Joi.string().required(),
});

const userIdSchema = Joi.object({
  id: Joi.string().hex().required().length(24).messages({
    'any.required': 'User ID is required',
    'string.hex': 'User ID is invalid',
    'string.length': 'Invalid user id',
  }),
});

module.exports = { userValidationSchema, userIdSchema };
