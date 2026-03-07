const crypto = require('crypto');
const express = require('express');
const razorpay = require('../config/razorpay');
const pool = require("../config/postgresql") 
const productService = require("../services/productService")
const router = express.Router();
const { sendConfirmationEmail } = require('../utils/emailService');
const {createPendingOrder, markOrderAsPaid} = require("../models/orderModel")
require('dotenv').config();

// Notice `express.raw` - this is required to preserve the exact payload for signature verification
router.post('/webhooks/razorpay',express.raw({ type: 'application/json' }), async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET; 
  const signature = req.headers['x-razorpay-signature'];

  try {
    // 1. Verify the Signature (The "Handshake")
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('⚠️ Invalid Webhook Signature');
      return res.status(400).send('Invalid signature');
    }

    // Now it's safe to parse the JSON
   const event = JSON.parse(req.body.toString());

    // 2. Handle the specific event
    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentData = event.payload.payment.entity;
      const razorpayOrderId = paymentData.order_id;
      const paymentId = paymentData.id;

      // 3. The "Bank Transfer" Logic (Idempotency & ACID Transaction)
      // Ideally, wrap this in a database transaction block
      
      const updatedOrder = await markOrderAsPaid(razorpayOrderId, paymentId);

      console.log("updatedOrder",updatedOrder)

     if (!updatedOrder) {
         console.log('Webhook ignored: Order not found or already paid.');
         return res.status(200).send('OK'); 
      }

      sendConfirmationEmail(updatedOrder.user_id, updatedOrder.id);
      
      console.log(`✅ Order ${updatedOrder.id} successfully marked as PAID`);
    }

    res.status(200).send('Webhook processed successfully');

  } catch (error) {
    console.error('Webhook processing error:', error);
    // Returning 500 tells Razorpay to retry this webhook later
    res.status(500).send('Internal Server Error'); 
  }
});


router.post('/initiate', async (req, res) => {
  const { items, userId } = req.body;

  if (!userId) {
      return res.status(400).json({ error: 'User ID is required to create an order' });
    }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart cannot be empty' });
  }

  try {
    let calculatedTotal = 0;
    const orderItems = [];

    // 1. Calculate the real total securely using the service layer
    for (const item of items) {
      // Fetch the product using your existing service instead of raw Postgres client
      const product = await productService.getProductById(item.product_id);

      if (!product) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }

      // Ensure price is treated as a number (in case the DB returns a string for numeric types)
      const productPrice = parseFloat(product.price);
      calculatedTotal += productPrice * item.quantity;
      
      orderItems.push({
        product_id: product.id, // Or product._id depending on your DB column name
        quantity: item.quantity,
        price_at_purchase: productPrice 
      });
    }

    const amountInPaise = Math.round(calculatedTotal * 100);
    const razorpayOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    // 2. Create the PENDING order in PostgreSQL
    const newOrder = await createPendingOrder({
      user_id: userId,
      total: calculatedTotal,
      razorpay_order_id: razorpayOrder.id,
      items: items // Assuming this is [{product_id, quantity}]
    });

    // 3. Send IDs back to the React frontend
    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: newOrder.id 
    });

  } catch (error) {
    console.error('Error initiating order:', error);
    res.status(500).json({ error: 'Could not initiate payment system' });
  }
});

module.exports = router;