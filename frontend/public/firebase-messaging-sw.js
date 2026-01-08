// public/firebase-messaging-sw.js

// 1️⃣ Load the compat versions via importScripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

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
 firebase.initializeApp(firebaseConfig);

// 3️⃣ Obtain the messaging instance from the global
const messaging = firebase.messaging();

// 4️⃣ Handle background messages
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle   = payload.notification?.title   || 'Background Message';
  const notificationOptions = {
    body:    payload.notification?.body    || '',
    icon:    payload.notification?.icon    || '/default-icon.png',
    data:    payload.data                  || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  // Optionally relay to open pages
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    .then(clients => {
      clients.forEach(c => c.postMessage(payload));
    });
});







// // public/firebase-messaging-sw.js
// importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// firebase.initializeApp({
//     apiKey: "AIzaSyDUCRhKKIPyKS2Dek6uksjeNUGBQ2--IdM",
//     authDomain: "e-commerce-app-3bae3.firebaseapp.com",
//     databaseURL: "https://e-commerce-app-3bae3-default-rtdb.firebaseio.com",
//     projectId: "e-commerce-app-3bae3",
//     storageBucket: "e-commerce-app-3bae3.firebasestorage.app",
//     messagingSenderId: "11253895168",
//     appId: "1:11253895168:web:b80bb45a78b5fe070148e5",
//     measurementId: "G-KMLM1P6X35"
// });

// importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-messaging-compat.js');
// // import { initializeApp } from 'firebase/app';
// // import { getMessaging } from 'firebase/messaging';
// const firebaseConfig = {
//     apiKey: "AIzaSyDUCRhKKIPyKS2Dek6uksjeNUGBQ2--IdM",
//     authDomain: "e-commerce-app-3bae3.firebaseapp.com",
//     databaseURL: "https://e-commerce-app-3bae3-default-rtdb.firebaseio.com",
//     projectId: "e-commerce-app-3bae3",
//     storageBucket: "e-commerce-app-3bae3.firebasestorage.app",
//     messagingSenderId: "11253895168",
//     appId: "1:11253895168:web:b80bb45a78b5fe070148e5",
//     measurementId: "G-KMLM1P6X35"
//   };

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);



// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
