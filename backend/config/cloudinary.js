// src/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env;

cloudinary.config({
  cloud_name:  CLOUDINARY_CLOUD_NAME,
  api_key:     CLOUDINARY_API_KEY,
  api_secret:  CLOUDINARY_API_SECRET,
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
