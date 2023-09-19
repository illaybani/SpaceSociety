const config = require("config");
const joiCardsValidation = require("./joi/cardsValidation");
const Joi = require('joi');

const validatorOption = config.get("validatorOption");

const validateCardSchema = (userInput) => {
    if (validatorOption === "Joi") {
        return joiCardsValidation.validateCardSchema(userInput);
    }
    throw new Error("validator undefined");
};

const validateDeleteCardSchema = (params) => {
    const schema = Joi.object({
        id: Joi.string().alphanum().length(24).required()
    });
    const { error } = schema.validate(params);
    if (error) throw new CustomError("Invalid card ID");
};


module.exports = { validateCardSchema, validateDeleteCardSchema };




