const mongoose = require("mongoose");
const User = require("./models/userModel");
const Tweet = require("./models/tweetModel");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.DB_PASS);

mongoose.connection.once("open", () => console.log("conectado"));

module.exports = { mongoose };
