const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "Please tell us your name"],
  },
  email: {
    type: "string",
    required: [true, "Please provide your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide your email address"],
  },
  photo: String,
  password: {
    type: "string",
    required: [true, "The user should have a name"],
    minlength: 8,
  },
  passwordConfirm: {
    type: "string",
    required: [true, "The user should have a name"],
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
