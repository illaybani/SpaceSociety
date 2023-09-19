import Joi from "joi";
import validation from "./validation";

const addJobSchema = Joi.object({
    user: Joi.string().min(2).max(256).required(),
    index: Joi.number().min(1).max(10000000).required(),
    description: Joi.string().min(2).max(300).required().messages({
        "string.empty": "Post cannot be empty",
        "string.min": "Post length must be at least 2 characters long",
    }),
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


const validateAddSchema = (userInput) => validation(addJobSchema, userInput);

export default validateAddSchema;
