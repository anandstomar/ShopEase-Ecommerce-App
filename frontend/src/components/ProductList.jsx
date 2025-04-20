// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../cartmangement/cartSlice';
import useSearch from './useSearch';
import SearchBar from './searchbar';
import CategoryFilter from './categoryfilter';
import api from '../api'; 

export default function ProductList() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products/')
      .then(({ data }) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];
        setProducts(list);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setError('Could not load products.');
        setLoading(false);
      });
  }, []);

  const categories = [...new Set(products.map(p => p.category))];
  const { query, setQuery, results } = useSearch(products, {
    keys: ['name', 'description']
  });
  const [category, setCategory] = useState('');
  const filtered = results.filter(p => !category || p.category === category);

  if (loading) return <p className="text-gray-700 dark:text-gray-300">Loading products…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <SearchBar value={query} onChange={setQuery} />
      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Products</h2>

      {filtered.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No products found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <li
              key={product._id}
              className="border border-gray-200 dark:border-gray-700 p-4 rounded shadow bg-white dark:bg-gray-800 transition-colors"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-bold mt-2">
                ${product.price.toFixed(2)}
              </p>
              <div className="mt-4 flex">
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}





// import { useEffect, useState } from 'react';
// import { fetchProducts } from '../api'
// import { useDispatch } from 'react-redux'
// import { addToCart } from '../cartmangement/cartSlice'
// import useSearch from './useSearch';
// import SearchBar from './searchbar';
// import CategoryFilter from './categoryfilter';

// export default function ProductList({ onAddToCart }) {
//   const [products, setProducts] = useState([]);
//   const categories = [...new Set(products.map(p => p.category))];
//   const dispatch = useDispatch()

//   useEffect(() => {
//     fetchProducts().then(res => setProducts(res.data));
//   }, []);

//   const { query, setQuery, results } = useSearch(products, {
//        keys: ['name', 'description']
//      });
//      const [category, setCategory] = useState('');
    
//      const filtered = results.filter(
//        p => !category || p.category === category
//      );

//   return (
//     <div>
//       <SearchBar value={query} onChange={setQuery} />
//      <CategoryFilter
//        categories={categories}
//        selected={category}
//        onSelect={setCategory}
//      />
//       <h2>Products</h2>
//       {products.length === 0 ? <p>No products</p> : (
//         <ul>
//           {products.map(product => (
//             <li key={product._id}>
//               {product.name} - ${product.price}
//               <button onClick={() => onAddToCart(product)}>Add</button>
//               <button onClick={() => dispatch(addToCart(product))}>
//               Add to Cart
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
