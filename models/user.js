const mongoose = require("mongoose");
const plm = require("passport-local-mongoose"); /* Plugin for Passport-Local-Mongoose for handling user authentication */

/* Define the structure of the user schema */
const userSchema = new mongoose.Schema({
  username: { type: String }, /* Username or profile name (used for local and OAuth authentication) */
  email: { type: String, unique: true, sparse: true }, /* User's email (optional for local auth without OAuth) */
  password: { type: String }, /* Local password (hashed automatically by Passport-Local-Mongoose) */
  oauthId: { type: String }, /* Unique ID returned by the OAuth provider (e.g., Google, GitHub) */
  oauthProvider: { type: String }, /* Name of the OAuth provider (e.g., "google", "github") */
  avatar: { type: String }, /* Profile picture (useful for OAuth like Google/GitHub) */
  created: { type: Date, default: Date.now }, /* Date when the user was created */
});

/* Add the Passport-Local-Mongoose plugin to the schema */
/* This plugin provides built-in methods like register(), authenticate(), and automatic password hashing/salting */
userSchema.plugin(plm);

/* Export the enhanced user model */
module.exports = mongoose.model("User", userSchema);
