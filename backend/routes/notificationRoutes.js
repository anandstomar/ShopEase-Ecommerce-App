const express = require('express');
const router = express.Router();
const { registerDevice } = require('../controllers/notificationController');
//const authMiddleware = require('../middleware/authMiddleware');

router.post('/devices', registerDevice);

module.exports = router;
