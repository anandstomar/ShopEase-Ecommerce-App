const { Kafka } = require('kafkajs');

// require('dotenv').config(); 
const { KAFKA_USER, KAFKA_PASSWORD } = process.env;

const kafka = new Kafka({
  clientId: 'ecommerce_app',
  brokers: ['pkc-921jm.us-east-2.aws.confluent.cloud:9092'], 
  

  ssl: { rejectUnauthorized: false },
  
  sasl: {
    mechanism: 'plain',
    username: KAFKA_USER,   
    password: KAFKA_PASSWORD  
  },
  connectionTimeout: 10000, 
  authenticationTimeout: 10000,
});

const ecommerceProducer = kafka.producer();

const notificationConsumer = kafka.consumer({
  groupId: 'notification-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

const connectProducers = async () => {
  try {
    await ecommerceProducer.connect();
    console.log('✅ Kafka Producer connected');
  } catch (err) {
    console.error('❌ Kafka Producer connection error:', err);
  }
};

module.exports = {
  kafka,
  ecommerceProducer,
  notificationConsumer,
  connectProducers
};







// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'ecommerce-app',
//   brokers: ['localhost:9092'] 
// });

// // 1. Producer for Order Service
// const ecommerceProducer = kafka.producer();

// // 2. Consumer for Notification Service
// const notificationConsumer = kafka.consumer({
//   groupId: 'notification-group',
//   sessionTimeout: 30000,
//   heartbeatInterval: 3000,
// });

// const connectProducers = async () => {
//   try {
//     await ecommerceProducer.connect();
//     console.log('✅ Kafka Producer connected');
//   } catch (err) {
//     console.error('❌ Kafka Producer connection error:', err);
//   }
// };

// module.exports = {
//   kafka,
//   ecommerceProducer,
//   notificationConsumer,
//   connectProducers
// };

