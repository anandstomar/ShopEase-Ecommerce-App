import DashboardLayout from '../layouts/DashboardLayout'
import Cart from '../components/Cart'
import ProductList from '../components/ProductList'
import Orders from '../components/Orders'
import RazorpayCheckout from '../components/RazorpayCheckout'
import { motion } from 'framer-motion'

export default function Dashboard() {

  return (
    <DashboardLayout>
      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-4xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100"
      >
        Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {[Cart, ProductList, () => <Orders userId={userId}/>, RazorpayCheckout].map((Comp, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="card bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-lg p-4"
          >
            <Comp />
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  )
}
