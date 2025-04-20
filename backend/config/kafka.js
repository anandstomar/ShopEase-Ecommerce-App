const { Kafka, Partitioners } = require('kafkajs');

// Kafka instance for e-commerce (Order Service)
const kafka = new Kafka({
  clientId: 'ecommerce-app',
  brokers: ['localhost:9092']
});

const eventBusKafka = new Kafka({
  clientId: 'event-bus',
  brokers: ['localhost:9092']
});


const ecommerceProducer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

const eventBusProducer = eventBusKafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

const ecommerceConsumer = kafka.consumer({
  groupId: 'order-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

const connectProducers = async () => {
  await ecommerceProducer.connect();
  await eventBusProducer.connect();
  console.log('✅ Kafka producers connected successfully.')
};

const kafkaNotification = new Kafka({
  clientId: 'notification-service',
  brokers: ['localhost:9092']
});
const notificationConsumer = kafkaNotification.consumer({
  groupId: 'notification-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});


;
const eventBusConsumer = eventBusKafka.consumer({ 
  groupId: 'event-group' ,
  sessionTimeout: 30000,
  heartbeatInterval: 3000,});

/**
 * Connect the Event Bus Producer.
 */
async function connectEventBusProducer() {
  try {
    await eventBusProducer.connect();
    console.log('Event Bus Kafka Producer connected');
  } catch (error) {
    console.error('Error connecting Event Bus Kafka Producer:', error);
    throw error;
  }
}

/**
 * Send an event (message) to a specified topic.
 *
 * @param {string} topic - Kafka topic name.
 * @param {string} key - A key to partition the messages (for example, order id or user id).
 * @param {object} value - The payload to send. It will be JSON-stringified.
 */
async function sendEvent(topic, key, value) {
  try {
    await eventBusProducer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(value)
        }
      ],
    });
    console.log(`Event sent to topic "${topic}":`, value);
  } catch (error) {
    console.error('Error sending event:', error);
    throw error;
  }
}

/**
 * Connect and subscribe the Event Bus Consumer to a topic.
 *
 * @param {string} topic - The topic to subscribe to.
 * @param {function} messageHandler - Callback function to handle each message.
 */
async function connectEventBusConsumer(topic, messageHandler) {
  try {
    await eventBusConsumer.connect();
    await eventBusConsumer.subscribe({ topic, fromBeginning: true });
    await eventBusConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const parsedValue = JSON.parse(message.value.toString());
        console.log(`Received message on event-bus topic "${topic}":`, parsedValue);
        messageHandler({ topic, partition, message: parsedValue });
      },
    });
    console.log(`Event Bus Consumer connected and subscribed to topic "${topic}"`);
  } catch (error) {
    console.error('Error connecting Event Bus Consumer:', error);
    throw error;
  }
}


module.exports = {
  // E-commerce & Notification Kafka exports
  connectProducers,
  ecommerceProducer,
  ecommerceConsumer,
  kafkaNotification,
  notificationConsumer,

  // Event Bus exports
  eventBusKafka,
  eventBusProducer,
  eventBusConsumer,
  connectEventBusProducer,
  sendEvent,
  connectEventBusConsumer,
};
