import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from '../context/ThemeToggle'

export default function DashboardLayout() {
  const { pathname } = useLocation()

  const menuItems = [
    { to: 'products', label: 'Products' },
    { to: 'orders',   label: 'Orders'   },
    { to: 'cart',     label: 'Cart'     },
    { to: 'payment',  label: 'Payment'  },
    { to: 'profile',  label: 'Profile'  },
    { to: 'products/new', label: 'Add Product' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-56 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg p-6 hidden md:flex md:flex-col"
      >
        <div className="mb-8 text-2xl font-bold text-primary">ShopEase</div>
        <nav className="flex-1 space-y-4">
          {menuItems.map(({ to, label }) => (
            <Link
            key={to}
              to={to}
              className={`
                btn btn-ghost w-full justify-start
                text-gray-800 dark:text-gray-100
                hover:bg-gray-100 dark:hover:bg-gray-700    /* lighten hover in light, darker in dark */
                focus:bg-gray-200 dark:focus:bg-gray-600    /* focus state for accessibility */
                transition-colors
                ${pathname.endsWith(to)
                  ? 'bg-primary/20 dark:bg-primary/30'
                  : ''}
              `}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
          <ThemeToggle />
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <Outlet />
      </div>
    </div>
  )
}