const mongose = require("mongose");
const validator = require("validator");

const userSchema = new mongose.Schema({
  name: {
    type: "string",
    required: [true, "Please tell us your name"],
  },
  email: {
    type: "string",
    required: [true, "Please provide your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.idEmail, "Please provide your email address"],
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
    unique: true,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
