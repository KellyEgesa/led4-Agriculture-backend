const mongoose = require("mongoose");
const Joi = require("joi");

const modules = mongoose.model(
  "modules",
  new mongoose.Schema({
    topic: {
      type: new mongoose.Schema({
        topic: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 20,
        },
      }),
    },
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    description: {
      type: String,
      required: true,
    },
  })
);

function validateModules(Modules) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(20).required(),
    description: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(Modules);
}
module.exports.modules = modules;
module.exports.validateModules = validateModules;
