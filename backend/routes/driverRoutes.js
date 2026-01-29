const express = require('express');
const router = express.Router(); 
const { assignDriverController, updateLocationController, findNearestDrivers } = require('../controllers/driverController');

router.post('/orders/assign-driver', assignDriverController);
router.post('/location/:driverId', updateLocationController);
router.get('/nearest-drivers', findNearestDrivers);

module.exports = router;