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
  apiKey: "AIzaSyDUCRhKKIPyKS2Dek6uksjeNUGBQ2--IdM",
  authDomain: "e-commerce-app-3bae3.firebaseapp.com",
  databaseURL: "https://e-commerce-app-3bae3-default-rtdb.firebaseio.com",
  projectId: "e-commerce-app-3bae3",
  storageBucket: "e-commerce-app-3bae3.firebasestorage.app",
  messagingSenderId: "11253895168",
  appId: "1:11253895168:web:b80bb45a78b5fe070148e5",
  measurementId: "G-KMLM1P6X35"
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
    const uid      = user.uid;
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
    const currentToken = await getToken(messaging, { vapidKey: 'BITaTIemTqctnE7VGQ3Birc8z2gS7CCEAWvgY7XDMTsCFx-6kWP5hw6u3oxanZ9aj6wZDAt64goV0l6SrNkI7xM' });
    if (currentToken) {
      console.log('FCM Registration Token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
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


