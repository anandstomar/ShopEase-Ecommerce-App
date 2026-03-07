const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');
// 1. GET Reviews for a specific product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST a new review
router.post('/', async (req, res) => {
  const { productId, walletAddress, rating, text, verified } = req.body;
  
  try {
    const newReview = new Review({ productId, walletAddress, rating, text, verified });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;