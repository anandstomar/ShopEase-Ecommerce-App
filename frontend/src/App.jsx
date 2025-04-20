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
import UserProfile    from './components/UserProfile'
import AddProductPage from './pages/AddProducts'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard with sidebar */}
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

 
  // return (
  //   <Router>
  //     <Routes>
  //       <Route path="/" element={<Home />} />
  //       <Route path="/register" element={<Register />} />
  //       <Route path="/login" element={<Login />} />
  //       <Route path="/dashboard" element={<Dashboard />} />
  //     </Routes>
  //   </Router>
  // );


   


      // getRedirectResult(auth).then((result) => {
      //   console.log("Redirect result:", result);
      //   if (result) {
      //     const credential = GoogleAuthProvider.credentialFromResult(result);
      //     if (credential) {
      //       console.log("Google token:", credential.accessToken);
      //     }
      //   }
            // const result = getRedirectResult(auth)
            // if (result.user) {
            //   const { displayName, email, uid } = result.user;
            //   console.log("User info:", result.user);
            //   if (!displayName || !email || !uid) {
            //     throw new Error("Missing user information from Google");
            //   }
            //   registerUser({ name: result.user.displayName, email:result.user.email, firebaseUid: result.user.uid });
            //   navigate('/login'); // Or directly to dashboard if auto-login
            // }
          
  // })
 
 
