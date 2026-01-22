const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/schoolDB");

mongoose.connection
  .once("open", () => console.log("MongoDB connected"))
  .on("error", err => console.error(err));

module.exports = mongoose;
