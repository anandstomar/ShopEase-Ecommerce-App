import { motion } from 'framer-motion'
import ProductList from '../components/ProductList'

export default function ProductsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
      <div className="card bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-4">
        <ProductList />
      </div>
    </motion.div>
  )
}