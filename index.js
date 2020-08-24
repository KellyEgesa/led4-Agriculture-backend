const express = require("express");
const app = express();

require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/prod")(app);

//port
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;
