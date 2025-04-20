import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import { auth, signInWithEmailAndPassword, provider } from '../firebase';
import api from '../api';

export default function Login() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const token  = params.get('token');
  //   if (token) {
  //     localStorage.setItem('token', token);
  //     navigate('/dashboard');
  //   }
  // }, [navigate]);

  const handleLogin = async ({ email, password }) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      alert('login successful! Please log in.');
      // if (data.token) {
      //   localStorage.setItem('token', data.token);
      // }
      localStorage.setItem('userId', data.user.id.toString());
      if (!userId) {
        alert('User ID not found. Please log in again.');
        console.error('User ID not found in localStorage');
      } 
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  // // Email/password login
  // const loginWithEmail = async ({ email, password }) => {
  //   try {
  //     // sign into Firebase to get a fresh ID token
  //     const cred = await signInWithEmailAndPassword(auth, email, password);
  //     const idToken = await cred.user.getIdToken();

  //     // send token to your new backend login endpoint
  //     const { data } = await api.post('/users/login', { idToken });
  //     localStorage.setItem('token', data.token);
  //     navigate('/dashboard');
  //   } catch (err) {
  //     console.error('Email login failed:', err);
  //     alert(err.response?.data?.error || err.message);
  //   }
  // };

  // // Google popup login
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const { data } = await api.post('/users/google', { idToken });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login failed:', err);
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          onGoogleSignIn={loginWithGoogle}
        /><hr className="border-gray-600" />
        <a
          href="http://localhost:3000/auth/google"
          className="btn w-full bg-white text-black hover:bg-gray-200"
        >
          Continue with Google
        </a>
      </div>
    </div>
  );
}
