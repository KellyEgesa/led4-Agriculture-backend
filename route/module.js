//load npm
const editor = require("../middleware/editor");
const auth = require("../middleware/auth");
const Joi = require("joi");
const { Question } = require("../models/questions");
var ObjectID = require("mongodb").ObjectID;
const { modules, validateModules } = require("../models/module");
const { topic } = require("../models/topic");
const express = require("express");
const router = express.Router();

//mongoose model

// router.get(
//   "/",
//   // auth,
//   async (req, res) => {
//     const moduless = await modules.find().sort();
//     res.send(moduless);
//   }
// );

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
  if (!topics) return res.status(404).send("topic doesnt exist");

  const checkNumber = await modules.findOne({
    topic: topics,
    number: req.body.number,
  });
  if (checkNumber) return res.status(400).send("Number already exists");

  moduless = new modules({
    number: req.body.number,
    topic: topics,
    heading: req.body.heading,
    description: req.body.description,
    url: req.body.url,
    filename: req.body.filename,
    added: req.body.added,
  });

  res.send(await moduless.save());
});

router.put("/:id", [auth, editor], async (req, res) => {
  const { error } = validateModules(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newModule = modules.findByIdAndUpdate(req.params.id, {
    number: req.body.number,
    topic: topics,
    heading: req.body.heading,
    description: req.body.description,
    url: req.body.url,
    filename: req.body.filename,
    added: req.body.added,
  });

  res.send(newModule);
});

router.put("/heading", [auth, editor], async (req, res) => {
  function validate(Modules) {
    const schema = Joi.object({
      heading: Joi.string().min(2).max(40).required(),
    });
    return schema.validate(Modules);
  }
  const { error } = validate(req.body.heading);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await modules.update(
      { number: req.body.number },
      { heading: req.body.heading }
    );
    res.status(200);
  } catch (ex) {
    res.status(500);
  }
});
router.put("/description", [auth, editor], async (req, res) => {
  function validate(Modules) {
    const schema = Joi.object({
      description: Joi.string().min(3).max(255).required(),
    });
    return schema.validate(Modules);
  }

  const { error } = validate(req.body.description);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await modules.update(
      { number: req.body.number },
      { description: req.body.description }
    );
    res.status(200);
  } catch (ex) {
    res.status(500);
  }
});
router.put("/pdf", [auth, editor], async (req, res) => {
  try {
    await modules.update(
      { number: req.body.number },
      { url: req.body.url, filename: req.body.filename }
    );
    res.status(200);
  } catch (ex) {
    res.status(500);
  }
});
router.delete("/:id", [auth, editor], async (req, res) => {
  const moduless = await modules.findByIdAndDelete(req.params.id);
  if (!moduless) return res.status(404).send("Page not found");

  try {
    Question.deleteMany({ modules: req.params.id });
    res.send(moduless);
  } catch (error) {
    res.send("error");
  }
});

module.exports = router;
