import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import { signInWithPopup } from '../firebase';
import { auth, signInWithEmailAndPassword, provider } from '../firebase';
import api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const { search } = useLocation();

  // useEffect(() => {
  //   const params   = new URLSearchParams(search);
  //   const token    = params.get('token');
  //   const googleId = params.get('googleId');
  //   // localStorage.clear()

  //   if (token) {
  //     localStorage.setItem('token', token);
  //     api.defaults.headers.common.Authorization = `Bearer ${token}`;
  //   }
  //   if (googleId) {
  //     localStorage.setItem('userId', googleId);
  //   }


  //   if (token && googleId) {
  //     navigate('/dashboard', { replace: true });
  //     console.log(googleId)
  //     console.log(token)
  //   }
  // }, [search, navigate]);

  const handleLogin = async  ({ email, password })=> {
    try {
      const { data } = await api.post('/users/login', {
        email,
        password
      })
      const { token, user } = data
      
      localStorage.setItem('token', token)
      localStorage.setItem('userId', String(user.id))

      api.defaults.headers.common.Authorization = `Bearer ${token}`

      alert('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
      alert(err.response?.data?.error || 'Login failed')
    }
  }

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const token  = params.get('token');
  //   if (token) {
  //     localStorage.setItem('token', token);
  //     navigate('/dashboard');
  //   }
  // }, [navigate]);

  // const handleLogin = async ({ email, password }) => {
  //   try {
  //     const { data } = await api.post('/users/login', { email, password });
  //     const user = auth.currentUser
  //     const idToken = await user.getIdToken();
  //     localStorage.setItem('userId', data.user.id.toString());
  //     if (!userId) {
  //       alert('User ID not found. Please log in again.');
  //       console.error('User ID not found in localStorage');
  //     } 
  //     alert('login successful!');
  //     navigate('/dashboard');
  //   } catch (err) {
  //     alert(err.response?.data?.error || 'Login failed');
  //   }
  // };

  // Email/password login
  // const loginWithEmail = async ({ email, password }) => {
  //   try {
  //     const userCred = await signInWithEmailAndPassword(auth, email, password);
  //     const { user } = userCred;           
  //     const idtoken = await user.getIdToken(); 
  //     const uid   = user.uid;  
      
  //     localStorage.setItem("userId", uid);
  //     localStorage.setItem("token", token);

  //     // send token to your new backend login endpoint
  //     const { data } = await api.post('/users/login', { idToken });
  //     //localStorage.setItem('token', data.token);
  //     navigate('/dashboard');
  //   } catch (err) {
  //     console.error('Email login failed:', err);
  //     alert(err.response?.data?.error || err.message);
  //   }
  // };

  // // Google popup login
  // const loginWithGoogle = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     console.log('Google login result:', result);
  //     const { user } = result; 
  //     const idToken = await user.getIdToken();
  //     const uid      = user.uid;
  //     const { data } = await api.post('/users/firebase', { idToken });
  //     localStorage.setItem('token', data.token);
  //     localStorage.setItem("userId", uid);
  //     navigate('/dashboard');
  //   } catch (err) {
  //     console.error('Google login failed:', err);
  //     alert(err.response?.data?.error || err.message);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <AuthForm
          type="login"
          onSubmit={handleLogin }
        /><hr className="border-gray-600" />
        <a
          href="https://shopease-ecommerce-app-jv4u.onrender.com/auth/google"
          className="btn w-full bg-white text-black hover:bg-gray-200"
        >
          Continue with Google
        </a>
      </div>
    </div>
  );
}
