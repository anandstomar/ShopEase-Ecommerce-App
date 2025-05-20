import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { parseISO, format } from 'date-fns';
import api from '../api'
import { fetchUserOrders } from '../api'

export default function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId');


  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        console.log('No userId in localStorage');
        return;
      }
  
      try {
        if (isNaN(userId)) {
          const {data} = await api.get(`/users/identify/${encodeURIComponent(userId)}`);
          const res = await api.get(`/users/profile/${data.id}`);
          setProfile(res.data);
        }
         if((userId.length) > 10){
          const {data} = await api.get(`/users/identify/${encodeURIComponent(userId)}`);
          const res = await api.get(`/users/profile/${data.id}`);
          setProfile(res.data);
        } else {
          const res = await api.get(`/users/profile/${userId}`);
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Profile fetch failed:', err);
      }
    };
  
    fetchProfile();
  }, [userId]);

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
          setOrders(res.data.orders);        }
          if((userId.length) > 10){
            const {data} = await api.get(`/users/identify/${encodeURIComponent(userId)}`);
            const res = await fetchUserOrders(data.id);
            setOrders(res.data.orders);
         } else {
          const res = await fetchUserOrders(userId);
          console.log(res.data.orders)
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Orders fetch failed:', err);
      }
    };
  
    fetchOrders();
  }, [userId]);

  function formatOrderDate(timestamp) {
    const trimmed = timestamp.replace(/\.(\d{3})\d+/, '.$1');
    const iso = trimmed.replace(' ', 'T');
    const dt = parseISO(iso);
    return format(dt, 'dd/MM/yyyy');
  }


  if (!profile) {
    return <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
    {/* Profile Card */}
    <div className="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 transition-colors">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
    </div>

    {/* Order History */}
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Order History</h2>

      {orders.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No previous orders.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li
              key={order.id}
              className="rounded-lg border shadow-sm p-4 bg-white dark:bg-gray-800 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                {/* Order details */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Date:</strong>{' '}
                    {order.created_at
                      ? formatOrderDate(order.created_at)
                      : 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Total:</strong> ${order.total}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Status:</strong>{' '}
                    <span
                      className={`font-medium ${
                        order.status === 'paid'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>

                {/* Track Order Button - Desktop view */}
                <div className="hidden sm:block ml-auto">
                  <button
                     onClick={() => navigate(`/dashboard/track/${order.id}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Track Order
                  </button>
                </div>

                {/* Track Order Button - Mobile view */}
                <div className="w-full sm:hidden mt-4">
                  <button
                     onClick={() => navigate(`/dashboard/track/${order.id}`)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>    
  )
}
