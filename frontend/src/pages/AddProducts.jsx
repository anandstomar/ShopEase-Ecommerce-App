import { useState } from 'react'
import api from '../api'

export default function AddProductForm() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    imageFile: null,
  })

  const handleChange = e => {
    if (e.target.name === 'imageFile') {
      setForm(f => ({ ...f, imageFile: e.target.files[0] }))
    } else {
      setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const data = new FormData()
      ;['name', 'price', 'category', 'description'].forEach(key =>
        data.append(key, form[key])
      )
    data.append('image', form.imageFile)

    try {
      const res = await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      console.log('Product added:', res.data)
    } catch (err) {
      console.error('Error adding product:', err)
      alert(err.response?.data?.error || 'Failed to add product')
    }
  }

  return (
     <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="flex flex-col">
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Name"
      className="input bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 mb-4"
    />
    <input
      name="category"
      value={form.category}
      onChange={handleChange}
      placeholder="Category"
      className="input bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
    />
  </div>

  <div className="flex flex-col">
    <input
      name="price"
      value={form.price}
      onChange={handleChange}
      placeholder="Price"
      className="input bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 mb-4"
    />
    <textarea
      name="description"
      value={form.description}
      onChange={handleChange}
      placeholder="Description"
      className="input bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 resize-none h-24"
    />
  </div>
</div>
   

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      <input
        type="file"
        name="imageFile"
        onChange={handleChange}
        accept="image/*"
        className="input bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
      />
      <button
        type="submit"
        className="btn-primary w-full md:w-auto text-center"
      >
        Add Product
      </button>
    </div>
  </form>
  )
}
