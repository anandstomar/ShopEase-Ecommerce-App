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
  onAuthStateChanged
} from 'firebase/auth';
import { getMessaging, getToken } from 'firebase/messaging';
import api from './api';


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

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    const res = await api.post('/users/login', {
      idToken: token,
    });

    localStorage.setItem('token', token);
    console.log('User info:', res.data);
  } catch (err) {
    console.error('Google login failed:', err);
    alert(err.message);
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
  handleGoogleLogin,
  signInWithPopup
};


