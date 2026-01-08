const admin = require('firebase-admin');

// 1. Load your Service Account (Download this from Firebase Project Settings > Service Accounts if you don't have it locally)
// If you are testing locally, point to your local json key
const serviceAccount = require('./config/firebase-service-account.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 2. The Token you got from the Frontend logs
const registrationToken = 'dyZIWtQomBpzs8iZfDUTof:APA91bFPsJEo_LVYny3pRArw2a9WnvsYSHlw0hndRuOTy46RwpMuQt9ga75ry_saEuEOI-Pl8X_lJS2rVvwZei_TH8vB_Bzz1IjN2dR9iF0i0nfVbKyoa7U';

const message = {
  notification: {
    title: 'Test from Node Script',
    body: 'If you see this, your Service Account is working!'
  },
  token: registrationToken
};

// 3. Send
console.log("Sending message...");
admin.messaging().send(message)
  .then((response) => {
    console.log('✅ Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('❌ Error sending message:', error);
  });