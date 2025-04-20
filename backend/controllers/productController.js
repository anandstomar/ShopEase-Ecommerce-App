// src/controllers/productController.js
const productService = require('../services/productService');

async function getProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('Get Products Error:', err);
    res.status(500).json({ error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const { name, price, category, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }
    console.log('Incoming product:', req.body);
    console.log('Uploaded file:', req.file);
    const imageUrl = req.file.path; 
    const p = await productService.createProduct({
      name,
      price: parseFloat(price),
      category,
      description,
      image: imageUrl
    });
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getProducts, createProduct };
