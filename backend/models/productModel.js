
const mongoose = require('../config/mongodb');
const { Schema } = mongoose;

const productSchema = new Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  description: { type: String, required: true },
  image:       { type: String, required: true },    
  createdAt:   { type: Date,   default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);



