const { ecommerceProducer, ecommerceConsumer, notificationConsumer, eventBusProducer, eventBusConsumer } = require('./config/kafka'); // Replace with your actual module path

const checkKafkaConnections = async () => {
  try {
    // Attempt to connect the producer
    await ecommerceProducer.connect();
    console.log('✅ Producer connected successfully.');

    // Attempt to connect the consumer
    await ecommerceConsumer.connect();
    console.log('✅ Consumer connected successfully.');

    // Attempt to connect the notification consumer
    await notificationConsumer.connect();
    console.log('✅ Notification Consumer connected successfully.');

    await eventBusProducer.connect();
    console.log('✅ Event Bus Producer connected successfully.');

    await eventBusConsumer.connect();
    console.log('✅ Event Bus Consumer connected successfully.');

    // Disconnect after successful connections
    await ecommerceProducer.disconnect();
    await ecommerceConsumer.disconnect();
    await notificationConsumer.disconnect();
    await eventBusProducer.disconnect();
    await eventBusConsumer.disconnect();
    console.log('🔌 All Kafka clients disconnected after health check.');
  } catch (error) {
    console.error('❌ Kafka connection error:', error);
  }
};

checkKafkaConnections();
