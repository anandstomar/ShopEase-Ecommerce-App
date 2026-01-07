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




// const Razorpay = require('razorpay');
// const dotenv = require('dotenv');
// const path = require('path');
// dotenv.config({ path: path.resolve(__dirname, './env') });

// const razorpay = new Razorpay({
//   key_id: "rzp_test_dG63Hlb6Oktepu",       
//   key_secret: "WIIVOdv1SM2VyOw4DM3Q7ZxI",   
// });

// module.exports = razorpay;
