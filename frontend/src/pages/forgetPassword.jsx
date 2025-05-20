import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent]     = useState(false);
  const navigate            = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/users/forgot-password', { email });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send reset email');
    }
  };

  if (sent) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Check your inbox</h2>
        <p>
          If an account with <strong>{email}</strong> exists, you’ll receive a
          password reset link shortly.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 btn"
        >
          Back to Log In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-700"
          />
          <button type="submit" className="w-full btn">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
