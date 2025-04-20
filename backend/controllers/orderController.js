const { getOrdersForUser } = require('../services/orderService');
const { createOrder, createOrderItem ,createFullOrder } = require('../models/orderModel');
const {ecommerceProducer} = require('../config/kafka');

async function placeOrder(req, res) {
  try {
    const { user_id, items, total, payment_id } = req.body;
    console.log('Incoming order payload:', req.body)

    const order = await createFullOrder({
      user_id,
      total,
      payment_id,
      items
    });


    // publish Kafka event
    const event = { orderId: order.id, user_id, items, total };
    await ecommerceProducer.send({
      topic: 'order.created',
      messages: [{ value: JSON.stringify(event) }]
    });

    res.status(201).json({ success: true, orderId: order.id });
  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ error: 'Could not place order' });
  }
}


// const placeOrder = async (req, res) => {
//   try {
//     // Expected payload: { user_id, product_ids (array), total }
//     const order = await orderService.placeOrder(req.body);
//     res.status(201).json(order);
//   } catch (error) {
//     console.error('Error in placing order:', error);
//     res.status(500).json({ error: error.message });
//   }
// };



async function getMyOrders(req, res) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const orders = await getOrdersForUser(userId);
    res.json(orders);
  } catch (err) {
    console.error('Get my orders error:', err);
    res.status(500).json({ error: 'Could not fetch orders' });
  }
}



// async function getMyOrders(req, res) {
//   try {
//     const userId = parseInt(req.params.userId, 10);
//     if (isNaN(userId)) {
//       return res.status(400).json({ error: 'Invalid or missing userId' });
//     }
//     const orders = await getOrdersByUser(userId);
//     return res.json(orders);
//   } catch (err) {
//     console.error('Get my orders error:', err);
//     return res.status(500).json({ error: 'Could not fetch orders' });
//   }
// }


module.exports = { placeOrder,getMyOrders };


// const orderService = require('../services/orderService');
// const { sendOrderEvent } = require('../services/orderService');

// // Place an order
// const placeOrder = async (req, res) => {
//   try {
//     const order = await orderService.placeOrder(req.body);
    
//     await sendOrderEvent(order);

//     res.status(201).json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get orders for a specific user
// const getOrdersForUser = async (req, res) => {
//   try {
//     const orders = await orderService.getOrdersForUser(req.params.userId);
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { placeOrder, getOrdersForUser };
