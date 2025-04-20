const { notificationConsumer } = require('../config/kafka');
const admin = require('../config/firebase');

/**
 * sendNotification: Sends a notification via Firebase Cloud Messaging.
 * @param {Object} messageData - Should contain:
 *  - title: Notification title
 *  - body: Notification body
 *  - token: The recipient device token (if using direct device messaging)
 *    Or optionally a "topic" property if you want to send to a topic.
 */
const sendNotification = async (messageData) => {
  // Construct the message payload for FCM
  const message = {
    notification: {
      title: messageData.title,
      body: messageData.body,
    },
    // Use token if sending to a specific device; alternatively, replace with "topic: messageData.topic"
    ...(messageData.token ? { token: messageData.token } : { topic: messageData.topic }),
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * runNotificationConsumer: Starts the Kafka consumer to listen for messages on the "notifications" topic.
 */
const runNotificationConsumer = async () => {
  await notificationConsumer.connect();
  await notificationConsumer.subscribe({ topic: 'notifications', fromBeginning: true });
  console.log('Notification Consumer subscribed to topic: notifications');

  await notificationConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
      try {
        const messageData = JSON.parse(message.value.toString());
        await sendNotification(messageData);
      } catch (error) {
        console.error('Error processing Kafka message:', error);
      }
    },
  });
};

module.exports = { runNotificationConsumer, sendNotification };
