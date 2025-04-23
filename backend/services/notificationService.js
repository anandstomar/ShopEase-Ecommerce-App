const admin = require('firebase-admin');
const { getDeviceTokensByUserId, getAllDeviceTokens } = require('../models/NotificationModel');

async function sendNotification(tokens, payload) {
  if (!tokens.length) return;
  const message = {
    tokens,
    notification: payload.notification,
    data: payload.data || {},
  };
  const response = await admin.messaging().sendMulticast(message);
  console.log(`Sent ${response.successCount} notifications, ${response.failureCount} failures.`);
}

async function notifyOrderCreated(event) {
  const tokens = await getDeviceTokensByUserId(event.userId);
  await sendNotification(tokens, {
    notification: {
      title: 'Order Confirmed',
      body: `Your order #${event.orderId} has been placed! Total: ₹${event.total}`,
    },
    data: { orderId: String(event.orderId) },
  });
}

async function notifyProductUpdated(event) {
  const tokens = await getAllDeviceTokens();
  await sendNotification(tokens, {
    notification: {
      title: 'Product Updated',
      body: `${event.name} details were updated.`,
    },
    data: { productId: String(event.productId) },
  });
}

module.exports = { notifyOrderCreated, notifyProductUpdated }



// const { notificationConsumer } = require('../config/kafka');
// const admin = require('../config/firebase');

// /**
//  * sendNotification: Sends a notification via Firebase Cloud Messaging.
//  * @param {Object} messageData - Should contain:
//  *  - title: Notification title
//  *  - body: Notification body
//  *  - token: The recipient device token (if using direct device messaging)
//  *    Or optionally a "topic" property if you want to send to a topic.
//  */
// const sendNotification = async (messageData) => {
//   // Construct the message payload for FCM
//   const message = {
//     notification: {
//       title: messageData.title,
//       body: messageData.body,
//     },
//     // Use token if sending to a specific device; alternatively, replace with "topic: messageData.topic"
//     ...(messageData.token ? { token: messageData.token } : { topic: messageData.topic }),
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log('Successfully sent notification:', response);
//     return response;
//   } catch (error) {
//     console.error('Error sending notification:', error);
//     throw error;
//   }
// };

// /**
//  * runNotificationConsumer: Starts the Kafka consumer to listen for messages on the "notifications" topic.
//  */
// const runNotificationConsumer = async () => {
//   await notificationConsumer.connect();
//   await notificationConsumer.subscribe({ topic: 'notifications', fromBeginning: true });
//   console.log('Notification Consumer subscribed to topic: notifications');

//   await notificationConsumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       console.log(`Received message: ${message.value.toString()}`);
//       try {
//         const messageData = JSON.parse(message.value.toString());
//         await sendNotification(messageData);
//       } catch (error) {
//         console.error('Error processing Kafka message:', error);
//       }
//     },
//   });
// };

// module.exports = { runNotificationConsumer, sendNotification };
