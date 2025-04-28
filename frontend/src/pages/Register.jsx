import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { auth, createUserWithEmailAndPassword, provider } from '../firebase';
import api from '../api';

export default function Register() {
  const navigate = useNavigate();

  const registerWithEmail = async ({ name, email, password }) => {
    try {

      console.log('Registering user:', { name, email, password });
      await api.post('/users/register', { name, email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
      // const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // const firebaseUid = userCred.user.uid;

      // const { data } = await api.post('/users/register', {
      //   name,
      //   email,
      //   password,
      //   firebaseUid
      // });

      // localStorage.setItem('token', data.token);
      // navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      alert(`Registration failed: ${msg}`);
      console.error('Register API error:', err.response?.data, err);
    }
  };

  // // Popup‑based Google sign‑in
  // const loginWithGoogle = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const idToken = await result.user.getIdToken();

  //     // Hit your new “google” endpoint
  //     const { data } = await api.post('/users/google', { idToken });
  //     localStorage.setItem('token', data.token);
  //     navigate('/dashboard');
  //   } catch (err) {
  //     console.error('Google registration/login failed:', err);
  //     alert(err.response?.data?.error || err.message);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <AuthForm
          type="register"
          onSubmit={registerWithEmail}
        /><hr className="border-gray-600" />
        <a
          href="https://shopeaseecommerce.store/auth/google"
          className="btn w-full bg-white text-black hover:bg-gray-200"
        >
          Continue with Google
        </a>
      </div>
    </div>
  );
}
