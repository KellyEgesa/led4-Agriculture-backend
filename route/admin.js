const bcrypt = require("bcrypt");
// const auth = require("../middleware/auth");
const { User, validate } = require("../models/user");
var ObjectID = require("mongodb").ObjectID;
const express = require("express");
const _ = require("lodash");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await User.find().select("-password").select("-IDnumber");
  res.send(result);
});

router.put("/editor/:id", async (req, res) => {
  const ob = ObjectID.isValid(req.params.id);
  if (!ob) return res.status(404).send("Page not found");

  const result = await User.findByIdAndUpdate(
    req.params.id,
    {
      editor: true,
    },
    { new: true }
  );
  if (!result) return res.status(404).send("Page not found");

  res.send(result);
});

router.put("/admin/:id", async (req, res) => {
  const result = await User.findByIdAndUpdate(
    req.params.id,
    {
      isAdmin: true,
    },
    { new: true }
  );
  if (!result) return res.status(404).send("Page not found");
  res.send(result);
});

router.put("/editorremove/:id", async (req, res) => {
  const ob = ObjectID.isValid(req.params.id);
  if (!ob) return res.status(404).send("Page not found");

  const result = await User.findByIdAndUpdate(
    req.params.id,
    {
      editor: false,
    },
    { new: true }
  );
  if (!result) return res.status(404).send("Page not found");
  res.send(result);
});

router.put("/adminremove/:id", async (req, res) => {
  const ob = ObjectID.isValid(req.params.id);
  if (!ob) return res.status(404).send("Page not found");

  const result = await User.findByIdAndUpdate(
    req.params.id,
    {
      isAdmin: false,
    },
    { new: true }
  );
  if (!result) return res.status(404).send("Page not found");
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  const ob = ObjectID.isValid(req.params.id);
  if (!ob) return res.status(404).send("Page not found");

  const result = await User.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).send("Page not found");

  res.send(result);
});

module.exports = router;
