// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './pages/DashboardLayout'
import ProductsPage from './pages/ProductPage'
import OrdersPage from './pages/OrderPage'
import CartPage from './pages/CartPage'
import PaymentPage from './pages/PaymentPage'
import TrackOrderPage from './pages/TrackOrder'
import DriverTracker from './pages/Driverlocation'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import UserProfile from './components/userProfile'
import AddProductPage from './pages/AddProducts'
import useNotifications from './hooks/userNotification'
import ForgotPassword from './pages/forgetPassword';
import ResetPassword from './pages/resetPassword';
import CartWithCheckout from './components/checkout'
import './App.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import DriverLogin from './pages/DriverLogin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
  const driverId = localStorage.getItem('driverId');
  useNotifications()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem("userUID", user.uid);
    } else {
      localStorage.removeItem("userUID");
    }
  });
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
          {/* <Route path="orders"   element={<OrdersPage   />} /> */}
          <Route path="cart" element={<CartWithCheckout />} />
          {/* <Route path="payment"  element={<PaymentPage  />} /> */}
          <Route path="profile" element={<UserProfile />} />
          <Route path="track/:orderId" element={<TrackOrderPage />} />
          <Route path="driver" element={<DriverTracker driverId={driverId} />} />
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
  )
}




