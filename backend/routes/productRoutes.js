const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });  
// const { upload, uploadToCloudinary } = require('../middleware/upload');
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.post('/',upload.single('image'), productController.createProduct);

module.exports = router;
