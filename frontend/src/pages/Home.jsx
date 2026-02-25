import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { retrieveFCMToken } from '../firebase'; // Keep your existing import

// --- Icons (Inline SVGs to avoid extra dependencies) ---
const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
);
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default function Home() {
  const [fcmToken, setFcmToken] = useState(null);

  // --- Keep your existing logic ---
  useEffect(() => {
    async function fetchToken() {
      try {
        const token = await retrieveFCMToken();
        setFcmToken(token);
        if (token) console.log("FCM Token loaded"); 
      } catch (err) {
        console.error("FCM Token Error:", err);
      }
    }
    fetchToken();
  }, []);

  // --- Animation Variants ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* --- Navbar --- */}
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center shadow-lg shadow-blue-500/30">
            S
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">ShopEase</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition">
            Log in
          </Link>
          <Link to="/register" className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-600/30 transition-transform transform hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 flex flex-col items-center text-center relative z-10">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl"
        >
          <motion.div variants={fadeInUp} className="inline-block px-4 py-1.5 mb-6 border border-gray-700 rounded-full bg-gray-800/50 backdrop-blur-sm">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">New Arrival</span>
            <span className="text-xs text-gray-400 ml-2">Real-time driver tracking is here 🚀</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Seamless</span> Shopping
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Your favorite products delivered with speed. Track your orders in real-time on our interactive map and enjoy secure, hassle-free payments.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all hover:scale-105"
            >
              Start Shopping
            </Link>
            <Link 
              to="/driverlogin" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700 hover:border-yellow-500/50 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <TruckIcon /> Driver Portal
            </Link>
          </motion.div>

        </motion.div>
      </main>

      {/* --- Features Grid --- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-800">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/30 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-400 mb-6">
              <ShoppingBagIcon />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Vast Selection</h3>
            <p className="text-gray-400 leading-relaxed">
              Explore thousands of products from top brands. Tech, fashion, and essentials all in one dark-mode dashboard.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-green-500/30 transition-colors"
          >
            <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center text-green-400 mb-6">
              <MapPinIcon />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Live Map Tracking</h3>
            <p className="text-gray-400 leading-relaxed">
              Watch your driver move in real-time on our interactive map. No more guessing when your package arrives.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-yellow-500/30 transition-colors"
          >
            <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center text-yellow-400 mb-6">
              <TruckIcon />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Fast Delivery</h3>
            <p className="text-gray-400 leading-relaxed">
              Optimized routing for our drivers ensures your gear gets to you faster than ever before.
            </p>
          </motion.div>

        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="w-full py-8 text-center text-gray-500 text-sm border-t border-gray-800">
        <p>© 2024 ShopEase Inc. All rights reserved.</p>
      </footer>

    </div>
  );
}





// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { useEffect, useState } from 'react';
// import { retrieveFCMToken } from '../firebase';

// export default function Home() {
//   const [fcmToken, setFcmToken] = useState(null);

//   useEffect(() => {
//     async function fetchToken() {
//       const token = await retrieveFCMToken();
//       setFcmToken(token);
//     }
//     fetchToken();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      
//       {/* Logo and App Name */}
//       <motion.div
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="flex items-center gap-3 mb-8"
//       >
//         <div className="bg-blue-500 text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-md">
//           S
//         </div>
//         <h1 className="text-4xl font-extrabold tracking-wide">ShopEase</h1>
//       </motion.div>

//       {/* Welcome Text */}
//       <motion.p
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3, duration: 0.5 }}
//         className="text-lg text-gray-300 mb-6"
//       >
//         Welcome to the Store — experience seamless shopping.
//       </motion.p>

//       {/* Navigation Buttons */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.5, duration: 0.4 }}
//         className="flex flex-wrap gap-4 justify-center"
//       >
//         <Link
//           to="/register"
//           className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white font-medium shadow"
//         >
//           Register
//         </Link>
//         <Link
//           to="/login"
//           className="px-5 py-2 bg-green-600 hover:bg-green-700 transition rounded-lg text-white font-medium shadow"
//         >
//           Login
//         </Link>
//         <Link
//           to="/driverlogin"
//           className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 transition rounded-lg text-white font-medium shadow"
//         >
//           Driver Login
//         </Link>
//       </motion.div>
//     </div>
//   );
// }
