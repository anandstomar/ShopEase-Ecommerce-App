import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { retrieveFCMToken } from '../firebase';

export default function Home() {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      const token = await retrieveFCMToken();
      setFcmToken(token);
    }
    fetchToken();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      
      {/* Logo and App Name */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="bg-blue-500 text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-md">
          S
        </div>
        <h1 className="text-4xl font-extrabold tracking-wide">ShopEase</h1>
      </motion.div>

      {/* Welcome Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-lg text-gray-300 mb-6"
      >
        Welcome to the Store — experience seamless shopping.
      </motion.p>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Link
          to="/register"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white font-medium shadow"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="px-5 py-2 bg-green-600 hover:bg-green-700 transition rounded-lg text-white font-medium shadow"
        >
          Login
        </Link>
        <Link
          to="/driverlogin"
          className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 transition rounded-lg text-white font-medium shadow"
        >
          Driver Login
        </Link>
      </motion.div>
    </div>
  );
}
