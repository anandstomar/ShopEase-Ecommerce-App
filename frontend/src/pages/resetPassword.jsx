import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ResetPassword() {
  const [search]      = useSearchParams();
  const token         = search.get('token');
  const emailFromUrl  = search.get('email');
  const [password, setPassword]       = useState('');
  const [confirm,  setConfirm]        = useState('');
  const [error,    setError]          = useState('');
  const navigate                          = useNavigate();

  useEffect(() => {
    if (!token || !emailFromUrl) {
      setError('Invalid or missing reset link.');
    }
  }, [token, emailFromUrl]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      await api.post('/users/reset-password', {
        email: emailFromUrl,
        token,
        newPassword: password
      });
      alert('Password reset successful!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    }
  };

  if (error) {
    return (
      <div className="p-8 max-w-md mx-auto text-red-400">
        <p>{error}</p>
        <button onClick={() => navigate('/forgot-password')} className="btn mt-4">
          Request a new link
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">New Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-700"
          />

          <label className="block mb-2">Confirm Password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-700"
          />

          <button type="submit" className="w-full btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
