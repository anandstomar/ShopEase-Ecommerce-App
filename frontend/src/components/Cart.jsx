import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, clearCart } from '../cartmangement/cartSlice'

export default function Cart() {
  const { items, totalQuantity } = useSelector(state => state.cart)
  const dispatch = useDispatch()

  if (items.length === 0) {
    return (
      <p className="text-gray-700 dark:text-gray-300">
        Your cart is empty.
      </p>
    )
  }

  return (
    <div className="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 transition-colors">
      <h3 className="text-xl font-semibold mb-4">
        Cart ({totalQuantity} items)
      </h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map(({ product, quantity }) => (
          <li
            key={product._id}
            className="flex justify-between py-2"
          >
            <span>
              {product.name} × {quantity}
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
      <button
        onClick={() => dispatch(clearCart())}
        className="
          mt-4 
          btn-primary 
          dark:bg-blue-600 dark:hover:bg-blue-700
        "
      >
        Clear Cart
      </button>
    </div>
  )
}
