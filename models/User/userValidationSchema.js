const Joi = require('joi');
const { PASSWORD_REGEX } = require('../../../client/src/Lib/Constants.cjs');

const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(PASSWORD_REGEX),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    code: Joi.string().required(),
  }),
});

module.exports = { userValidationSchema };
