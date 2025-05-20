const express = require('express');
const {
  registerUser,
  loginUser,
  firebaseCallback,
  googleOAuthCallback,
  getUsersByIds,
  identifyUser,
  forgotPasswordController,
  resetPasswordController 
} = require('../controllers/userController');
const {  getUserByAnyIdentifier } = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// 1) Email/password
router.post('/register', registerUser);
router.post('/login',    loginUser);

// 2) Firebase “Sign in with Google”
router.post('/firebase', firebaseCallback);

// 3) Google OAuth2 “Continue with Google”
router.post('/google',   googleOAuthCallback);

router.get('/profile/:id', getUsersByIds); 

//example protected route
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

router.get('/identify/:identifier', identifyUser);

router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);
  
  
module.exports = router;





// const express = require('express');
// const { registerUser, loginUser, googleCallback, getUsersById } = require('../controllers/userController');
// const authMiddleware = require('../middleware/authMiddleware');
// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login',loginUser);
// router.get('/profile/:id', getUsersById);
// router.post('/google',googleCallback);


// module.exports = router;