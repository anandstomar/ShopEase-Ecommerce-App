// src/pages/DriverTracker.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function DriverTracker() {
  // Read driverId once from localStorage
  const driverId = localStorage.getItem('driverId');
  const [position, setPosition] = useState({ lat: null, lng: null });
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!driverId) {
      setError('No driverId in localStorage');
      return;
    }

    // Single-shot location fetch
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        console.log('Got coords:', lat, lng);
        setPosition({ lat, lng });

        try {
          // POST to your backend
          await api.post(`/drivers/location/${driverId}`, { lat, lng });
          console.log('Location saved successfully');
        } catch (err) {
          console.error('Failed to save location:', err);
          setError('Network error: ' + err.message);
        }
      },
      err => {
        console.error('Geolocation error:', err);
        setError('Geolocation error: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [driverId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Driver Tracker</h1>
      {error && <p className="text-red-600">Error: {error}</p>}
      {position.lat != null ? (
        <div>
          <p><strong>Latitude:</strong> {position.lat.toFixed(6)}</p>
          <p><strong>Longitude:</strong> {position.lng.toFixed(6)}</p>
        </div>
      ) : (
        <p>Obtaining location…</p>
      )}
    </div>
  );
}
