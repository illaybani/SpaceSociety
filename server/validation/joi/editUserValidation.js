const Joi = require("joi");

const editUserSchema = Joi.object({
    name: Joi.object()
        .keys({
            firstName: Joi.string().min(2).max(256).required(),
            lastName: Joi.string().min(2).max(256).required(),
        })
        .required(),

    phoneNumber: Joi.string().min(8).max(15).allow(""),

    email: Joi.string()
        .pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
        .required(),

    image: Joi.object().keys({
        url: Joi.string().pattern(
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
        ).allow(""),
        alt: Joi.string().min(2).max(256).allow(""),
    }).allow(""),

    address: Joi.object()
        .keys({
            state: Joi.string().min(2).max(256).allow(""),
            country: Joi.string().min(2).max(256).allow(""),
            city: Joi.string().min(2).max(256).allow(""),
            street: Joi.string().min(2).max(256).allow(""),
            houseNumber: Joi.string().min(1).max(40).allow(""),
            zip: Joi.string().min(4).max(30).allow(""),
        })
        .allow(""),

    gender: Joi.string().valid("female", "male", "other").allow(""),
    isAdmin: Joi.boolean().default(false),
    lastLoginTime: Joi.date(),
});

const validateEditUserSchema = (userInput) =>
    editUserSchema.validateAsync(userInput);

module.exports = {
    validateEditUserSchema,
};
