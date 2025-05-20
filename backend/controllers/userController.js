const db = require('../config/postgresql');
const authService = require('../services/userService');
const {getUserById, getUserByIdentifier} = require('../models/userModel');
const { forgotPassword } = require('../utils/forgotPassword');
const { getUserByResetToken } = require('../services/userService');
const bcrypt = require('bcrypt');


async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    return res.status(201).json(
      await authService.registerEmail({ name, email, password })
    );
  } catch (err) {
    const status = err.message.includes('in use') ? 409 : 400;
    return res.status(status).json({ error: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password }); 
    return res.json(
      await authService.loginEmail({ email, password })
    );
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

async function firebaseCallback(req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken) throw new Error('Missing idToken');
    return res.json(await authService.loginWithFirebase(idToken));
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

async function googleOAuthCallback(req, res) {
  try {
    const { googleId, name, email } = req.body;
    if (!googleId || !email) throw new Error('Missing googleId/email');
    return res.json(
      await authService.loginWithGoogleOAuth({ googleId, name, email })
    );
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function getUsersByIds(req, res) {
  const id = parseInt(req.params.id,10);
  // if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });
  const user = await getUserById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

async function identifyUser(req, res) {
  try {
    const { identifier } = req.params;
    if (!identifier) {
      return res.status(400).json({ error: 'Missing identifier' });
    }

    const user = await getUserByIdentifier(identifier);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user.id,
     // name: user.name,
     // email: user.email,
    });
  } catch (err) {
    console.error('identifyUser error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}


const forgotPasswordController = async (req, res) => {
  try {
    await forgotPassword(req.body.email);
    res.status(200).json({ message: 'Reset email sent' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    const user = await getUserByResetToken(token);
    if (!user || user.email !== email) throw new Error('Invalid or expired token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE email = $2',
      [hashedPassword, email]
    );

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  firebaseCallback,
  googleOAuthCallback,
  getUsersByIds,
  identifyUser,
  forgotPasswordController,
  resetPasswordController
};

