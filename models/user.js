const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const config = require("config");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  firstname: {
    required: true,
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  lastname: {
    required: true,
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
    minlength: 8,
    maxlength: 1024,
  },
  confirmed: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  editor: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(25).required(),
    lastname: Joi.string().min(2).max(25).required(),
    email: Joi.string().min(5).max(60).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

function validateUser1(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(60).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}
module.exports.User = User;
module.exports.validate = validateUser;
module.exports.validateUser1 = validateUser1;
