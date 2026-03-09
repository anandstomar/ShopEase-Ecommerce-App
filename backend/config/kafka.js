const Kafka = require("node-rdkafka");
console.log(Kafka.features); 
const path = require("path");
const fs = require("fs"); // Make sure to import fs!
require("dotenv").config();

let SSL_CA_LOCATION;

const renderPath = "/etc/secrets/ca.pem"; 
const localPath = path.join(__dirname, "ca.pem"); 

if (fs.existsSync(renderPath)) {
  SSL_CA_LOCATION = renderPath;
  console.log('✅ Loaded Kafka CA cert from Render Secrets (/etc/secrets/ca.pem)');
} else if (fs.existsSync(localPath)) {
  SSL_CA_LOCATION = localPath;
  console.log('✅ Loaded Kafka CA cert from local file system');
} else {
  console.error('❌ CRITICAL: Could not find ca.pem in Render or Local path!');
}

const TOPIC_NAME = "order.created";
const SASL_MECHANISM = "SCRAM-SHA-256";

// 1. Define only the fields BOTH need here
const connectionConfig = {
  "metadata.broker.list": process.env.KAFKA_BROKER,
  "security.protocol": "sasl_ssl",
  "sasl.mechanism": "SCRAM-SHA-256",
  "sasl.username": process.env.KAFKA_USERNAME,
  "sasl.password": process.env.KAFKA_PASSWORD2, // Using PASSWORD2 as per your snippet
  "ssl.ca.location": SSL_CA_LOCATION ,  
};

// 2. Producer gets connection + delivery reports + debug
const ecommerceProducer = new Kafka.Producer({
  ...connectionConfig,
  "dr_cb": true,
});

// 3. Consumer gets ONLY connection + group.id (NO dr_cb)
const notificationConsumer = new Kafka.KafkaConsumer({
  ...connectionConfig,
  "group.id": `notification-group-${Date.now()}`, 
  "auto.offset.reset": "latest"
}, {});

const connectProducers = () => new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    reject(new Error("Kafka Producer connection timed out (30s)"));
  }, 30000);

  console.log("⏳ Attempting to connect Kafka Producer...");

  ecommerceProducer.on("event.log", (log) => {
    console.log(`[Kafka Log] ${log.fac}: ${log.message}`);
  });

  ecommerceProducer.on("ready", (info) => {
    clearTimeout(timeout);
    console.log("✅ Kafka Producer ready:", info.name);
    resolve(ecommerceProducer);
  });

  ecommerceProducer.on("event.error", (err) => {
    clearTimeout(timeout);
    console.error("❌ Kafka Producer Error:", err);
    reject(err);
  });

   ecommerceProducer.on('delivery-report', (err, report) => {
  if (err) {
    console.error('❌ Message delivery failed:', err);
  } else {
    console.log(`🚚 SUCCESS: Message delivered to partition ${report.partition} at offset ${report.offset}`);
  }
});

  ecommerceProducer.connect();
  ecommerceProducer.setPollInterval(100);

});


module.exports = {
  ecommerceProducer,
  notificationConsumer,
  connectProducers
};

















// const { Kafka } = require('kafkajs');

// // require('dotenv').config(); 
// const { KAFKA_USER, KAFKA_PASSWORD } = process.env;

// const kafka = new Kafka({
//   clientId: 'ecommerce_app',
//   brokers: ['pkc-921jm.us-east-2.aws.confluent.cloud:9092'], 
  

//   ssl: { rejectUnauthorized: false },
  
//   sasl: {
//     mechanism: 'plain',
//     username: KAFKA_USER,   
//     password: KAFKA_PASSWORD  
//   },
//   connectionTimeout: 10000, 
//   authenticationTimeout: 10000,
// });

// const ecommerceProducer = kafka.producer();

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

