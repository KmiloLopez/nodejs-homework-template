const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require("dotenv").config();
const DB_HOST = process.env.DB_HOST;

const connection = mongoose.connect(DB_HOST);
  //useNewUrlParser: true,// <-- no longer necessary, considered true by default
  //useUnifiedTopology: true,// <-- no longer necessary


module.exports = connection;
