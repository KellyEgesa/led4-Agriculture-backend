const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(
      `mongodb+srv://KellyEgesa:led4Agriculture1007@cluster0.g8jcv.mongodb.net/<dbname>?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log(`Connected to the database`);
    });
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
};
