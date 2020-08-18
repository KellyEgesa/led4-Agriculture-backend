const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Connected to the database ${db}`);
    });
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
};
