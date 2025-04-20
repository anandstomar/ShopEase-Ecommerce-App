const express = require('express');
const { registerUser, loginUser, googleCallback, getUsersById } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.get('/profile/:id', getUsersById);
router.post('/google',googleCallback);


module.exports = router;