const { createOrder, getOrdersByUserId, getOrderItemsByOrderId} = require('../models/orderModel');
const { ecommerceProducer } = require('../config/kafka');

// Place an order and publish a Kafka event
const placeOrder = async (orderData) => {
  // Insert order into PostgreSQL
  const order = await createOrder(orderData);
  
  // Publish event to Kafka topic 'orders'
  try {
    await ecommerceProducer.send({
      topic: 'orders',
      messages: [
        { key: String(order.id), value: JSON.stringify(order) }
      ]
    });
    console.log(`Order event published for order id ${order.id}`);
  } catch (error) {
    console.error('Kafka publish error:', error);
    // Optionally decide if this error should rollback the DB insert or just log.
  }

  return order;
};


async function getOrdersForUser(userId) {
  const rawOrders = await getOrdersByUserId(userId);

  const ordersWithItems = await Promise.all(
    rawOrders.map(async order => {
      const items = await getOrderItemsByOrderId(order.id);

      return {
        id:          order.id,
        user_id:     order.user_id,
        total:       order.total,
        status:      order.status,
        created_at:  order.created_at,
        updated_at:  order.updated_at,
        items:       items.map(i => ({
                       product_id: i.product_id,
                       quantity:   i.quantity
                     }))
      };
    })
  );

  return ordersWithItems;
}

module.exports = { placeOrder, getOrdersForUser };



// const { createOrder, getOrdersByUser } = require('../models/orderModel');
// const { producer } = require('../config/kafka');

// // Place an order and publish an event to Kafka
// const placeOrder = async (orderData) => {
//   const order = await createOrder(orderData);
  
//   // Publish event to Kafka topic 'orders'
//   await producer.send({
//     topic: 'orders',
//     messages: [
//       { key: String(order.id), value: JSON.stringify(order) }
//     ]
//   });
  
//   return order;
// };

// // Retrieve orders for a specific user
// const getOrdersForUser = async (userId) => {
//   return await getOrdersByUser(userId);
// };


// const sendOrderEvent = async (order) => {
//   await producer.send({
//     topic: 'order-events',
//     messages: [
//       {
//         key: `${order.id}`,
//         value: JSON.stringify(order)
//       }
//     ]
//   });
// };


// module.exports = { placeOrder, getOrdersForUser, sendOrderEvent };
