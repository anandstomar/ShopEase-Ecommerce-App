const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay');

router.post('/make-payment', async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, 
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');


router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      "YcfnQWFFNuM7W2E4NpoWyxQB"
    );

    if (isValid) {
      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
