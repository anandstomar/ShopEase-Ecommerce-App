// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDUCRhKKIPyKS2Dek6uksjeNUGBQ2--IdM",
    authDomain: "e-commerce-app-3bae3.firebaseapp.com",
    databaseURL: "https://e-commerce-app-3bae3-default-rtdb.firebaseio.com",
    projectId: "e-commerce-app-3bae3",
    storageBucket: "e-commerce-app-3bae3.firebasestorage.app",
    messagingSenderId: "11253895168",
    appId: "1:11253895168:web:b80bb45a78b5fe070148e5",
    measurementId: "G-KMLM1P6X35"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
