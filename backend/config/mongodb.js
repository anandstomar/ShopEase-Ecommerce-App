const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, {})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB for Product Service');
});

module.exports = mongoose;

