const {
  createFullOrder,
  getOrdersByUserId,
  getOrderItemsByOrderId,
  getOrderStatusById
} = require('../models/orderModel');
const { ecommerceProducer } = require('../config/kafka');
const { sendEmail } = require('../utils/emailService');
const { getUserById } = require('../models/userModel');
const { notifyOrderCreated } = require('../services/notificationService');

async function placeOrder(orderData) {
  const { user_id, items, total, payment_id } = orderData;

  // 1) Create DB transaction
  const order = await createFullOrder({ user_id, items, total, payment_id });

  // // 2) Publish Kafka event
  // try {
  //   await ecommerceProducer.send({
  //     topic: 'orders',
  //     messages: [{
  //       key: String(order.id),
  //       value: JSON.stringify({
  //         orderId: order.id,
  //         user_id,
  //         items,
  //         total,
  //         created_at: order.created_at,
  //       })
  //     }]
  //   });
  //   console.log(`Order event published for order id ${order.id}`);
  // } catch (err) {
  //   console.error('Kafka publish error:', err);
  // }

  try {
    const payload = JSON.stringify({
      orderId: order.id,
      userId: user_id,
      total: total,
      created_at: order.created_at
    });

    await ecommerceProducer.send({
      topic: 'order.created',
      messages: [{ key: String(order.id), value: payload }]
    });
    console.log(`[Kafka] Event sent to 'order.created' for Order ID: ${order.id}`);
  } catch (err) {
    console.error('[Kafka] Failed to send event:', err);
  }

  // 3) Lookup user + send email
  const user = await getUserById(user_id);
  if (user && user.email) {
    const subject = 'Your Order Confirmation';
    const body = `Hi ${user.name || 'there'},

Thank you for your order!\n• Order ID: ${order.id}\n• Total: ₹${total.toFixed(2)}\n• Placed on: ${order.created_at.toISOString()}\n
We’ll notify you once it ships.\n
– The E‑Commerce Team`;

    try {
      await sendEmail(user.email, subject, body);
      console.log(`Confirmation email sent to ${user.email}`);
    } catch (err) {
      console.error('Email send failed:', err);
    }
  } else {
    console.warn(`Cannot send email: user ${user_id} has no email`);
  }

  // // 4) Send push notification
  // try {
  //   await notifyOrderCreated({
  //     userId: user_id,
  //     orderId: order.id,
  //     total: total
  //   });
  // } catch (notifErr) {
  //   console.error('Notification service error:', notifErr);
  // }

  return order;
}

async function getOrdersForUser(userId) {
  const rawOrders = await getOrdersByUserId(userId);

  const ordersWithItems = await Promise.all(
    rawOrders.map(async order => {
      const items = await getOrderItemsByOrderId(order.id);
      return {
        ...order,
        items: items.map(i => ({
          product_id: i.product_id,
          quantity:   i.quantity
        }))
      };
    })
  );

  return ordersWithItems;
}

async function fetchOrderStatus(orderId) {
  const status = await getOrderStatusById(orderId);
  if (!status) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  return status;
}

module.exports = {
  placeOrder,
  getOrdersForUser,
  fetchOrderStatus
};





// const { createFullOrder, getOrdersByUserId, getOrderItemsByOrderId} = require('../models/orderModel');
// const { ecommerceProducer } = require('../config/kafka');
// const { sendEmail } = require('../utils/emailService');

// // Place an order and publish a Kafka event
// const placeOrder = async (orderData) => {
//   // Insert order into PostgreSQL
//   const order = await createFullOrder(orderData);

//   const user = await getUserById(user_id);
//   if (!user || !user.email) {
//     console.warn(`Cannot send email: user ${user_id} has no email`);
//     return order;
//   }

//   const message = `Thank you for your order! Order ID: ${order.order_id}`;
//   await sendEmail(order.email, 'Order Confirmation', message);
  
//   // Publish event to Kafka topic 'orders'
//   try {
//     await ecommerceProducer.send({
//       topic: 'orders',
//       messages: [
//         { key: String(order.id), value: JSON.stringify(order) }
//       ]
//     });
//     console.log(`Order event published for order id ${order.id}`);
//   } catch (error) {
//     console.error('Kafka publish error:', error);
//     // Optionally decide if this error should rollback the DB insert or just log.
//   }

//   return order;
// };


// async function getOrdersForUser(userId) {
//   const rawOrders = await getOrdersByUserId(userId);

//   const ordersWithItems = await Promise.all(
//     rawOrders.map(async order => {
//       const items = await getOrderItemsByOrderId(order.id);

//       return {
//         id:          order.id,
//         user_id:     order.user_id,
//         total:       order.total,
//         status:      order.status,
//         created_at:  order.created_at,
//         updated_at:  order.updated_at,
//         items:       items.map(i => ({
//                        product_id: i.product_id,
//                        quantity:   i.quantity
//                      }))
//       };
//     })
//   );

//   return ordersWithItems;
// }

// module.exports = { placeOrder, getOrdersForUser };



