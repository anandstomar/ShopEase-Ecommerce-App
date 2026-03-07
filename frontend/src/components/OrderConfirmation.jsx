import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api'; 

export default function OrderConfirmation() {
  const { orderId } = useParams(); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchOrderStatus = async () => {
      try {
        const { data } = await api.get(`/orders/detail/${orderId}`);
        
        if (data.success && data.order) {
          setOrder(data.order); 
        }
        setLoading(false);

        if (data?.order?.status === 'PAID' || data?.order?.status === 'FAILED') {
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Could not fetch order details.');
        setLoading(false);
        clearInterval(intervalId);
      }
    };

    fetchOrderStatus();
    intervalId = setInterval(fetchOrderStatus, 3000);

    return () => clearInterval(intervalId);
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400 text-lg animate-pulse">Verifying your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 dark:text-red-400">
        <p>{error}</p>
        <Link to="/" className="text-blue-500 dark:text-blue-400 underline mt-4 inline-block">Return to Home</Link>
      </div>
    );
  }

  const isPaid = order?.status === 'PAID';

  return (
    // Added dark mode backgrounds, borders, and smooth transitions
    <div className="w-full max-w-2xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
      
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-gray-100">
        {isPaid ? 'Payment Successful!' : 'Processing Order...'}
      </h1>

      {/* Dynamic UI based on the webhook status */}
      {isPaid ? (
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Thank you for your purchase!</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Your order has been confirmed.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 border-4 border-yellow-500 dark:border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">We are waiting for final confirmation.</p>
          <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">This usually takes a few seconds. Please do not close this page.</p>
        </div>
      )}

      {/* Details block adapted for dark mode */}
      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Order ID</span>
          <span className="text-gray-900 dark:text-gray-100 font-semibold">{order?.id || orderId}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Status</span>
          <span 
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${isPaid 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300'}`}
          >
            {order?.status || 'PENDING'}
          </span>
        </div>

        {order?.total && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
            <span className="text-gray-800 dark:text-gray-200 font-bold">Total Amount</span>
            <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">₹{Number(order.total).toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link 
          to="/dashboard/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors w-full sm:w-auto"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}