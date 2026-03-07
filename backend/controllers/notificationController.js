const { saveDeviceToken } = require('../models/NotificationModel');
const { getUserByFirebaseUid } = require('../models/userModel');
const admin = require('../config/firebase'); 

async function registerDevice(req, res) {
  try {
    const hdr   = req.headers.authorization || '';
    const idToken = hdr.replace(/^Bearer\s+/, '');
    console.log('Backend received ID token (first 30 chars):', idToken.substring(0, 30) + '...'); 
    console.log('Backend received ID token length:', idToken.length); 
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

