import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center mb-4">
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          flex-grow 
          px-4 py-2 
          border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-700 
          text-gray-900 dark:text-gray-100 
          rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-primary 
          transition-colors
        "
      />
    </div>
  )
}
