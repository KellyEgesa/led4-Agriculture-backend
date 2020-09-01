const mongoose = require("mongoose");
const Joi = require("joi");

const emodules = mongoose.model(
  "emodules",
  new mongoose.Schema({
    topic: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    heading: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    added: {
      type: String,
      required: true,
    },
  })
);

function validateeModules(eModules) {
  const schema = Joi.object({
    heading: Joi.string().min(2).max(255).required(),
    topic: Joi.string(),
    url: Joi.string().required(),
    filename: Joi.string().required(),
    added: Joi.boolean(),
  });
  return schema.validate(eModules);
}
module.exports.emodules = emodules;
module.exports.validateeModules = validateeModules;
