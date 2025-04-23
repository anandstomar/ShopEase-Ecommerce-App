const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId',orderController.getMyOrders);
router.post('/', orderController.placeOrder);

module.exports = router;
