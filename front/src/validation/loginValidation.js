import Joi from "joi";

import validation from "./validation";

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
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
})

const validateLoginSchema = (userInput) => validation(loginSchema, userInput);

export default validateLoginSchema;
