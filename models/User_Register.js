const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../config/keys");

// Creating Registration Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  uid: {
    type: String,
    default: "ehbde4tygpoknwjsodit8emd",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isUserVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Generating json tokens and saving to db
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      username: this.username,
    },
    secretOrKey
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Create User Model in the database
const User = mongoose.model("user", UserSchema);

// Validate user input
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    username: Joi.string().min(2).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(user);
};

// Validate Login input
const validateLogin = (req) => {
  const schema = Joi.object({
    username: Joi.string().min(2).required(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(req);
};

// Validate resetting password input
const validateResetPassword = (req) => {
  const schema = Joi.object({
    new_password: Joi.string().min(8).max(255).required(),
    confirm_password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(req);
};

module.exports = { User, validateUser, validateLogin, validateResetPassword };
