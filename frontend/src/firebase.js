// src/firebase.js
import { initializeApp } from 'firebase/app';
import {
  signInWithPopup,
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import api from './api';
import { useNavigate } from 'react-router-dom';


const firebaseConfig = {
  // apiKey: "AIzaSyDUCRhKKIPyKS2Dek6uksjeNUGBQ2--IdM",
  // authDomain: "e-commerce-app-3bae3.firebaseapp.com",
  // databaseURL: "https://e-commerce-app-3bae3-default-rtdb.firebaseio.com",
  // projectId: "e-commerce-app-3bae3",
  // storageBucket: "e-commerce-app-3bae3.firebasestorage.app",
  // messagingSenderId: "11253895168",
  // appId: "1:11253895168:web:b80bb45a78b5fe070148e5",
  // measurementId: "G-KMLM1P6X35"
  apiKey: "AIzaSyAR7IQQevKp-YKUgqfmOTLDYINMuQ1rkEo",
  authDomain: "ecommerce-notification-2.firebaseapp.com",
  projectId: "ecommerce-notification-2",
  storageBucket: "ecommerce-notification-2.firebasestorage.app",
  messagingSenderId: "860927112440",
  appId: "1:860927112440:web:36bddce526597a4331b70d",
  measurementId: "G-LQ3GJP2L9Y"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in, UID:", user.uid);
  } else {
    console.log("No user signed in");
  }
});
const messaging = getMessaging(app);

setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });
const provider = new GoogleAuthProvider();

const signInWithGoogleRedirect = async () => {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('Error during redirect sign-in:', error);
  }
};


const loginWithGoogle = async (navigate) => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Google login result:', result);
    const { user } = result;
    const idToken = await user.getIdToken();
    const uid = user.uid;
    const { data } = await api.post('/users/firebase', { idToken });
    localStorage.setItem('token', data.token);
    localStorage.setItem("userId", uid);
    navigate('/dashboard');
  } catch (err) {
    console.error('Google login failed:', err);
    alert(err.response?.data?.error || err.message);
  }
};

const retrieveFCMToken = async () => {
  try {
    console.log("1. Requesting permission...");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("Permission denied");
      return;
    }

    console.log("2. Fetching FCM Token...");
    const currentToken = await getToken(messaging, {
      vapidKey: "BPdU9oYz7igbT8H8QvmZek9IS1XhkZhsNSwoD17pIWc1OpgawB6a4s6z1wQYQgo5Yj3pjTLwK5jwzVLcWq0HhRs"
    });

    if (!currentToken) {
      console.error("3. Token is NULL. This usually means VAPID key mismatch or SSL issue.");
    } else {
      console.log("3. SUCCESS! FCM Token:", currentToken);
    }
    return currentToken;
  } catch (error) {
    console.error("ERROR in getToken:", error);
  }
};

export {
  auth,
  provider,
  signInWithRedirect,
  signInWithGoogleRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  retrieveFCMToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  // handleGoogleLogin,
  signInWithPopup,
  messaging,
  getToken,
  onMessage,
  loginWithGoogle
};


