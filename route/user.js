const bcrypt = require("bcrypt");
const crypto = require("crypto");
const config = require("config");
// const auth = require("../middleware/auth");
const { User, validate, validateUser1 } = require("../models/user");
const express = require("express");
const _ = require("lodash");
const { email } = require("../email/email");
const { send } = require("process");
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
  try {
    await User.Update(
      { _id: req.params.id },
      {
        confirmed: true,
      }
    );
    res.send("confirmed");
  } catch (ex) {
    res.send("User not found");
  }
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
    return `<body style="padding: 2%;""><div style="width: 85%;
    height: 85%;
    padding: 5%;
    display: flex;
    border: 1px solid black; 
    align-items: center;">
    <p>Hi ${user.firstname} ${user.lastname}!<br>Thanks for joining LED4Agriculture! Before we get started, we need you to verify your email to make sure we got it right.<br><a href="https://www.facebook.com"><button style="background-color: blue; 
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

router.post("/forgotPassword", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesnt exists");

  const token = crypto.randomBytes(20).toString("hex");
  user.update({
    resetPasswordToken: token,
    resetPasswordExpires: Date.now() + 3600000,
  });

  const reseturl = config.get("front-end") + "/reset/" + token;

  const html = () => {
    return `<body style="padding: 2%;""><div style="width: 85%;
    height: 85%;
    padding: 5%;
    display: flex;
    border: 1px solid black; 
    align-items: center;">
    <p>Hi ${user.firstname} ${user.lastname}!<br>You are receiving this email because you have requested to reset your password for your LED4Agriculture account<br>Please click on the following link within an hour to reset your password<br>If you did not request the password change kindly ignore the link. Your password will remain unchanged.<br> <a href=${reseturl}><button style="background-color: blue; 
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
  const subject = "REF: LINK TO RESET PASSWORD";
  const text = "";
  email(req.body.email, subject, text, html());
  res.send("An link has been sent to your Email address");
});

router.get("/reset", async (req, res) => {
  let user = await User.find({
    resetPasswordToken: req.query.resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user)
    return res.status(400).send("Password link is invalid or has expired");

  res.status(200).send("Valid password link");
});

router.put("/updatePasswordViaEmail", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesnt exists");

  const salt = await bcrypt.genSalt(10);
  newPassword = await bcrypt.hash(req.body.password, salt);

  try {
    await User.Update(
      { email: req.body.email },
      {
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      }
    );
    res.send("Password Updated");
  } catch (ex) {
    res.send("something went wrong");
  }
});
module.exports = router;
