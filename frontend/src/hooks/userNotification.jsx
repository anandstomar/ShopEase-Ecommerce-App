import { useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';// Assuming your axios instance or fetch wrapper
import { auth, messaging } from '../firebase'; // Assuming you have firebase.js exporting auth and messaging
import { onMessage, getToken } from 'firebase/messaging';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

export default function useNotifications() {

  /**
   * Handles the process of requesting notification permission,
   * getting the FCM token, and sending it to the backend.
   * This function should only be called when a user's ID token is available.
   * @param {string} idToken The Firebase ID token of the authenticated user.
   */
  const registerFcmToken = async (idToken) => {
    if (Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        console.warn('Notification permission not granted');
        return;
      }
    }

    try {
      // Get the FCM token
      const fcmToken = await getToken(messaging, {
        // IMPORTANT: Ensure this VAPID key matches your Firebase project's web configuration
        vapidKey: 'BJcb6KxGdV62XZA15lSo56aQYy2mixYR325Hvzo1X-kGeyUSQdpzSkZwNzpKmUwAXFanuQTnQbGQ2BiDLk-jfcQ'
      });
      console.log('FCM token:', fcmToken);

      if (fcmToken) {
        const user = auth.currentUser; // Get current user
        if (user) {
          const actualIdToken = await user.getIdToken(true); // Add true to force refresh
          console.log('Sending FCM token with ID token:', actualIdToken); // <--- ADD THIS LINE
          await axios.post(
            'https://shopease-ecommerce-app-jv4u.onrender.com/api/notifications/devices',
            { token: fcmToken },
            { headers: { Authorization: `Bearer ${actualIdToken}` } }
          );
          console.log('Device registered for push notifications successfully!');
        } else {
          console.warn('User not authenticated, cannot send FCM token to backend.');
        }
      } else {
        console.warn('No FCM token obtained.');
      }
    } catch (err) {
      console.error('FCM registration error:', err);
      // You might want to show a toast or message to the user here
      toast.error('Failed to register for push notifications.');
    }
  };

  // Effect to handle Firebase authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, get their ID token
        try {
          const idToken = await user.getIdToken();
          console.log('User authenticated, attempting FCM token registration...');
         // console.log(idToken)
          await registerFcmToken(idToken); // Call the registration function
        } catch (error) {
          console.error('Error getting ID token or registering FCM:', error);
        }
      } else {
        // User is signed out. You might want to clear any stored tokens on the frontend
        // and potentially notify the backend to invalidate tokens for this user.
        console.log('User signed out. FCM token registration skipped.');
      }
    });

    // Clean up the auth listener when the component unmounts
    return () => unsubscribeAuth();
  }, []); // Empty dependency array means this effect runs once on mount

  // Effect to handle incoming foreground messages
  useEffect(() => {
    const unsubscribeOnMessage = onMessage(messaging, payload => {
      console.log('🔔 FCM foreground payload:', payload);

      const title = payload.notification?.title || 'Notification';
      const body = payload.notification?.body || '';
      // Provide a fallback icon if payload.notification.icon is not a valid URL or empty
      const icon = payload.notification?.icon?.trim() ? payload.notification.icon : '/default-icon.png';

      // Native browser notification (optional, as toast is also used)
      if (Notification.permission === 'granted') {
        const nativeNotif = new Notification(title, { body, icon });
        nativeNotif.onclick = () => window.focus(); // Bring browser to front on click
      }

      // In-app toast notification
      toast.info(
        <div>
          <strong>{title}</strong>
          <div>{body}</div>
        </div>
      );
    });

    // Clean up the message listener when the component unmounts
    return () => unsubscribeOnMessage();
  }, []); // Empty dependency array means this effect runs once on mount
}









// // src/hooks/useNotifications.js
// import { useEffect } from 'react';
// import { toast }      from 'react-toastify';
// import api            from '../api';
// import { auth, messaging } from '../firebase';
// import { onMessage, getToken } from 'firebase/messaging';

// export default function useNotifications() {
//   useEffect(() => {
//     // 1️⃣ Register device & send FCM token to backend
//     (async () => {
//       if (Notification.permission !== 'granted') {
//         const perm = await Notification.requestPermission();
//         if (perm !== 'granted') {
//           console.warn('Notification permission not granted');
//           return;
//         }
//       }

//       try {
//         const fcmToken = await getToken(messaging, {
//           vapidKey: 'BITaTIemTqctnE7VGQ3Birc8z2gS7CCEAWvgY7XDMTsCFx-6kWP5hw6u3oxanZ9aj6wZDAt64goV0l6SrNkI7xM'
//         });
//         console.log('FCM token:', fcmToken);

//         const user = auth.currentUser;
//         if (user) {
//           const idToken = await user.getIdToken();
//           await api.post(
//             '/notifications/devices',
//             { token: fcmToken },
//             { headers: { Authorization: `Bearer ${idToken}` } }
//           );
//           console.log('Device registered for push');
//         }
//       } catch (err) {
//         console.error('FCM registration error:', err);
//       }
//     })();

//     // 2️⃣ Handle incoming foreground messages
//     const unsubscribe = onMessage(messaging, payload => {
//       console.log('🔔 FCM foreground payload:', payload);

//       const title = payload.notification?.title  || 'Notification';
//       const body  = payload.notification?.body   || '';
//       const icon = payload.notification?.icon?.trim() ? payload.notification.icon : '/default-icon.png';

//       // Native browser notification
//       if (Notification.permission === 'granted') {
//         const nativeNotif = new Notification(title, { body, icon });
//         nativeNotif.onclick = () => window.focus();
//       }

//       // In‑app toast
//       toast.info(
//         <div>
//           <strong>{title}</strong>
//           <div>{body}</div>
//         </div>
//       );
//     });

//     return () => unsubscribe();
//   }, []);
// }












// // src/hooks/useNotifications.js
// import { useEffect } from 'react';
// import { messaging } from '../firebase';
// import { toast } from 'react-toastify';
// import { auth } from '../firebase';
// import api from '../api';
// import { onMessage, getToken } from 'firebase/messaging'; 

// export default function useNotifications() {
//   useEffect(() => {
//     // 1️⃣ Request permission & register device
//     async function registerDevice() {
//       try {
//         const permission = await Notification.requestPermission();
//         if (permission !== 'granted') {
//           console.warn('Notification permission not granted');
//           return;
//         }

//         // Get FCM token
//         const fcmToken = await getToken(messaging, {
//           vapidKey: 'BITaTIemTqctnE7VGQ3Birc8z2gS7CCEAWvgY7XDMTsCFx-6kWP5hw6u3oxanZ9aj6wZDAt64goV0l6SrNkI7xM'
//         });
//         console.log('✅ FCM device token:', fcmToken);

//         // Send token to your server
//         const user = auth.currentUser;
//         if (!user) {
//           console.error('No Firebase user signed in');
//           return;
//         }

//         const idToken = await user.getIdToken();
//         await api.post(
//           '/notifications/devices',
//           { token: fcmToken },
//           { headers: { Authorization: `Bearer ${idToken}` } }
//         );
//         console.log('📲 Device registered for push notifications');
//       } catch (err) {
//         console.error('🔴 FCM registration error:', err);
//       }
//     }
//     registerDevice();

//     onMessage(messaging, (payload) => {
//       console.log("Message received. ", payload);

//       if (!("Notification" in window)) {
//         console.error("This browser does not support desktop notifications");
//       }

//       Notification.requestPermission().then(permission => {
//         console.log("Notification permission status:", permission);
//       });
//     });


//     // 2️⃣ Subscribe to foreground messages
//     const unsubscribe = onMessage(messaging, payload => {
//       console.log('🔔 Foreground message received:', payload);

//       // Extract
//       const title = payload.notification?.title  || 'Notification';
//       const body  = payload.notification?.body   || '';
//       const icon  = payload.notification?.image  || '/default-icon.png';

//       // Native browser notification
//       if (Notification.permission === 'granted') {
//         const nativeNotif = new Notification(title, { body, icon });
//         nativeNotif.onclick = () => window.focus();
//       }

//       // Beautiful in-app toast
//       toast.info(
//         <div>
//           <strong>{title}</strong>
//           <div>{body}</div>
//         </div>,
//         {
//           position: 'top-right',
//           autoClose: 8000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: 'colored',
//         }
//       );
//     });

//     // Cleanup on unmount
//     return () => unsubscribe();
//   }, []);
// }







//     export default function useNotifications() {
//         useEffect(() => {
//           Notification.requestPermission().then(async permission => {
//             if (permission !== 'granted') {
//               console.warn('Notification permission not granted')
//               return
//             }

//             let fcmToken
//             try {
//               fcmToken = await getToken(messaging, {
//                 vapidKey: 'BITaTIemTqctnE7VGQ3Birc8z2gS7CCEAWvgY7XDMTsCFx-6kWP5hw6u3oxanZ9aj6wZDAt64goV0l6SrNkI7xM',
//               })
//             } catch (err) {
//               console.error('FCM getToken error:', err)
//               return
//             }
//             console.log('FCM device token:', fcmToken)
      
//             // 2️⃣ Get Firebase ID token of the signed‑in user
//             const user = auth.currentUser
//             if (!user) {
//               console.error('No Firebase user signed in')
//               return
//             }
//             let idToken
//             try {
//               idToken = await user.getIdToken()
//             } catch (err) {
//               console.error('Failed to fetch Firebase ID token:', err)
//               return
//             }
      
//             // 3️⃣ Register the device on your server
//             try {
//               await api.post(
//                 '/notifications/devices',
//                 { token: fcmToken },
//                 { headers: { Authorization: `Bearer ${idToken}` } }
//               )
//               console.log('Device registered for push notifications')
//             } catch (err) {
//               console.error('registerDevice error:', err)
//             }
//           })


//     // 4) In‑app (foreground) messages
//     const unsubscribe = onMessage(messaging, payload => {
//       console.log('Foreground message received:', payload);
//       const { title, body } = payload.notification;
//       new Notification(title, { body });
//     });

//     return () => unsubscribe();
//   }, []);
// }

