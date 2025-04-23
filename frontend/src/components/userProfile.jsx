import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { parseISO, format } from 'date-fns';
import api from '../api'

export default function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
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
          console.log('Found user:', data);
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
          const res = await api.get(`/orders/${data.id}`);
          setOrders(res.data);
        } else {
          const res = await api.get(`/orders/${userId}`);
          setOrders(res.data);
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
