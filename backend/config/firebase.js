// backend/config/firebase.js
const admin = require('firebase-admin');
const path = require('path');
if (!admin.apps.length) {
  try {
    let serviceAccount;

    try {
      serviceAccount = require('/etc/secrets/serviceAccountKey.json');
      console.log('✅ Loaded Firebase credentials from /etc/secrets/');
    } catch (e) {

      serviceAccount = require('./firebase-service-account.json'); 
      console.log('✅ Loaded Firebase credentials from local file');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('🚀 Firebase Admin SDK initialized successfully.');

  } catch (error) {
    console.error('❌ FATAL ERROR: Failed to initialize Firebase Admin SDK.');
    console.error('Make sure "firebase-service-account.json" exists in backend/config/ or Render secrets are set.');
    console.error(error);
  }
} else {
  console.log('ℹ️ Firebase Admin SDK was already initialized.');
}

module.exports = admin;