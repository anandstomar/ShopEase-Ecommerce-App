import { motion } from 'framer-motion'
import Orders from '../components/Orders'

export default function OrdersPage() {
  const userId = localStorage.getItem('userId')
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Orders</h1>
      <div className="card bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-4">
        <Orders userId={userId} />
      </div>
    </motion.div>
  )
}