const { saveDeviceToken } = require('../models/NotificationModel');
const { getUserByFirebaseUid } = require('../models/userModel');
const admin = require('../config/firebase'); 

async function registerDevice(req, res) {
  try {
    const hdr   = req.headers.authorization || '';
    const idToken = hdr.replace(/^Bearer\s+/, '');
    console.log('Backend received ID token (first 30 chars):', idToken.substring(0, 30) + '...'); // <--- ADD THIS LINE
    console.log('Backend received ID token length:', idToken.length); // <--- ADD THIS LINE
    const decoded = await admin.auth().verifyIdToken(idToken);

    const dbUser = await getUserByFirebaseUid(decoded.uid);
    if (!dbUser) return res.status(404).json({ error: 'User not found' });
    const userId = dbUser.id;

    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token missing' });
    await saveDeviceToken(userId, token);
    res.sendStatus(204);
  } catch (err) {
    console.error('registerDevice error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { registerDevice };


// const { sendNotification } = require('../services/notificationService');

// async function sendNotification(tokens, payload) {
//   if (!tokens.length) return;
//   const message = {
//     notification: payload.notification,
//     data: payload.data || {},
//     tokens,
//   };
//   try {
//     const response = await admin.messaging().sendMulticast(message);
//     console.log(`FCM sent:`, response.successCount, 'success,', response.failureCount, 'failures');
//   } catch (err) {
//     console.error('FCM send error:', err);
//   }
// }

// const sendTestNotification = async (req, res) => {
//   // Expecting body: { title: 'Some title', body: 'Some message', token: 'DEVICE_TOKEN' } 
//   // OR { title: 'Some title', body: 'Some message', topic: 'news' }
//   const messageData = req.body;
//   try {
//     const result = await sendNotification(messageData);
//     res.status(200).json({ message: 'Notification sent successfully', result });
//   } catch (error) {
//     console.error('Error in sendTestNotification:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

//module.exports = { sendNotification };
