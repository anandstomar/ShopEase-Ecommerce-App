const { placeOrder, getOrdersForUser, fetchOrderStatus} = require('../services/orderService');
const { getOrderById } = require("../models/orderModel")

async function placeOrderController(req, res) {
  try {
    const { user_id, items, total, payment_id } = req.body;
    console.log('Incoming order payload:', req.body);

    const order = await placeOrder({ user_id, items, total, payment_id });
    return res.status(201).json({
      success: true,
      orderId: order.id,
      createdAt: order.created_at
    });
  } catch (err) {
    console.error('Order placement error:', err);
    return res.status(500).json({ error: 'Could not place order' });
  }
}

async function getMyOrdersController(req, res) {
  try {
    const user_id = parseInt(req.params.userId, 10);
    const orders = await getOrdersForUser(user_id);
    return res.json({ success: true, orders });
  } catch (err) {
    console.error('Get my orders error:', err);
    return res.status(500).json({ error: 'Could not fetch orders' });
  }
}

async function getOrderByIds(req, res)  {
  try {
    const { orderId } = req.params;
    const order = await getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Send back a single 'order' object
    res.status(200).json({ success: true, order: order });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

async function getOrderStatusController(req, res) {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const status  = await fetchOrderStatus(orderId);
    res.json({
      id:           status.id,
      status:       status.status,
      current_lat:  status.current_lat,
      current_lng:  status.current_lng,
      driver: {
        id:   status.driver_id,
        name: status.driver_name
      }
    });
  } catch (err) {
    console.error('Order status error:', err);
    res
      .status(err.statusCode || 500)
      .json({ error: err.message || 'Server error' });
  }
}

module.exports = {
  placeOrderController,
  getMyOrdersController,
  getOrderStatusController,
  getOrderByIds
};





