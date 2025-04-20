// src/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name:  'doapmsccx',
  api_key:     '149969813891289',
  api_secret:  'sOOz2GfXMA60B5Wvbkcv4LbVJCc',
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'shopEase/products',      
    allowed_formats: ['jpg','png','jpeg','webp'],
    transformation: [{ width: 800, crop: 'limit' }],
  },
});

module.exports = { cloudinary, storage };
