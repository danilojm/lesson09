require("dotenv").config();
// Global configurations object contains Application Level variables such as:
// client secrets, passwords, connection strings, and misc flags
const configurations = {
  ConnectionStrings: {
    // MongoDB: process.env.CONNECTION_STRING_MONGODB,
    MongoDB: "mongodb+srv://200549002:200549002@mongodb.p7kr3.mongodb.net/?retryWrites=true&w=majority&appName=MongoDB",
  },
  Authentication: {
    Google: {
      ClientId: '381672938965-gn5p42j8n8r7jbonb3pc40kkjgbah9mr.apps.googleusercontent.com',
      ClientSecret: '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',
      CallbackUrl: "http://localhost:3000/auth/google/callback"
    },
    GitHub: {
      ClientId: "Iv23li0nocJs0cC83I0U",
      ClientSecret: "7b1f99ee5532b09f987e8ee49fb8132fae36fbe5",
      CallbackUrl: "http://localhost:3000/github/callback"
    },
    Firebase: {
      apiKey: "AIzaSyDk6vS5KcEwlZWqWV3kwzZwN5OyiHecY3w",
      authDomain: "javascriptauth-ed801.firebaseapp.com",
      projectId: "javascriptauth-ed801",
      storageBucket: "javascriptauth-ed801.firebasestorage.app",
      messagingSenderId: "397755663232",
      appId: "1:397755663232:web:f79799aad55612ac777765",
      measurementId: "G-CWHLHDSL1V",
      serviceAccountPath: "../keys/firebase.json"
    },

  },
  ContentSecurityPolicy: {
    "script-src": "'self' 'unsafe-inline'"  // Relaxed policy for inline scripts
  },
};
module.exports = configurations;
