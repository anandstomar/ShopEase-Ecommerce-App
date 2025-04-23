// src/hooks/useNotifications.js
import { useEffect } from 'react';
import { messaging, getToken, onMessage } from '../firebase';
import api from '../api';
import { auth } from '../firebase' 

// export default function useNotifications() {
//   useEffect(() => {
//     Notification.requestPermission().then(permission => {
//       if (permission !== 'granted') return console.warn('Notification permission not granted');
//       getToken(messaging, { vapidKey:  })
//         .then(token => {
//           console.log('FCM device token:', token);
//           return api.post('/notifications/devices', { token });
//         })
//         .catch(err => console.error('FCM getToken error:', err));
//     });
    export default function useNotifications() {
        useEffect(() => {
          Notification.requestPermission().then(async permission => {
            if (permission !== 'granted') {
              console.warn('Notification permission not granted')
              return
            }

            let fcmToken
            try {
              fcmToken = await getToken(messaging, {
                vapidKey: 'BITaTIemTqctnE7VGQ3Birc8z2gS7CCEAWvgY7XDMTsCFx-6kWP5hw6u3oxanZ9aj6wZDAt64goV0l6SrNkI7xM',
              })
            } catch (err) {
              console.error('FCM getToken error:', err)
              return
            }
            console.log('FCM device token:', fcmToken)
      
            // 2️⃣ Get Firebase ID token of the signed‑in user
            const user = auth.currentUser
            if (!user) {
              console.error('No Firebase user signed in')
              return
            }
            let idToken
            try {
              idToken = await user.getIdToken()
            } catch (err) {
              console.error('Failed to fetch Firebase ID token:', err)
              return
            }
      
            // 3️⃣ Register the device on your server
            try {
              await api.post(
                '/notifications/devices',
                { token: fcmToken },
                { headers: { Authorization: `Bearer ${idToken}` } }
              )
              console.log('Device registered for push notifications')
            } catch (err) {
              console.error('registerDevice error:', err)
            }
          })


    // 4) In‑app (foreground) messages
    const unsubscribe = onMessage(messaging, payload => {
      console.log('Foreground message received:', payload);
      const { title, body } = payload.notification;
      new Notification(title, { body });
    });

    return () => unsubscribe();
  }, []);
}




// import { useEffect } from 'react'
// import { messaging } from '../firebase'
// import { getToken, onMessage } from 'firebase/messaging'
// import api from '../api'

// export default function usePushNotifications() {
//   useEffect(() => {
//     async function registerToken() {
//       try {
//         const permission = await Notification.requestPermission()
//         if (permission !== 'granted') return console.warn('Push permission denied')

//         const fcmToken = await getToken(messaging, {
//           vapidKey: 'YOUR_PUBLIC_VAPID_KEY'
//         })
//         if (fcmToken) {
//           // send to your backend so it can save { user_id, device_token }
//           await api.post('/users/devices', { token: fcmToken })
//         }
//       } catch (err) {
//         console.error('FCM registration failed:', err)
//       }
//     }
//     registerToken()
//     const unsubscribe = onMessage(messaging, payload => {
//       const { title, body } = payload.notification || {}
//       alert(`🔔 ${title}\n${body}`)
//     })

//     return () => unsubscribe()
//   }, [])
// }
