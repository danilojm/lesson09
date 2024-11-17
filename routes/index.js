const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const configs = require("../configs/globals");

// Middleware para garantir que o Firebase Config está presente
function getFirebaseConfig(req, res, next) {
  res.locals.firebaseConfig = configs.Authentication.Firebase;
  next();
}

// Rotas principais
router.get("/", (req, res) => {
  res.render("index", { title: "Express", user: req.user });
});

// Rota de Login com Firebase Config incluído
router.get("/login", getFirebaseConfig, (req, res) => {
  let messages = req.session.messages || [];
  req.session.messages = []; // Limpar mensagens da sessão
  res.render("login", {
    title: "Login",
    messages,
    user: req.user,
    firebaseConfig: res.locals.firebaseConfig,
  });
});

// Rota de autenticação local com Passport
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/projects",
    failureRedirect: "/login",
    failureMessage: "Invalid credentials",
  })
);

// Rota de Registro de Usuário
router.get("/register", (req, res) => {
  res.render("register", { title: "Create a new account", user: req.user });
});

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

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/login");
  });
});

// ** Login com GitHub **
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/projects");
  }
);

// ** Login com Google **
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/projects");
  }
);

module.exports = router;
