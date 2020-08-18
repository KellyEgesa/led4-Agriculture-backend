//load npm
// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");
const { test } = require("../models/test");
const { Question, validateQuestion } = require("../models/questions");
const express = require("express");
const router = express.Router();

//mongoose model

router.get("/", async (req, res) => {
  const question = await Question.find().sort();
  res.send(question);
});

router.post("/", async (req, res) => {
  const { error } = validateQuestion(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const tests = await test.findById(req.body.test);

  const question = new Question({
    test: tests,
    question: req.body.question,
    A: req.body.A,
    B: req.body.B,
    C: req.body.C,
    D: req.body.D,
    answer: req.body.answer,
    description: req.body.description,
  });

  res.send(await question.save());
});

router.delete("/:id", async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) return res.status(404).send("Page not found");

  res.send(question);
});

module.exports = router;
