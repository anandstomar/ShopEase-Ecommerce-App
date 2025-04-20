// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./e-commerce-app-3bae3-firebase-adminsdk-fbsvc-1f6dc9c1da.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


module.exports = admin ;


