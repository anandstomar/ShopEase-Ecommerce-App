import { motion } from 'framer-motion'
import Cart from '../components/Cart'

export default function CartPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">My Cart</h1>
      <div className="card bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-4">
        <Cart />
      </div>
    </motion.div>
  )
}