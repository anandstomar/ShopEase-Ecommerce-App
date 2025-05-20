import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../cartmangement/cartSlice';
import RazorpayCheckout from './RazorpayCheckout';

export default function CartWithCheckout() {
  const dispatch = useDispatch();
  const { items, totalQuantity } = useSelector(state => state.cart);

  // Compute total price for Razorpay
  const totalAmount = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 transition-colors mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Cart ({totalQuantity} item{totalQuantity > 1 ? 's' : ''})
        </h3>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map(({ product, quantity }) => (
            <li
              key={product._id}
              className="flex justify-between items-center py-2"
            >
              <span>
                {product.name} × {quantity} — ₹{(product.price * quantity).toFixed(2)}
              </span>
              <button
                onClick={() => dispatch(removeFromCart(product._id))}
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between items-center">
          <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
          <button
            onClick={() => dispatch(clearCart())}
            className="
              btn-primary 
              dark:bg-blue-600 dark:hover:bg-blue-700
            "
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
