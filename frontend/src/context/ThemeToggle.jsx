import React, { useContext } from 'react'
import { ThemeContext } from './ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { darkMode, setDarkMode } = useContext(ThemeContext)
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="btn btn-square btn-ghost"
      aria-label="Toggle Theme"
    >
      {darkMode
        ? <Sun className="w-6 h-6 text-yellow-400" />
        : <Moon className="w-6 h-6 text-gray-700" />
      }
    </button>
  )
}
