const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt1 = require("bcryptjs");

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    userName: String,
    password: String,
    email: String,
    bio: String,
    userPhoto: String,
    userTweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    userFollowing: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    userFollowers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
