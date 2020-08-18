const mongoose = require("mongoose");
const Joi = require("joi");

const test = mongoose.model(
  "test",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    module: {
      type: new mongoose.Schema({
        topic: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 20,
        },
        title: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 20,
        },
      }),
    },
  })
);

function validateTest(test) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(20).required(),
  });
  return schema.validate(test);
}
module.exports.test = test;
module.exports.validateTest = validateTest;
