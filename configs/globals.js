require("dotenv").config();

// Global configurations object contains Application Level variables such as:
// client secrets, passwords, connection strings, and misc flags
const configurations = {
  ConnectionStrings: {
    MongoDB: process.env.CONNECTION_STRING_MONGODB,
  },
  Authentication: {
    Google: {
      ClientId: process.env.GOOGLE_CLIENT_ID,
      ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      CallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    GitHub: {
      ClientId: process.env.GITHUB_CLIENT_ID,
      ClientSecret: process.env.GITHUB_CLIENT_SECRET,
      CallbackUrl: process.env.GITHUB_CALLBACK_URL,
    },
    Firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    },
  },
  ContentSecurityPolicy: {
    "script-src": process.env.CSP_SCRIPT_SRC,  // Relaxed policy for inline scripts
  },
};

module.exports = configurations;
