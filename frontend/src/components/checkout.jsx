import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../cartmangement/cartSlice';
import { Link } from 'react-router-dom'; // Imported Link for the empty state CTA
import RazorpayCheckout from './RazorpayCheckout';

export default function CartWithCheckout() {
  const dispatch = useDispatch();
  const { items, totalQuantity } = useSelector(state => state.cart);

  // Compute total price for Razorpay
  const totalAmount = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  // Enhanced Empty Cart UI
  if (items.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center transition-colors">
        <div className="flex justify-center mb-6">
          {/* Shopping Cart SVG Icon */}
          <svg 
            className="w-24 h-24 text-gray-300 dark:text-gray-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link 
          to="/dashboard/products" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // Populated Cart UI
  return (
    <div className="max-w-2xl mx-auto p-4 mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-6 transition-colors mb-6">
        <h3 className="text-xl font-bold mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
          Cart ({totalQuantity} item{totalQuantity > 1 ? 's' : ''})
        </h3>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {items.map(({ product, quantity }) => (
            <li
              key={product._id}
              className="flex justify-between items-center py-4"
            >
              <span className="font-medium">
                {product.name} <span className="text-gray-500 dark:text-gray-400 font-normal">× {quantity}</span> 
                <span className="ml-2 font-semibold">— ₹{(product.price * quantity).toFixed(2)}</span>
              </span>
              <button
                onClick={() => dispatch(removeFromCart(product._id))}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium hover:underline transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <strong className="text-xl">Total: ₹{totalAmount.toFixed(2)}</strong>
          <button
            onClick={() => dispatch(clearCart())}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Razorpay Checkout Button */}
      <div className="text-center">
        <RazorpayCheckout amount={totalAmount} />
      </div>
    </div>
  );
}