const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./db/models/userModel");

module.exports = {
  initialize(passport) {
    passport.use(
      new LocalStrategy(
        {
          usernameField: "inputUser",
          passwordField: "inputPassword",
          session: true,
        },
        async function (inputUser, inputPassword, done) {
          let user = await User.findOne({ userName: inputUser });
          let userMail = await User.findOne({ email: inputUser });

          if (!user && !userMail) {
            return done(null, false, { message: "Datos incorrectos 1." });
          }

          if (userMail) {
            user = userMail;
          }

          const resultado = await bcrypt.compare(inputPassword, user.password);

          if (!resultado) {
            return done(null, false, { message: "Datos incorrectos 2." });
          }

          return done(null, user);
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id)
        .then((user) => {
          done(null, user);
        })
        .catch((error) => {
          done(error);
        });
    });
  },
};
