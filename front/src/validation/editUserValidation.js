import Joi from "joi";

import validation from "./validation";

const editUserSchema = Joi.object({
    name: Joi.object()
        .keys({
            firstName: Joi.string().min(2).max(256).required().messages({
                "string.empty": '"First Name" cannot be empty',
                'string.min': '"First Name" should have a minimum length of 2',
                'string.max': '"First Name" should have a maximum length of 256',
                'any.required': '"First Name" is required'
            }),
            lastName: Joi.string().min(2).max(256).required().messages({
                "string.empty": '"Last Name" cannot be empty',
                'string.min': '"Last Name" should have a minimum length of 2',
                'string.max': '"Last Name" should have a maximum length of 256',
                'any.required': '"Last Name" is required'
            }),
        })
        .required(),

    phoneNumber: Joi.string().min(8).max(15).allow("").messages({
        'string.min': '"Phone" should have a minimum length of 8',
        'string.max': '"Phone" should have a maximum length of 15'
    }),

    email: Joi.string()
        .pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
        .required().messages({
            'string.pattern.base': '"email" must be a valid email address',
            'any.required': '"email" is required'
        }),

    image: Joi.object().keys({
        url: Joi.string().pattern(
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
        ).allow("").messages({
            'string.pattern.base': '"url" must be a valid URL'
        }),
        alt: Joi.string().min(2).max(256).allow("").messages({
            'string.min': '"alt" should have a minimum length of 2',
            'string.max': '"alt" should have a maximum length of 256'
        }),
    }).allow(""),

    address: Joi.object()
        .keys({
            state: Joi.string().min(2).max(256).allow("").messages({
                'string.min': '"State" should have a minimum length of 2',
                'string.max': '"State" should have a maximum length of 256'
            }),
            country: Joi.string().min(2).max(256).allow("").messages({
                'string.min': '"Country" should have a minimum length of 2',
                'string.max': '"Country" should have a maximum length of 256'
            }),
            city: Joi.string().min(2).max(256).allow("").messages({
                'string.min': '"City" should have a minimum length of 2',
                'string.max': '"City" should have a maximum length of 256'
            }),
            street: Joi.string().min(2).max(256).allow("").messages({
                'string.min': '"Street Address" should have a minimum length of 2',
                'string.max': '"Street Address" should have a maximum length of 256'
            }),
            houseNumber: Joi.string().min(1).max(40).allow("").messages({
                'string.min': '"House Number" should have a minimum length of 1',
                'string.max': '"House Number" should have a maximum length of 40'
            }),
            zip: Joi.string().min(4).max(30).allow("").messages({
                'string.min': '"Zip Code" should have a minimum length of 4',
                'string.max': '"Zip Code" should have a maximum length of 30'
            }),
        })
        .allow(""),

    gender: Joi.string().valid("female", "male", "other").allow("").messages({
        'any.only': '"gender" must be one of [female, male, other]'
    }),
    isAdmin: Joi.boolean().default(false).messages({
        'boolean.base': '"isAdmin" must be a boolean'
    }),
});

const editUserParamsSchema = Joi.object({
    id: Joi.string().min(1).required().messages({
        'string.min': '"id" should have a minimum length of 1',
        'any.required': '"id" is required'
    }),
});

const validateEditUserSchema = (userInput) => validation(editUserSchema, userInput);

const validateEditUserParamsSchema = (userInput) =>
    validation(editUserParamsSchema, userInput);

export { validateEditUserParamsSchema };

export default validateEditUserSchema;
