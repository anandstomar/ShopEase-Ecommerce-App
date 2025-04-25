// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './pages/DashboardLayout'
import ProductsPage from './pages/ProductPage'
import OrdersPage from './pages/OrderPage'
import CartPage from './pages/CartPage'
import PaymentPage from './pages/PaymentPage'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import UserProfile    from './components/userProfile'
import AddProductPage from './pages/AddProducts'
import useNotifications from './components/userNotification'
import './App.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

export default function App() {
  useNotifications()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem("userUID", user.uid);
    } else {
      localStorage.removeItem("userUID");
    }
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="orders"   element={<OrdersPage   />} />
          <Route path="cart"     element={<CartPage     />} />
          <Route path="payment"  element={<PaymentPage  />} />
          <Route path="profile"   element={<UserProfile  />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

 
 
 
