import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DriverLogin() {
  const [driverId, setDriverId] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!driverId) {
      alert('Enter driver ID');
      return;
    }
    // Save it in localStorage
    localStorage.setItem('driverId', driverId);
    navigate('/dashboard/driver'); // go to tracking page
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Driver Login</h2>
      <input
        type="text"
        value={driverId}
        onChange={e => setDriverId(e.target.value)}
        placeholder="Enter Driver ID"
        className="border p-2 mb-2 w-full"
      />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
        Start Tracking
      </button>
    </div>
  );
}
