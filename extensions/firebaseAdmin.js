// firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("../keys/firebase.json"); // Ensure this path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
