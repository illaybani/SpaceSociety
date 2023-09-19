const mongoose = require("mongoose");
const {
  DEFAULT_STRING_SCHEMA,
} = require("./helpers/mongooseValidation");

const Address = new mongoose.Schema({
  state: DEFAULT_STRING_SCHEMA,
  country: DEFAULT_STRING_SCHEMA,
  city: DEFAULT_STRING_SCHEMA,
  street: DEFAULT_STRING_SCHEMA,
  houseNumber: {
    type: String,
    required: false,
    trim: true,
  },
  zip: {
    type: String,
    required: false,
    trim: true,
  },
});

module.exports = Address;
