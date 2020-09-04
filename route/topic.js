//load npm
const editor = require("../middleware/editor");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { topic, validateTopic } = require("../models/topic");
var ObjectID = require("mongodb").ObjectID;
const { modules, validateModules } = require("../models/module");
const express = require("express");
const router = express.Router();

//mongoose model

router.get("/", auth, async (req, res) => {
  const topics = await topic.find().sort();
  res.send(topics);
});

router.get("/:id", auth, async (req, res) => {
  const ob = ObjectID.isValid(req.params.id);
  if (!ob) return res.status(404).send("Page not found");

  const topics = await topic.findById(req.params.id);
  if (!topics) return res.status(404).send("Topic not found");

  const result = await modules
    .find({
      topic: topics,
    })
    .sort({ number: 1 })
    .select("-topic");
  res.send(result);
});

router.post("/", [auth, editor], async (req, res) => {
  const { error } = validateTopic(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const topics = new topic({ topic: req.body.topic });

  res.send(await topics.save());
});

router.put("/:id", [auth, editor], async (req, res) => {
  const { error } = validateTopic(req.body);
  if (error) return res.status(400).send("BAD REQUEST");

  const topics = await topic.findById(req.params.id);
  if (!topics) return res.status(404).send("Topic not found");

  const topic = await topic.findByIdAndUpdate(
    req.params.id,
    { topic: req.body.topic },
    { new: true }
  );
  if (!topic) return res.status(404).send("Page not found");

  await modules.update({ topic: topics }, { topic: topic });
  res.send(topic);
});

router.delete("/:id", [auth, editor], async (req, res) => {
  const topics = await topic.findByIdAndDelete(req.params.id);
  if (!topics) return res.status(404).send("Page not found");

  modules.deleteMany({ topic: topics });
  res.send(topic);
});

module.exports = router;
