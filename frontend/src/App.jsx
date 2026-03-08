// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Added useState
import DashboardLayout from './pages/DashboardLayout';
import ProductsPage from './pages/ProductPage';
import OrdersPage from './pages/OrderPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import TrackOrderPage from './pages/TrackOrder';
import DriverTracker from './pages/DriverLocation';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './components/userProfile';
import AddProductPage from './pages/AddProducts';
import useNotifications from './hooks/userNotification';
import ForgotPassword from './pages/forgetPassword';
import ResetPassword from './pages/resetPassword';
import CartWithCheckout from './components/checkout';
import OrderConfirmation from './components/OrderConfirmation';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import DriverLogin from './pages/DriverLogin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationPermission from './components/notificationpermission';

export default function App() {
  const driverId = localStorage.getItem('driverId');
  const { permissionState, triggerNativePrompt } = useNotifications();
  
  // 1. Add state to track the logged-in user and the initial loading phase
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 2. Properly manage Auth State using useEffect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem("userUID", currentUser.uid);
      } else {
        localStorage.removeItem("userUID");
      }
      setIsAuthLoading(false); // Auth check is complete
    });
    return () => unsubscribe();
  }, []);

  // 3. ONLY ask for permissions if there is a logged-in user
  useEffect(() => {
    if (user && permissionState === 'default') {
      triggerNativePrompt();
    }
  }, [permissionState, user]);

  // Optional: Prevent a flash of the wrong UI while Firebase figures out who is logged in
  if (isAuthLoading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  // 4. ONLY block the screen if they are logged in AND denied permission
  if (user && permissionState === 'denied') {
    return (
      <NotificationPermission />
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/driverlogin" element={<DriverLogin />} />

          <Route path="/dashboard/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<AddProductPage />} />
            <Route path="cart" element={<CartWithCheckout />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="track/:orderId" element={<TrackOrderPage />} />
            <Route path="driver" element={<DriverTracker driverId={driverId} />} />
            <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}