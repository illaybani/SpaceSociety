const mongoose = require("mongoose");
const { URL, DEFAULT_STRING_SCHEMA } = require("./helpers/mongooseValidation");

const Image = new mongoose.Schema({
  url: {
    type: URL,
    required: true
  },
  alt: DEFAULT_STRING_SCHEMA
});

module.exports = Image;
