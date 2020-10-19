const passport = require("passport");
const Tweet = require("../db/models/tweetModel");
const User = require("../db/models/userModel");

module.exports = {
  twitPost: async (req, res) => {
    const loggedUser = req.user;

    const newTweet = new Tweet({
      text: req.body.twitContent,
      user: req.user,
    });

    loggedUser.userTweets.push(newTweet);
    loggedUser.save();
    newTweet.save();
    res.redirect("back");
  },

  twitDelete: async (req, res) => {
    //
  },

  twitList: async (req, res) => {
    const tweets = await Tweet.find().populate("user");
    const users = await User.find();
    const loggedUser = req.user;
    const path = req.path;

    res.render("home", { tweets, users, loggedUser, path });
  },

  like: async (req, res) => {
    console.log("ejecutamos like");
    const toLike = await Tweet.findOne({ _id: req.params._id });
    console.log(toLike);
    if (toLike.likes.length === 0) {
      console.log("en el if");
      toLike.likes.push(req.user._id);
      toLike.save();
      res.redirect("back");
    } else {
      for (let i = 0; i < toLike.likes.length; i++) {
        console.log("for de like");
        const element = toLike.likes[i]._id;
        console.log(element);
        if (element.toString() === req.user._id.toString()) {
          console.log("te gusta y ahora lo sacaste");
          toLike.likes.splice(i, 1);
          toLike.save();
          res.redirect("back");
        } else {
          console.log("no te gustaba y te gusta");
          toLike.likes.push(req.user._id);
          toLike.save();
          res.redirect("back");
        }
      }
    }
  },
};
