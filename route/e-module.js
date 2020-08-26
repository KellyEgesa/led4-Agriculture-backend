//load npm
const editor = require("../middleware/editor");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Question } = require("../models/questions");
var ObjectID = require("mongodb").ObjectID;
const { emodules, validateeModules } = require("../models/e-module");
const express = require("express");
const router = express.Router();

//mongoose model

router.get("/", async (req, res) => {
  const emoduless = await emodules.find().sort();
  res.send(emoduless);
});

router.get("/:id", async (req, res) => {
  const ob = ObjectID.isValid(req.params.id);
  if (!ob) return res.status(404).send("Page not found");

  const emoduless = await emodules.findById(req.params.id);
  if (!emoduless) return res.status(404).send("Module not found");

  res.send(emoduless);
});

router.post("/", [auth, editor], async (req, res) => {
  const { error } = validateeModules(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  emoduless = new emodules({
    etopic: req.body.topic,
    heading: req.body.heading,
    description: req.body.description,
    url: req.body.url,
    filename: req.body.filename,
    added: req.body.added,
  });

  res.send(await emoduless.save());
});

router.delete("/:id", [auth, editor], async (req, res) => {
  const tests = await emodules.findByIdAndDelete(req.params.id);
  if (!tests) return res.status(404).send("Page not found");

  res.send(tests);
});

module.exports = router;
