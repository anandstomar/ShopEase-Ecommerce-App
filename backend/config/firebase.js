// backend/config/firebase.js
// Initialize Firebase Admin SDK
const admin = require('firebase-admin');

try {
 let serviceAccount;
  
  try {
    // Attempt to load from Render secret or local file
    serviceAccount = require('/etc/secrets/serviceAccountKey.json');
  } catch (e) {
    serviceAccount = require('./config/firebase-service-account.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    console.log('Firebase Admin SDK already initialized.');
  }

} catch (error) {
  console.error('ERROR: Failed to load service account JSON or initialize Firebase Admin SDK:', error);
  // This will catch issues with the 'require' call itself
}

module.exports = admin;
