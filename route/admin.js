const bcrypt = require("bcrypt");
const editor = require("../middleware/editor");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { User, validate } = require("../models/user");
var ObjectID = require("mongodb").ObjectID;
const express = require("express");
const _ = require("lodash");

const router = express.Router();

router.get("/", [auth, admin], async (req, res) => {
  const result = await User.find({ confirmed: true }).select("-password");
  res.send(result);
});

router.put("/editor/:id", [auth, admin], async (req, res) => {
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

router.put("/admin/:id", [auth, admin], async (req, res) => {
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

router.put("/editorremove/:id", [auth, admin], async (req, res) => {
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

router.delete("/:id", [auth, admin], async (req, res) => {
  const ob = ObjectID.isValid(req.params.id);
  if (!ob) return res.status(404).send("Page not found");

  const result = await User.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).send("Page not found");

  res.send(result);
});

module.exports = router;
