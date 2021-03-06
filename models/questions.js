const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const question = mongoose.model(
  "question",
  new mongoose.Schema({
    modules: {
      type: String,
      required: true,
    },
    question: { type: String, required: true },
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true },
    answer: { type: String, required: true, maxlength: 1, minlength: 1 },
    choice: { type: String, maxlength: 1, minlength: 1 },
    description: { type: String, required: true },
  })
);

function validateQuestion(question) {
  const schema = Joi.object({
    question: Joi.string().min(2).required(),
    A: Joi.string().required(),
    B: Joi.string().required(),
    C: Joi.string().required(),
    D: Joi.string().required(),
    answer: Joi.string().min(1).max(1).required(),
    description: Joi.string().required(),
    modules: Joi.string().required(),
  });
  return schema.validate(question);
}
module.exports.Question = question;
module.exports.validateQuestion = validateQuestion;
