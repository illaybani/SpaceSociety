const mongoose = require("mongoose");
const Name = require("./Name");
const Address = require("./Address");
const Image = require("./Image");

const schema = new mongoose.Schema({
  name: Name,
  phoneNumber: {
    type: String,
    required: false,
    match: RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/),
  },
  email: {
    type: String,
    require: true,
    match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    match: RegExp(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    ),
  },
  image: Image,
  address: Address,
  gender: {
    type: String,
    default: "",
    required: false
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isAdmin: { type: Boolean, default: false, required: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginTime: {
    type: Date,
  },
});

const User = mongoose.model("users", schema);

module.exports = User;
