const { Kafka, Partitioners } = require('kafkajs');
const { notifyOrderCreated, notifyProductUpdated } = require('../services/notificationService');
const broker = process.env.KAFKA_BROKER;
if (!broker) throw new Error('KAFKA_BROKER env var is required');

const kafka = new Kafka({
  clientId: 'ecommerce-app',
  brokers: [broker]
});

const kafkaEventBus = new Kafka({
  clientId: 'event-bus',
  brokers: [broker]
});

const kafkaNotification = new Kafka({
  clientId: 'notification-service',
  brokers: [broker]
});
  // brokers: ['localhost:9092']

const ecommerceProducer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

const eventBusProducer = kafkaEventBus.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});


const ecommerceConsumer = kafka.consumer({
  groupId: 'order-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

const eventBusConsumer = kafkaEventBus.consumer({ 
  groupId: 'event-group' ,
  sessionTimeout: 30000,
  heartbeatInterval: 3000,});


const notificationConsumer = kafkaNotification.consumer({
  groupId: 'notification-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

const connectProducers = async () => {
  await ecommerceProducer.connect();
  await eventBusProducer.connect();
  console.log('✅ Kafka producers connected successfully.')
};


  async function runConsumer() {
    await notificationConsumer.connect();
    await notificationConsumer.subscribe({ topic: 'order.created' , fromBeginning: false });
    await notificationConsumer.subscribe({ topic: 'product.updated' ,  fromBeginning: false });
    console.log('👂 notificationConsumer subscribed to order.created & product.updated');

    await notificationConsumer.run({
      eachMessage: async ({ topic, message }) => {
        const event = JSON.parse(message.value.toString());
        if (topic === 'order.created') await notifyOrderCreated(event);
        if (topic === 'product.updated') await notifyProductUpdated(event);
      },
    });
  }
  
  runConsumer().catch(console.error); 

// /**
//  * Connect the Event Bus Producer.
//  */
// async function connectEventBusProducer() {
//   try {
//     await eventBusProducer.connect();
//     console.log('Event Bus Kafka Producer connected');
//   } catch (error) {
//     console.error('Error connecting Event Bus Kafka Producer:', error);
//     throw error;
//   }
// }

// /**
//  * Send an event (message) to a specified topic.
//  *
//  * @param {string} topic - Kafka topic name.
//  * @param {string} key - A key to partition the messages (for example, order id or user id).
//  * @param {object} value - The payload to send. It will be JSON-stringified.
//  */
// async function sendEvent(topic, key, value) {
//   try {
//     await eventBusProducer.send({
//       topic,
//       messages: [
//         {
//           key,
//           value: JSON.stringify(value)
//         }
//       ],
//     });
//     console.log(`Event sent to topic "${topic}":`, value);
//   } catch (error) {
//     console.error('Error sending event:', error);
//     throw error;
//   }
// }

// /**
//  * Connect and subscribe the Event Bus Consumer to a topic.
//  *
//  * @param {string} topic - The topic to subscribe to.
//  * @param {function} messageHandler - Callback function to handle each message.
//  */
// async function connectEventBusConsumer(topic, messageHandler) {
//   try {
//     await eventBusConsumer.connect();
//     await eventBusConsumer.subscribe({ topic, fromBeginning: true });
//     await eventBusConsumer.run({
//       eachMessage: async ({ topic, partition, message }) => {
//         const parsedValue = JSON.parse(message.value.toString());
//         console.log(`Received message on event-bus topic "${topic}":`, parsedValue);
//         messageHandler({ topic, partition, message: parsedValue });
//       },
//     });
//     console.log(`Event Bus Consumer connected and subscribed to topic "${topic}"`);
//   } catch (error) {
//     console.error('Error connecting Event Bus Consumer:', error);
//     throw error;
//   }
// }


module.exports = {
  connectProducers,
  ecommerceProducer,
  ecommerceConsumer,
  kafkaNotification,
  notificationConsumer,
  kafkaEventBus,
  eventBusProducer,
  eventBusConsumer,
  runConsumer,
};
