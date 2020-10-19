const express = require("express");
const userController = require("./controllers/userController");
const router = express.Router();
const Tweet = require("./db/models/tweetModel");
const User = require("./db/models/userModel");
const mongoose = require("mongoose");

const twitController = require("./controllers/twitController");
const { Model } = require("mongoose");

router.get("/register", userController.registerView);
router.post("/register", userController.register);
router.get("/login", userController.loginView);
router.post("/login", userController.login);
router.get("/logout", userController.logout);

router.get("/", isLoggedIn, twitController.twitList);

router.get("/profile", isLoggedIn, userController.userList);

router.get("/edit", isLoggedIn, userController.editView);
router.post("/editUser", isLoggedIn, userController.update);

router.get("/profile/:username", isLoggedIn, userController.getProfile);

router.post("/users/follow/:username", userController.follow);
router.post("/users/unfollow/:username", userController.unFollow);

router.post("/twitear", isLoggedIn, twitController.twitPost);

router.post("/twitDelete", isLoggedIn, twitController.twitDelete);

router.get("/tweet/like/:_id", isLoggedIn, twitController.like);

module.exports = { router };

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}
