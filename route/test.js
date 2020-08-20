//load npm
// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");
const { test, validateTest } = require("../models/test");
const { Question } = require("../models/questions");
var ObjectID = require("mongodb").ObjectID;
const { modules } = require("../models/module");
const express = require("express");
const router = express.Router();

//mongoose model

router.get("/", async (req, res) => {
  const tests = await test.find().sort();
  res.send(tests);
});

router.get("/:id", async (req, res) => {
  const ob = ObjectID.isValid(req.params.id);
  if (!ob) return res.status(404).send("Page not found");

  const moduless = await modules.findById(req.params.id);
  if (!moduless) return res.status(404).send("Module not found");

  const result = await Question.find({ modules: modules });
  res.send(modules);
});

router.post("/", async (req, res) => {
  const { error } = validateTest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const moduless = await modules.findById(req.body.modules);

  const tests = new test({ title: req.body.title, module: moduless });

  res.send(await tests.save());
});

router.delete("/:id", async (req, res) => {
  const tests = await test.findByIdAndDelete(req.params.id);
  if (!tests) return res.status(404).send("Page not found");

  Question.deleteMany({ test: tests });
  res.send(tests);
});

router.post("/mark/:id", async (req, res) => {
  const ob = ObjectID.isValid(req.params.id);
  if (!ob) return res.status(404).send("Page not found");

  const tests = await test.findById(req.params.id);
  if (!tests) return res.status(404).send("Test not found");

  const result = await Question.find({ test: tests });
});
module.exports = router;
