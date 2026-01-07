const admin = require('../config/firebase');
const { getDeviceTokensByUserId } = require('../models/NotificationModel');
const { notificationConsumer } = require('../config/kafka'); // Import Consumer
const { pool: db } = require('../config/postgresql');

// --- Kafka Consumer Logic ---
async function runNotificationConsumer() {
  try {
    await notificationConsumer.connect();
    await notificationConsumer.subscribe({ topic: 'order.created', fromBeginning: false });
    console.log('👂 Notification Service listening on "order.created"');

    await notificationConsumer.run({
      eachMessage: async ({ topic, message }) => {
        const event = JSON.parse(message.value.toString());
        console.log(`[Kafka] Received event for Order ${event.orderId}`);

        if (topic === 'order.created') {
          await notifyOrderCreated(event);
        }
      },
    });
  } catch (err) {
    console.error('[Kafka] Consumer error:', err);
  }
}

async function deleteDeviceToken(token) {
  await db.query('DELETE FROM user_devices WHERE device_token = $1', [token]);
}

// --- FCM Logic ---
async function notifyOrderCreated(event) {
  const tokens = await getDeviceTokensByUserId(event.userId);
  if (!tokens.length) {
    console.log(`[FCM] No devices found for User ${event.userId}`);
    return;
  }

  const message = {
    notification: {
      title: 'Order Placed!',
      body: `Your order #${event.orderId} of ₹${event.total} is confirmed.`
    },
    data: { orderId: String(event.orderId) },
    tokens: tokens
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`[FCM] Sent: ${response.successCount} success, ${response.failureCount} failed.`);
    if (response.failureCount > 0) {
      const failedTokens = [];
      for (let idx = 0; idx < response.responses.length; idx++) {
        const resp = response.responses[idx];
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.error(`❌ FCM Failure Reason:`, resp.error);
        }
        if (resp.error && resp.error.code === 'messaging/registration-token-not-registered') {
          console.log(`🗑️ Removing stale token: ${tokens[idx]}`);
          // Add a function to delete this specific token from your DB
          await deleteDeviceToken(tokens[idx]);
        }
      }
    }
  } catch (err) {
    console.error('[FCM] Send error:', err);
  }
}

module.exports = { runNotificationConsumer, notifyOrderCreated };




// const admin = require('firebase-admin');
// const { getDeviceTokensByUserId, getAllDeviceTokens } = require('../models/NotificationModel');

// async function sendNotification(tokens, payload) {
//   if (!tokens.length) return;
//   const message = {
//     tokens,
//     notification: payload.notification,
//     data: payload.data || {},
//   };
//   const response = await admin.messaging().sendEachForMulticast(message);
//   console.log(`Sent ${response.successCount} notifications, ${response.failureCount} failures.`);
//   if (response.failureCount > 0) {
//     const failedTokensInfo = [];
//     response.responses.forEach((resp, idx) => {
//       if (!resp.success) {
//         // Log the token itself, and the error code/message for detailed debugging
//         failedTokensInfo.push({
//           token: tokens[idx],
//           error: resp.error ? { code: resp.error.code, message: resp.error.message } : 'Unknown error'
//         });
//       }
//     });
//     console.error('Detailed list of failed tokens and errors:', failedTokensInfo);
//   }
// }

// async function notifyOrderCreated(event) {
//   const tokens = await getDeviceTokensByUserId(event.userId);
//   console.log(`Sending order created notification to ${tokens.length} device for user ${event.userId}`);
//   await sendNotification(tokens, {
//     notification: {
//       title: 'Order Confirmed',
//       body: `Your order #${event.orderId} has been placed! Total: ₹${event.total}`,
//     },
//     data: { orderId: String(event.orderId) },
//   });
// }

// async function notifyProductUpdated(event) {
//   const tokens = await getAllDeviceTokens();
//   await sendNotification(tokens, {
//     notification: {
//       title: 'Product Updated',
//       body: `${event.name} details were updated.`,
//     },
//     data: { productId: String(event.productId) },
//   });
// }

// module.exports = { notifyOrderCreated, notifyProductUpdated }



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
