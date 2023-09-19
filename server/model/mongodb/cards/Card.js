const mongoose = require("mongoose");
const {
  URL,
  DEFAULT_STRING_SCHEMA_REQUIRED,
} = require("./helpers/mongooseValidation");

const cardSchema = new mongoose.Schema({
  user: DEFAULT_STRING_SCHEMA_REQUIRED,
  index: {
    type: Number,
    required: true,
    min: 1,
    max: 10000000,
  },
  uploadTime: DEFAULT_STRING_SCHEMA_REQUIRED,
  description: {
    ...DEFAULT_STRING_SCHEMA_REQUIRED,
    maxLength: 1024,
  },
  image: {
    type: {
      url: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 600,
      },
      alt: {
        type: String,
        default: "loading..",
      },
    },
    required: true,
  },
  uploadedImage: {
    type: String
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Card = mongoose.model("cards", cardSchema);

module.exports = Card;
