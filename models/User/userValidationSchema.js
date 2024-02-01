const Joi = require('joi');
const { PASSWORD_REGEX } = require('../../utils/regex');

const userValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(PASSWORD_REGEX)
    .message('Password needs to have minimum eight characters, at least one letter and one number'),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    code: Joi.string().required(),
  }),
});

module.exports = { userValidationSchema };
