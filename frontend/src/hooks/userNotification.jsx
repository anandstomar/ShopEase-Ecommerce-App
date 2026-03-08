import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { auth, messaging } from '../firebase';
import { onMessage, getToken } from 'firebase/messaging';
import { onAuthStateChanged } from 'firebase/auth';

export default function useNotifications() {
  const [permissionState, setPermissionState] = useState(Notification.permission);

  // 1. Actively watch the browser's native settings for changes
  useEffect(() => {
    if (!navigator.permissions) return;

    navigator.permissions.query({ name: 'notifications' }).then((status) => {
      // Update our state whenever the user flips the switch in the URL bar
      status.onchange = () => {
        setPermissionState(status.state);
        if (status.state === 'granted') {
          // If they just allowed it, immediately grab the token!
          const user = auth.currentUser;
          if (user) syncFcmToken(user);
        }
      };
    });
  }, []);

  const triggerNativePrompt = async () => {
    // This pops the native browser drop-down (if it's in the "default" state)
    const currentPermission = await Notification.requestPermission();
    setPermissionState(currentPermission);
    
    if (currentPermission === 'granted') {
       const user = auth.currentUser;
       if (user) await syncFcmToken(user);
    }
  };

  const syncFcmToken = async (user) => {
    try {
      const fcmToken = await getToken(messaging, {
        vapidKey: "BPdU9oYz7igbT8H8QvmZek9IS1XhkZhsNSwoD17pIWc1OpgawB6a4s6z1wQYQgo5Yj3pjTLwK5jwzVLcWq0HhRs"
      });

      if (!fcmToken) {
         console.error(" Token is NULL. This usually means VAPID key mismatch or SSL issue.");
      } else {
        console.log(" SUCCESS! FCM Token:", fcmToken);
      }

      if (fcmToken) {
        const idToken = await user.getIdToken(true);
        //console.log('Sending FCM token with ID token:', idToken);
        await axios.post(
          "https://shopease-ecommerce-app-jv4u.onrender.com/api/notifications/devices",
          //'http://localhost:3007/api/notifications/devices',
          { token: fcmToken },
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        console.log('Device registered securely!');
      }
    } catch (err) {
      console.error('FCM registration error:', err);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user && Notification.permission === 'granted') {
        console.log("User detected and permission already granted. Fetching FCM token...");
        await syncFcmToken(user);
      }
    });

    return () => unsubscribeAuth();
  }, []);


  useEffect(() => {
    const unsubscribeOnMessage = onMessage(messaging, payload => {
      const title = payload.notification?.title || 'Notification';
      const body = payload.notification?.body || '';
      const icon = payload.notification?.icon?.trim() ? payload.notification.icon : '/default-icon.png';

      if (Notification.permission === 'granted') {
        const nativeNotif = new Notification(title, { body, icon });
        nativeNotif.onclick = () => window.focus();
      }

      toast.info(
        <div>
          <strong>{title}</strong>
          <div>{body}</div>
        </div>
      );
    });

    return () => unsubscribeOnMessage();
  }, []);

  // Expose the denied state so your UI can react to it
  return { permissionState, triggerNativePrompt };
}
