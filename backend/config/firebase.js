// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./ecommerceapp.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


module.exports = admin ;


