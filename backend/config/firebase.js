// backend/config/firebase.js
// Initialize Firebase Admin SDK
const admin = require('firebase-admin');

try {
  const serviceAccount = require('./firebase-service-account.json'); // <--- CHECK THIS PATH AND FILENAME!
  console.log('Service Account JSON loaded successfully.'); // Add this log
  console.log('Service Account Project ID:', serviceAccount.project_id); // Optional: further verification

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
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