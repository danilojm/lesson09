require("dotenv").config();

/* 
   Global configurations object that contains application-level variables, 
   such as client secrets, passwords, connection strings, and miscellaneous flags.
*/
const configurations = {
  ConnectionStrings: {
    /* MongoDB connection string for database connectivity */
    MongoDB: process.env.CONNECTION_STRING_MONGODB,
  },
  Authentication: {
    Google: {
      /* Google OAuth client ID for authentication */
      ClientId: process.env.GOOGLE_CLIENT_ID,
      /* Google OAuth client secret for authentication */
      ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      /* Google OAuth callback URL for redirection after authentication */
      CallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    GitHub: {
      /* GitHub OAuth client ID for authentication */
      ClientId: process.env.GITHUB_CLIENT_ID,
      /* GitHub OAuth client secret for authentication */
      ClientSecret: process.env.GITHUB_CLIENT_SECRET,
      /* GitHub OAuth callback URL for redirection after authentication */
      CallbackUrl: process.env.GITHUB_CALLBACK_URL,
    },
    Firebase: {
      /* Firebase API key for application initialization */
      apiKey: process.env.FIREBASE_API_KEY,
      /* Firebase authentication domain for user authentication */
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      /* Firebase project ID for identifying the project */
      projectId: process.env.FIREBASE_PROJECT_ID,
      /* Firebase storage bucket for file storage */
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      /* Firebase messaging sender ID for cloud messaging */
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      /* Firebase application ID for app identification */
      appId: process.env.FIREBASE_APP_ID,
      /* Firebase measurement ID for analytics */
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      /* Path to the Firebase service account JSON file */
      serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    },
  },
  ContentSecurityPolicy: {
    /* Content Security Policy directive for controlling inline scripts */
    "script-src": process.env.CSP_SCRIPT_SRC,
  },
};

/* Export the configurations object for use in the application */
module.exports = configurations;
