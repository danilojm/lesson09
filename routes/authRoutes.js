// authRoutes.js
const express = require("express");
const admin = require("../extensions/firebaseAdmin");

const router = express.Router();

router.post("/auth/google", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    res.json({ uid });
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
