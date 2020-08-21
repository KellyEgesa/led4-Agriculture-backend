const bcrypt = require("bcrypt");
// const auth = require("../middleware/auth");
const { User, validate, validateUser1 } = require("../models/user");
const express = require("express");
const _ = require("lodash");
const { email } = require("../email/email");
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
    .send(user)
    .select("-password")
    .send("-email");
  // token);
});

router.put("/confimed/:id", async (req, res) => {
  await User.Update(
    { _id: req.params.id },
    {
      confirmed: true,
    }
  );
  res.send("yaye");
});

router.post("/add", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const checkemail = await User.findOne({
    email: req.body.email,
  });
  if (checkemail) return res.status(400).send("Email already exists");

  user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const html = () => {
    return `<body style="padding: 2%;""><div style="width: 50%;
    height: 50%;
    padding: 5%;
    display: flex;
    border: 1px solid black; 
    align-items: center;">
    <p>Hi xxxxxx !<br>Thanks for joining LED4Agriculture! Before we get started, we need you to verify your email to make sure we got it right.<br><a href="https://www.facebook.com"><button style="background-color: blue; 
    border: none;
    color: white;
    padding: 20px; 
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10%;
    cursor: pointer;
    border-radius: 15px;">CONFIRM MY EMAIL </button></a>
  </p>
  </div></body>`;
  };
  const subject = "REF: Confirmation Message After Registration";
  const text = "";
  res.send(await user.save());
  email(req.body.email, subject, text, html());
  //   const token = user.generateAuthToken();
  //   res.header("x-auth-token", token).send(_.pick(user, ["_id", "name"]));
});

module.exports = router;
