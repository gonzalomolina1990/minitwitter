require("dotenv").config();
const express = require("express");
const { router } = require("./routes");
const session = require("express-session");
const passport = require("passport");
const app = express();
const port = 3000;
const { mongoose } = require("./db");
const { db_LoadUsers } = require("./seeder");
const User = require("./db/models/userModel");
const { initialize } = require("./passport-config");
const { seeder } = require("./seeder");

initialize(passport);
app.use(express.static("public"));
app.set("view engine", "ejs", "formidable");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "Elmecacodigosecretisimo",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize(passport));
app.use(passport.session());
app.use(router);

/* seeder(); */

app.listen(port, () => console.log(`Servidor escuchando en puerto: ${port}`));
