const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../db/models/userModel");
const Tweet = require("../db/models/tweetModel");
const formidable = require("formidable");
const fs = require("fs");

module.exports = {
  registerView: (req, res) => {
    res.render("register");
  },

  loginView: (req, res) => {
    const loggedUser = false;

    res.render("login", { loggedUser });
  },

  login: passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    // failureFlash: true,
  }),

  logout: (req, res) => {
    req.logOut();
    res.redirect("/login");
  },

  editView: (req, res) => {
    const loggedUser = req.user;
    const path = req.path;

    res.render("edit", { loggedUser, path });
  },

  register: async (req, res) => {
    const form = formidable({
      multiples: true,
      uploadDir: `${__dirname}/../public/img`,
      keepExtensions: true,
    });
    form.parse(req, async (err, fields, files) => {
      const hashedPassword = await bcrypt.hash(fields.password, 10);
      const users = await User.find({ userName: fields.username });

      let imageParsing = await { userPhoto: `/img/${files.userphoto.name}` };

      await fs.rename(
        files.userphoto.path,
        __dirname + "/../public" + imageParsing.userPhoto,
        function (err) {
          if (err) {
            return console.log(err);
          }
        }
      );

      if (users.length === 0) {
        const user = new User({
          firstName: fields.firstname,
          lastName: fields.lastname,
          userName: fields.username,
          password: hashedPassword,
          email: fields.email,
          userPhoto: imageParsing.userPhoto,
          bio: fields.bio,
        });
        user.save();
        res.redirect("/login");
      }
    });
  },

  userList: async (req, res) => {
    const tweets = await Tweet.find().populate("user");
    const users = await User.find()
      .populate("userTweets")
      .populate("userFollowing")
      .populate("userFollowers");

    const loggedUser = await User.findOne(req.user).populate("userTweets");

    const path = req.path;

    res.render("home", { tweets, users, loggedUser, path });
  },

  follow: async (req, res) => {
    const toFollow = await User.findOne({ userName: req.params.username });

    if (req.user.userName === toFollow.username) {
      res.redirect("back");
    } else {
      await User.findById(req.user._id, (err, user) => {
        const foundObjId = user.userFollowing.find(
          (objId) => objId.toString() === toFollow._id.toString()
        );

        if (foundObjId === undefined) {
          user.userFollowing.push(toFollow._id);
          user.save();
          toFollow.userFollowers.push(user);
          toFollow.save();
          res.redirect("back");
        } else {
          res.redirect("back");
        }
      });
    }
  },

  unFollow: async (req, res) => {
    if (req.user.userName === req.params.username) {
      res.redirect("back");
    } else {
      const toUnFollow = await User.findOne({ userName: req.params.username });
      req.user.userFollowing = req.user.userFollowing.filter((ufollower) => {
        return ufollower._id.toString() !== toUnFollow._id.toString();
      });

      await req.user.save();

      toUnFollow.userFollowers = toUnFollow.userFollowers.filter(
        (ufollowing) => {
          return ufollowing._id.toString() !== req.user._id.toString();
        }
      );

      toUnFollow.save();

      res.redirect("back");
    }

    /* const toUnFollow = await User.findOne({ userName: req.params.username });
    console.log(toUnFollow._id.toString());
    console.log(req.user._id.toString());
    console.log(req.user.id);
    console.log(req.user.userFollowing);
    User.update(
      { userName: req.user.userName },
      { $pull: { userFollowing: { $in: [toUnFollow.id] } } },
      { multi: true }
    );
    User.update(
      { userName: toUnFollow.userName },
      { $pull: { userFollowers: { $in: [req.user.id] } } },
      { multi: true }
    );
    res.redirect("back"); */
  },

  getProfile: async (req, res) => {
    const profileVisited = await User.findOne({
      userName: req.params.username,
    }).populate("userTweets");

    const loggedUser = req.user;
    const path = req.path;
    const tweets = await Tweet.find().populate("user");

    res.render("profile", { profileVisited, loggedUser, path, tweets });
  },

  update: async (req, res) => {
    const form = formidable({
      multiples: true,
      uploadDir: `${__dirname}/../public/img`,
      keepExtensions: true,
    });
    form.parse(req, async (err, fields, files) => {
      let imageParsing = await {
        userPhoto: `/img/${files.userphotoEdit.name}`,
      };

      await fs.rename(
        files.userphotoEdit.path,
        __dirname + "/../public" + imageParsing.userPhoto,
        function (err) {
          if (err) {
            return console.log(err);
          }
        }
      );

      if (imageParsing.userPhoto === undefined) {
        imageParsing.userPhoto = req.user.userPhoto;
      }

      await User.findOneAndUpdate(
        { userName: req.user.userName },
        {
          firstName: fields.firstnameEdit,
          lastName: fields.lastnameEdit,
          userName: fields.usernameEdit,
          email: fields.emailEdit,
          userPhoto: imageParsing.userPhoto,
          bio: fields.bio,
        }
      ),
        res.redirect("back");
    });
  },
};
