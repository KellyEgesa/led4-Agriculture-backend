const bcrypt = require("bcrypt");
// const auth = require("../middleware/auth");
const { User, validate, validateUser1 } = require("../models/user");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser1(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesnt exists");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password");

  // const token = user.generateAuthToken();
  res
    // .header("x-auth-token", token)
    // .header("access-control-expose-headers", "x-auth-token")
    .send(user);
  // token);
});

router.post("/add", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const checkemail = await User.findOne({
    email: req.body.email,
  });
  if (checkemail) return res.status(400).send("Email already exists");

  const phonenumber = await User.findOne({
    phonenumber: req.body.phonenumber,
  });
  if (phonenumber) return res.status(400).send("PhoneNumber already exists");

  const idnumber = await User.findOne({
    IDnumber: req.body.IDnumber,
  });
  if (idnumber) return res.status(400).send("I.D number already exists");

  user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    password: req.body.password,
    IDnumber: req.body.IDnumber,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  res.send(await user.save());
  //   const token = user.generateAuthToken();
  //   res.header("x-auth-token", token).send(_.pick(user, ["_id", "name"]));
});

module.exports = router;
