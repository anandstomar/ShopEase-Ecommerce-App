const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId',orderController.getMyOrdersController);
router.post('/', orderController.placeOrderController);
router.get('/status/:orderId', orderController.getOrderStatusController);

module.exports = router;
