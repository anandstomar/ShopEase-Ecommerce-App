import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { parseISO, format } from 'date-fns';
import api from '../api'

export default function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.error('No userId in localStorage');
      return;
    }
    api.get(`/users/profile/${userId}`)
      .then(res => setProfile(res.data))
      .catch(err => {
        console.error('Profile fetch failed:', err);
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) return console.error('no userId stored');
    api.get(`/orders/${userId}`)
      .then(({ data }) => setOrders(data))
      .catch(console.error);
  }, [userId]);

  function formatOrderDate(timestamp) {
    const trimmed = timestamp.replace(/\.(\d{3})\d+/, '.$1');
    const iso = trimmed.replace(' ', 'T');
    const dt = parseISO(iso);
    return format(dt, 'dd/MM/yyyy');
  }


  // useEffect(() => {
  //   api
  //   .get('/orders/${userId}')
  //   .then(res => {
  //       const data = res.data
  //       const list = Array.isArray(data)
  //         ? data
  //         : Array.isArray(data.orders)
  //         ? data.orders
  //         : []
  //       setOrders(list)
  //     })
  //     .catch(err => console.error('Orders fetch failed:', err))
  // }, [])

  if (!profile) {
    return <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 transition-colors">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No previous orders.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <li key={order.id} className="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 transition-colors">
                <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
                <p key={order.id}>
                <strong>Date:</strong>{' '}
                {order.created_at
                ? formatOrderDate(order.created_at)
                : 'Unknown'}
                </p>
                <p><strong>Total:</strong> ${order.total}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
