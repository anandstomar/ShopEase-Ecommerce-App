import { useEffect, useState } from 'react'
import { fetchUserOrders } from '../api'
import api from '../api'

export default function Orders() {
  const [orders, setOrders] = useState([])

  const userId = localStorage.getItem('userId')
  // useEffect(() => {
  //   fetchUserOrders(userId).then(res => setOrders(res.data))
  // }, [userId])

   useEffect(() => {
      const fetchOrders = async () => {
        if (!userId) {
          console.log('No userId in localStorage');
          return;
        }
    
        try {
          if (isNaN(userId)) {
            const {data} = await api.get(`/users/identify/${encodeURIComponent(userId)}`);
            const res = await fetchUserOrders(data.id);
            setOrders(res.data);
          } else {
            const res = await fetchUserOrders(userId);
            setOrders(res.data);
          }
        } catch (err) {
          console.error('Orders fetch failed:', err);
        }
      };
    
      fetchOrders();
    }, [userId]);
  

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Your Orders
      </h3>
      {orders.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No orders yet.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map(order => (
            <li
              key={order.id}
              className="
                p-4 rounded-md 
                bg-white dark:bg-gray-800 
                shadow-sm 
                border border-gray-200 dark:border-gray-700 
                transition-colors
              "
            >
              <div className="flex justify-between">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Order #{order.id}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {order.items.length} items
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Status: {order.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
