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
    // const event = { orderId: order.id, user_id, items, total };
    // await ecommerceProducer.send({
    //   topic: 'order.created',
    //   messages: [{ value: JSON.stringify(event) }]
    // });

    res.status(201).json({ success: true, orderId: order.id });
  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ error: 'Could not place order' });
  }
}


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




module.exports = { placeOrder,getMyOrders };


