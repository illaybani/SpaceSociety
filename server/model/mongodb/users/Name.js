const mongoose = require("mongoose");

const {
  DEFAULT_STRING_SCHEMA_REQUIRED,
} = require("./helpers/mongooseValidation");

const Name = new mongoose.Schema({
  firstName: DEFAULT_STRING_SCHEMA_REQUIRED,
  lastName: DEFAULT_STRING_SCHEMA_REQUIRED,
});

module.exports = Name;
