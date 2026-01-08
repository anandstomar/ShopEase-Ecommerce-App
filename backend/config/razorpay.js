const Razorpay = require('razorpay');
require('dotenv').config();  

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error('Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment');
}

module.exports = new Razorpay({
  key_id:     RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});


