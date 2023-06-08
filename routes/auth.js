const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const router = express.Router();
const bcrypt = require("bcryptjs")
const User = require('../models/user')

passport.use(
  new LocalStrategy(async(username, password, done) => {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      };
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password"})
        }
      })
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

router.get('/log-in', (req, res, next) => {
  res.render("log-in-form", {
    title: "Log In"
  })
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/log-in"
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;