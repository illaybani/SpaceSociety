const Joi = require("joi");

const createCardSchema = Joi.object({
  user: Joi.string().min(2).max(256).required(),
  index: Joi.number().min(1).max(10000000).required(),
  description: Joi.string().min(2).max(1024).required(),
  uploadTime: Joi.string().min(2).max(256).required(),
  image: Joi.object().keys({
    url: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .required(),
    alt: Joi.string()
      .min(2)
      .max(256)
      .allow(""),
  }).required(),
  uploadedImage: Joi.string().allow(""),
  user_id: Joi.string().hex().length(24),
  likes: Joi.array().items(Joi.string().hex().length(24)).optional()
});

const validateCardSchema = (userInput) => {
  return createCardSchema.validateAsync(userInput);
};

module.exports = {
  validateCardSchema,
};
