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
    heading: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    added: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    // fileid: {
    //   type: String,
    //   required: true,
    // },
  })
);

function validateModules(Modules) {
  const schema = Joi.object({
    heading: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(3).max(255).required(),
    topic: Joi.string(),
    url: Joi.string(),
    added: Joi.boolean(),
    filename: Joi.string().required(),
    // fileid: Joi.string().required(),
  });
  return schema.validate(Modules);
}
module.exports.modules = modules;
module.exports.validateModules = validateModules;
