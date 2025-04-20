const { sendNotification } = require('../services/notificationService');

const sendTestNotification = async (req, res) => {
  // Expecting body: { title: 'Some title', body: 'Some message', token: 'DEVICE_TOKEN' } 
  // OR { title: 'Some title', body: 'Some message', topic: 'news' }
  const messageData = req.body;
  try {
    const result = await sendNotification(messageData);
    res.status(200).json({ message: 'Notification sent successfully', result });
  } catch (error) {
    console.error('Error in sendTestNotification:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendTestNotification };
