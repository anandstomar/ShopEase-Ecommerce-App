const mongoose = require('../config/mongodb');
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  walletAddress: { type: String, required: true }, 
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  verified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);