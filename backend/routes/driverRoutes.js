const express = require('express');
const router = express.Router(); 
const { assignDriverController, updateLocationController } = require('../controllers/driverController');

router.post('/orders/assign-driver', assignDriverController);
router.post('/location/:driverId', updateLocationController);



module.exports = router;