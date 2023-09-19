import Joi from "joi";

import validation from "./validation";

const registerSchema = Joi.object({
  name: Joi.object()
    .keys({
      firstName: Joi.string().min(2).max(256).required().messages({
        "string.empty": "Please enter your first name.",
        "string.min": "First name must be at least 2 characters long.",
        "string.max": "First name must be less than 256 characters.",
        "any.required": "First name is required."
      }),
      lastName: Joi.string().min(2).max(256).required().messages({
        "string.empty": "Please enter your last name.",
        "string.min": "Last name must be at least 2 characters long.",
        "string.max": "Last name must be less than 256 characters.",
        "any.required": "Last name is required."
      }),
    })
    .required(),

  phoneNumber: Joi.string().min(8).max(15).allow(""),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Please enter your email address.",
      "any.required": "Email address is required."
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})"
      )
    ).required().messages({
      "string.pattern.base":
        "Password must contain at least 6 characters, including an uppercase letter, lowercase letter, number and a special character.",
      "string.empty": "Please enter your password.",
      "any.required": "Please provide a password.",

    }),

  image: Joi.object().keys({
    url: Joi.string().pattern(
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
    ).allow(""),
    alt: Joi.string().min(2).max(256).allow(""),
  }).allow(null),

  address: Joi.object()
    .keys({
      state: Joi.string().min(2).max(256).allow(""),
      country: Joi.string().min(2).max(256).allow(""),
      city: Joi.string().min(2).max(256).allow(""),
      street: Joi.string().min(2).max(256).allow(""),
      houseNumber: Joi.string().min(1).max(40).allow(""),
      zip: Joi.string().min(4).max(30).allow(""),
    })
    .allow(null),

  isAdmin: Joi.boolean().default(false),
});

const validateRegisterSchema = (userInput) =>
  validation(registerSchema, userInput);

export default validateRegisterSchema;
