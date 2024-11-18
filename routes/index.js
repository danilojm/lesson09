const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const configs = require("../configs/globals");

/* Middleware to ensure Firebase configuration is available */
function getFirebaseConfig(req, res, next) {
  res.locals.firebaseConfig = configs.Authentication.Firebase;
  next();
}

/* Main route: renders the home page with user information */
router.get("/", (req, res) => {
  res.render("index", { title: "Express", user: req.user });
});

/* Login route: includes Firebase configuration and renders the login page */
router.get("/login", getFirebaseConfig, (req, res) => {
  let messages = req.session.messages || [];
  req.session.messages = []; // Clear session messages
  res.render("login", {
    title: "Login",
    messages,
    user: req.user,
    firebaseConfig: res.locals.firebaseConfig,
  });
});

/* Handles local authentication using Passport.js */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/projects",
    failureRedirect: "/login",
    failureMessage: "Invalid credentials",
  })
);

/* Registration route: renders the user registration page */
router.get("/register", (req, res) => {
  res.render("register", { title: "Create a new account", user: req.user });
});

/* Handles new user registration and automatic login after registration */
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, (err, newUser) => {
    if (err) {
      console.log(err);
      req.session.messages = ["Error creating account"];
      return res.redirect("/register");
    }
    req.login(newUser, (err) => {
      if (err) {
        console.error("Error logging in new user:", err);
        return res.redirect("/register");
      }
      res.redirect("/projects");
    });
  });
});

/* Logout route: ends the user session and redirects to the login page */
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/login");
  });
});

/* GitHub login route: initiates authentication using GitHub */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

/* Callback route for GitHub login: redirects to projects on success */
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/projects");
  }
);

/* Google login route: initiates authentication using Google */
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/* Callback route for Google login: redirects to projects on success */
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/projects");
  }
);

module.exports = router;
