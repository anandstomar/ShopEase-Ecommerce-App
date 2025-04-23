const express = require('express');
const router = express.Router();
const { registerDevice } = require('../controllers/notificationController');
//const authMiddleware = require('../middleware/authMiddleware');

router.post('/devices', registerDevice);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { sendTestNotification } = require('../controllers/notificationController');

// router.post('/send', sendTestNotification);
// router.get('/send', (req, res) => {
//     res.status(200).send("notification route is working!");
// });

// module.exports = router;
