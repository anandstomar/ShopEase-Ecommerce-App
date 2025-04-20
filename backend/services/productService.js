// src/services/productService.js
const Product       = require('../models/productModel');
const redisClient   = require('../config/redis');

// Helper to create a consistent cache key
function generateCacheKey(prefix, params = {}) {
  const sorted = Object.keys(params).sort().reduce((a,k) => { a[k]=params[k]; return a; }, {});
  return `${prefix}:${JSON.stringify(sorted)}`;
}

// Fetch + cache
async function getAllProducts(params = {}) {
  const cacheKey = generateCacheKey('products', params);
  const cached   = await redisClient.get(cacheKey);
  if (cached) {
    console.log('🌳 products from cache');
    return JSON.parse(cached);
  }

  const products = await Product.find({}).lean();
  await redisClient.setEx(cacheKey, 60, JSON.stringify(products));
  console.log('🌱 products from MongoDB & cached');
  return products;
}

// Create + invalidate
async function createProduct(data) {
  const p = await Product.create(data);
  const cacheKey = generateCacheKey('products', {});  
  await redisClient.del(cacheKey);
  console.log('🗑️  products cache invalidated');
  return p;
}

module.exports = { getAllProducts, createProduct };
