const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const hbs = require("hbs");

require('dotenv').config();
const admin = require('firebase-admin');

/* Firebase service account configuration */
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Proper formatting for private key
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

/* Initialize Firebase Admin SDK */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://javascriptauth-ed801.firebaseio.com'
});

/* Import application routes */
const indexRouter = require("./routes/index");
const projectsRouter = require("./routes/projects");
const coursesRouter = require("./routes/courses");

/* Import user model */
const User = require("./models/user");

/* Import application configurations */
const configs = require("./configs/globals");

/* Import Passport authentication strategies */
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

/* Initialize Express application */
const app = express();

/* Setup view engine with Handlebars */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

/* Configure middleware for logging, JSON parsing, and session management */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* Session configuration for storing user session data */
app.use(
  session({
    secret: "s2021pr0j3ctTracker", // Secret for session encryption
    resave: false,
    saveUninitialized: false,
  })
);

/* Apply Content Security Policy dynamically from configurations */
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', `script-src ${configs.ContentSecurityPolicy['script-src']};`);
  next();
});

/* Initialize Passport for user authentication */
app.use(passport.initialize());
app.use(passport.session());

/* Connect to MongoDB using Mongoose */
mongoose
  .connect(configs.ConnectionStrings.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((error) => console.error(`Error connecting to MongoDB: ${error}`));

/* Configure Passport local strategy for username/password authentication */
passport.use(User.createStrategy());

/* Configure Passport Google OAuth strategy */
passport.use(
  new GoogleStrategy(
    {
      clientID: configs.Authentication.Google.ClientId,
      clientSecret: configs.Authentication.Google.ClientSecret,
      callbackURL: configs.Authentication.Google.CallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ oauthId: profile.id, oauthProvider: "google" });
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails[0]?.value,
            oauthId: profile.id,
            oauthProvider: "google",
            avatar: profile.photos[0]?.value || null,
            created: Date.now(),
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

/* Configure Passport GitHub OAuth strategy */
passport.use(
  new GitHubStrategy(
    {
      clientID: configs.Authentication.GitHub.ClientId,
      clientSecret: configs.Authentication.GitHub.ClientSecret,
      callbackURL: configs.Authentication.GitHub.CallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ oauthId: profile.id, oauthProvider: "github" });
        if (!user) {
          user = await User.create({
            username: profile.username,
            email: profile.emails?.[0]?.value || null,
            oauthId: profile.id,
            oauthProvider: "github",
            avatar: profile.photos[0]?.value || null,
            created: Date.now(),
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

/* Serialize and deserialize user for session management */
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* Setup application routes */
app.use("/", indexRouter);
app.use("/projects", projectsRouter);
app.use("/courses", coursesRouter);

/* Register Handlebars helpers for dynamic content rendering */
hbs.registerHelper("createOptionElement", (currentValue, selectedValue) => {
  const selectedProperty = currentValue == selectedValue.toString() ? "selected" : "";
  return new hbs.SafeString(`<option ${selectedProperty}>${currentValue}</option>`);
});

hbs.registerHelper("toShortDate", (longDateValue) =>
  new hbs.SafeString(longDateValue.toLocaleDateString("en-CA"))
);

/* Error handling: handle 404 errors */
app.use((req, res, next) => next(createError(404)));

/* Error handling: render error page for other errors */
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

/* Export the Express application */
module.exports = app;
