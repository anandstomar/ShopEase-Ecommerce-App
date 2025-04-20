const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId',orderController.getMyOrders);//me
router.post('/', orderController.placeOrder);
// router.get('/:userId', orderController.getOrdersForUser);

module.exports = router;
