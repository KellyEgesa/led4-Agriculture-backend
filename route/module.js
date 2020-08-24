//load npm
const editor = require("../middleware/editor");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { test, validateTest } = require("../models/test");
const { Question } = require("../models/questions");
var ObjectID = require("mongodb").ObjectID;
const { modules, validateModules } = require("../models/module");
const { topic } = require("../models/topic");
const express = require("express");
const router = express.Router();

//mongoose model

router.get("/", auth, async (req, res) => {
  const moduless = await modules.find().sort();
  res.send(moduless);
});

router.get("/:id", auth, async (req, res) => {
  const ob = ObjectID.isValid(req.params.id);
  if (!ob) return res.status(404).send("Page not found");

  const moduless = await modules.findById(req.params.id);
  if (!moduless) return res.status(404).send("Module not found");

  res.send(moduless);
});

router.post("/", [auth, editor], async (req, res) => {
  const { error } = validateModules(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const topics = await topic.findById(req.body.topic);

  moduless = new modules({
    topic: topics,
    heading: req.body.heading,
    description: req.body.description,
    url: req.body.url,
    filename: req.body.filename,
    added: req.body.added,
  });

  res.send(await moduless.save());
});

router.delete("/:id", [auth, editor], async (req, res) => {
  const moduless = await modules.findByIdAndDelete(req.params.id);
  if (!moduless) return res.status(404).send("Page not found");

  try {
    Question.deleteMany({ modules: moduless });
    res.send(moduless);
  } catch (error) {
    res.send("error");
  }
});

module.exports = router;
