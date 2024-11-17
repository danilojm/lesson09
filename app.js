const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const hbs = require("hbs");

// Import routes
const indexRouter = require("./routes/index");
const projectsRouter = require("./routes/projects");
const coursesRouter = require("./routes/courses");

// Import user model
const User = require("./models/user");

// Import configuration
const configs = require("./configs/globals");

// Import Passport strategies
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

// Initialize Express app
const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
  session({
    secret: "s2021pr0j3ctTracker",
    resave: false,
    saveUninitialized: false,
  })
);

// Set CSP dynamically using the config
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', `script-src ${configs.ContentSecurityPolicy['script-src']};`);
  next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose
  .connect(configs.ConnectionStrings.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((error) => console.error(`Error connecting to MongoDB: ${error}`));

// Passport: Local Strategy for username/password authentication
passport.use(User.createStrategy());

// Passport: Google Strategy for OAuth authentication
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

// Passport: GitHub Strategy for OAuth authentication
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

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // Use async/await here
    done(null, user);
  } catch (err) {
    done(err, null);  // Handle error by passing it to done
  }
});

// Routing
app.use("/", indexRouter);
app.use("/projects", projectsRouter);
app.use("/courses", coursesRouter);

// Handlebars helpers
hbs.registerHelper("createOptionElement", (currentValue, selectedValue) => {
  const selectedProperty = currentValue == selectedValue.toString() ? "selected" : "";
  return new hbs.SafeString(`<option ${selectedProperty}>${currentValue}</option>`);
});

hbs.registerHelper("toShortDate", (longDateValue) =>
  new hbs.SafeString(longDateValue.toLocaleDateString("en-CA"))
);

// Error handling
app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;