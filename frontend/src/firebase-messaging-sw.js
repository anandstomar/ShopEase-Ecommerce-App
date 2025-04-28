importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-messaging-compat.js');
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
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
const messaging = getMessaging(app);
