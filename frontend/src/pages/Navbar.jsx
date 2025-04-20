import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from '../context/ThemeToggle' 

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="navbar bg-base-100 shadow-md px-6"
    >
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-2xl font-bold">
          ShopEase
        </Link>
      </div>

      <div className="flex-none space-x-2">
        <Link to="/"        className="btn btn-ghost">Home</Link>
        <Link to="/register" className="btn btn-ghost">Register</Link>
        <Link to="/login"    className="btn btn-ghost">Login</Link>
        <Link to="/dashboard"className="btn btn-ghost">Dashboard</Link>
        <ThemeToggle />
      </div>
    </motion.nav>
  )
}
