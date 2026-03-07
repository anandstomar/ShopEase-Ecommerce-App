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

async function getProductById(id) {
  const cacheKey = `product:${id}`; // Unique key for this specific ID
  
  // 1. Try Cache
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log(`🌳 product ${id} from cache`);
    return JSON.parse(cached);
  }

  // 2. Try MongoDB
  const product = await Product.findById(id).lean();
  
  if (!product) return null; // Handle not found in controller

  // 3. Save to Cache (Expires in 60s)
  await redisClient.setEx(cacheKey, 60, JSON.stringify(product));
  console.log(`🌱 product ${id} from MongoDB & cached`);
  
  return product;
}

module.exports = { getAllProducts, createProduct, getProductById };
