const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, './env') });

const razorpay = new Razorpay({
  key_id: "rzp_test_Qf5XnqEem8g6sI",       
  key_secret: "YcfnQWFFNuM7W2E4NpoWyxQB",   
});

module.exports = razorpay;
