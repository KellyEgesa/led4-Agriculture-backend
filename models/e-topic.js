const mongoose = require("mongoose");
const Joi = require("joi");

const etopicSchema = new mongoose.Schema({
  etopic: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
});

const etopic = mongoose.model("eTopic", etopicSchema);

function validateeTopic(etopic) {
  const schema = Joi.object({
    etopic: Joi.string().min(2).max(20).required(),
  });
  return schema.validate(etopic);
}

module.exports.etopic = etopic;
module.exports.validateeTopic = validateeTopic;
