// routes/payments.js
const express = require('express');
const router  = express.Router();
const razorpay = require('../config/razorpay');
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');
require('dotenv').config(); 

// Create a new Razorpay Order
router.post('/make-payment', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid or missing amount' });
  }

  try {
    const options = {
      amount:          Math.round(amount * 100),
      currency,
      receipt:         receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    };
    console.log('💳 Creating Razorpay order with options:', options);

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order);
    res.status(200).json(order);
  } catch (err) {
    console.error('❌ /make-payment error:', err);
    res.status(500).json({
      error:       err.message,
      ...(err.code        && { code: err.code }),
      ...(err.description && { description: err.description }),
    });
  }
});

// Verify a completed payment signature
router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const { RAZORPAY_KEY_SECRET } = process.env;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required verification fields' });
  }

  try {
    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      RAZORPAY_KEY_SECRET
    );

    if (isValid) {
      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    console.error('❌ /verify-payment error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
