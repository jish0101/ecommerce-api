const Joi = require('joi');

const idSchema = Joi.object({
  id: Joi.string().hex().required().min(12),
});

module.exports = { idSchema };
