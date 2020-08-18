const morgan = require("morgan");
const express = require("express");
var cors = require("cors");

const Admin = require("../route/admin");
// const Module = require("../route/module");
const Questions = require("../route/questions");
const Test = require("../route/test");
const Topic = require("../route/topic");
const User = require("../route/user");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use("/api/test", Test);
  app.use("/api/admin", Admin);
  //   app.use("/api/module", Module);
  app.use("/api/questions", Questions);
  app.use("/api/topic", Topic);
  app.use("/api/user", User);
};
