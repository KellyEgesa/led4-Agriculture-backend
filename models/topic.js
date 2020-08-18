const mongoose = require("mongoose");
const Joi = require("joi");

const topicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
});

const topic = mongoose.model("Topic", topicSchema);

function validateTopic(topic) {
  const schema = Joi.object({
    topic: Joi.string().min(2).max(20).required(),
  });
  return schema.validate(topic);
}

module.exports.topic = topic;
module.exports.validateTopic = validateTopic;
