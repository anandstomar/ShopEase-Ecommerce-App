import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../cartmangement/cartSlice';
import api from '../api';

const loadRazorpay = () =>
  new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function RazorpayCheckout({ amount: propAmount }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const calculatedAmount = cartItems.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );
  const amount = propAmount != null ? propAmount : calculatedAmount;

  const handlePayment = async () => {
    if (amount <= 0) {
      alert('Your cart is empty!');
      return;
    }
    const sdkReady = await loadRazorpay();
    if (!sdkReady) {
      alert('Failed to load Razorpay SDK. Check your connection.');
      return;
    }
    try {
      const { data: order } = await axios.post(
        'http://localhost:3000/api/payments/make-payment',
        { amount, currency: 'INR', receipt: `receipt_${Date.now()}` }
      );
      const options = {
        key: "rzp_test_Qf5XnqEem8g6sI",
        amount: order.amount,
        currency: order.currency,
        name: 'ShopEase',
        description: 'Order Payment',
        order_id: order.id,
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userContact') || '',
        },
        handler: async response => {
          try {
            const verifyRes = await axios.post(
              'http://localhost:3000/api/payments/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            alert(verifyRes.data.message);
            dispatch(clearCart());
            const userId = localStorage.getItem('userId')
            if (!userId) {
              alert('User ID not found. Please log in again.');
              console.error('User ID not found in localStorage');
            } 
            const {data} = await api.get(`/users/identify/${encodeURIComponent(userId)}`);
            await api.post('/orders/', {
                    user_id: data.id,
                    items: cartItems.map(({ product, quantity }) => ({
                      product_id: product._id,
                      quantity
                    })),
                    total: amount,
                    payment_id: response.razorpay_payment_id
                  })
                  alert('Payment successful & order placed!')
                } catch (err) {
                  console.error('Error in post-payment flow:', err)
                  alert('Something went wrong while placing your order.')
                }
              },
              modal: { ondismiss: () => console.log('Checkout closed') },
              theme: { color: '#3399cc' }
            }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Could not initiate payment');
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="
        px-4 py-2 
        bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
        text-white rounded-md 
        transition-colors
      "
    >
      Pay ₹{amount.toFixed(2)}
    </button>
  );
}
