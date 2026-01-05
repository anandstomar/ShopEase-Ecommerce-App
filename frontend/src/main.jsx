import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './cartmangement/store.js'
import { ThemeProvider } from './context/ThemeContext'
// import { onMessage } from 'firebase/messaging';
// import { messaging } from './firebase.js';


// onMessage(messaging, (payload) => {
//   console.log("Message received. ", payload);

//   if (!("Notification" in window)) {
//     console.error("This browser does not support desktop notifications");
//   }

//   Notification.requestPermission().then(permission => {
//     console.log("Notification permission status:", permission);
//   });
// })

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('../public/firebase-messaging-sw.js')
//       .then((registration) => {
//         console.log('Service Worker registered with scope:', registration.scope);
//       })
//       .catch((err) => {
//         console.log('Service Worker registration failed:', err);
//       });
//   });
// }
// navigator.serviceWorker.addEventListener('message', (event) => {
//   console.log('Message from SW:', event.data);
// });


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>                  
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>
)
