const bcrypt = require("bcrypt");
const crypto = require("crypto");
const config = require("config");
const { User, validate, validateUser1 } = require("../models/user");
const express = require("express");
const _ = require("lodash");
var ObjectID = require("mongodb").ObjectID;
var ObjectId = require("mongoose").Types.ObjectId;
const { email } = require("../email/email");
const { send } = require("process");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser1(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesnt exists");

  if (!user.confirmed)
    return res.status(400).send("Kindly confirm your email first");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password");

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(token);
});

router.put("/confirmed/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        confirmed: true,
      }
    );
    let user = await User.findById(req.params.id);
    const token = user.generateAuthToken();
    res
      // .send("success")
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(token);
  } catch (ex) {
    res.status(400).send(ex);
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
    delTime: Date.now() + 86400000,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const saved = await user.save();
  const confirmurl = config.get("front-end") + "confirmed/" + saved._id;

  const html = () => {
    return `<body style="padding: 2%;""><div style="width: 85%;
    height: 85%;
    padding: 5%;
    display: flex;
    border: 1px solid black; 
    align-items: center;">
    <p>Hi ${user.firstname} ${user.lastname}!<br>Thanks for joining LED4Agriculture! Before we get started, we need you to verify your email to make sure we got it right.<br><a href=${confirmurl}><button style="background-color: blue; 
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
  res.send("success");
  email(req.body.email, subject, text, html());
  //   const token = user.generateAuthToken();
  //   res.header("x-auth-token", token).send(_.pick(user, ["_id", "name"]));
});

router.post("/forgotPassword", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesnt exists");

  const token = crypto.randomBytes(20).toString("hex");
  await User.updateOne(
    { email: req.body.email },
    {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    }
  );

  const reseturl = config.get("front-end") + "reset/" + token;

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

router.get("/reset/:id", async (req, res) => {
  let user = await User.findOne({
    resetPasswordExpires: { $gt: Date.now() },
    resetPasswordToken: req.params.id,
  }).select("email");
  if (!user)
    return res.status(400).send("Password link is invalid or has expired");
  console.log(user);
  return res.status(200).send(user);
});

router.put("/updatePasswordViaEmail", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesnt exists");

  const salt = await bcrypt.genSalt(10);
  newPassword = await bcrypt.hash(req.body.password, salt);

  try {
    await User.findOneAndUpdate(
      { email: req.body.email },
      {
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      }
    );
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(token);
  } catch (ex) {
    res.status(403).send("something went wrong");
  }
});

router.post("/module/:id", async (req, res) => {
  let user = await User.findById(req.params.id).select("module");
  if (!user) return res.status(400).send("User doesnt exists");

  const modules = req.body.modules;

  const ob = ObjectID.isValid(modules);
  if (!ob) return res.status(404).send("Page not found");

  const moduleid = modules.toString();

  // console.log(user.module[2].moduleid === moduleid);

  if (user.module.length > 0) {
    const a = user.module.includes(moduleid);
    console.log(a);
    // for (let i = 0; i < user.module.length; i++) {
    //   let b = "not found"
    //   if (user.module[i].moduleid === moduleid) {
    //     b = "found";
    //     return console.log("found");
    //     // return res.send(user.module[i]);
    //   }
    //   else {
    //     return console.log("notfound");
    //     // user.module.push({
    //     //   moduleid: moduleid,
    //     //   pageNumber: 5,
    //     //   marks: "not yet done",
    //     // });
    //     // res.send(await user.save());
    //   }
    // }
  } else {
    user.module = [
      { moduleid: moduleid, pageNumber: 1, marks: "not yet done" },
    ];
    await user.save();
    res.send(user.module);
  }
});

router.put("/module/page/:id", async (req, res) => {
  let user = await User.findById(req.params.id).select("module");
  if (!user) return res.status(400).send("User doesnt exists");
  const moduleid =
    // req.body.id
    329890;
  const page = 10;
  for (let i = 0; i < user.module.length; i++) {
    if (user.module[i].moduleid == moduleid) {
      user.module[i].pageNumber = page;
      const a = user.module[i];
      user.module.splice(i, a);

      res.send(await user.save());
    } else {
      res.send("module not found");
    }
  }

  // res.send(await User.findById(req.params.id));
});

router.put("/module/mark/:id", async (req, res) => {
  let user = await User.findById(req.params.id).select("module");
  if (!user) return res.status(400).send("User doesnt exists");
  const moduleid =
    // req.body.id
    329890;
  const marks = 10;
  for (let i = 0; i < user.module.length; i++) {
    if (user.module[i].moduleid == moduleid) {
      user.module[i].marks = marks;
      const a = user.module[i];
      user.module.splice(i, a);

      res.send(await user.save());
    } else {
      res.send("module not found");
    }
  }

  res.send(await user.save());
});

setInterval(async function () {
  try {
    await User.deleteMany({ confirmed: false, delTime: { $gt: Date.now() } });
  } catch (ex) {
    console.log(ex);
  }
}, 86400000);

module.exports = router;
