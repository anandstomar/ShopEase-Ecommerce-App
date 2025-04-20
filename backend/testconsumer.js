const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'test-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message on ${topic}[${partition}]: ${message.key.toString()} - ${message.value.toString()}`);
    }
  });
};

runConsumer().catch(console.error);
