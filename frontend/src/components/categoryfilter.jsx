import React from 'react'

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <select
      value={selected}
      onChange={e => onSelect(e.target.value)}
      className="
        mb-4
        px-3 py-2
        bg-white dark:bg-gray-700
        text-gray-900 dark:text-gray-100
        border border-gray-300 dark:border-gray-600
        rounded-lg
        focus:outline-none focus:ring-2 focus:ring-primary
        transition-colors
      "
    >
      <option value="" className="bg-white dark:bg-gray-700">
        All Categories
      </option>
      {categories.map(cat => (
        <option
          key={cat}
          value={cat}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {cat}
        </option>
      ))}
    </select>
  )
}
