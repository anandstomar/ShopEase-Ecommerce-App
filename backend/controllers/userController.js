// controllers/userController.js
const userService = require('../services/userService');
const admin = require('../config/firebase');
const pool = require('../config/postgresql'); 
const { getUserById } = require('../models/userModel');

async function registerUser(req, res) {
  try {
    const { name, email, password} = req.body;
    console.log('Registering user:', { name, email, password });
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing name/email/password' });
    }
    const user = await userService.registerEmail({ name, email, password });
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
    console.error('🔥 registerUser error:', err);
    const status = err.message.includes('already in use') ? 409 : 500;
     return res.status(status).json({ error: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    console.log('Logging in user:', { email, password });
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email/password' });
    }
    const user = await userService.loginEmail({ email, password });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function googleCallback(req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' });
    }
    const user = await userService.loginWithGoogle(idToken);
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id    AS userId,
        name, 
        email
      FROM users
    `);
    return res.json(rows);
  } catch (err) {
    console.error('Get all users error:', err);
    return res.status(500).json({ error: 'Could not fetch users' });
  }
}

async function getUsersById(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { registerUser, loginUser, googleCallback, getAllUsers, getUsersById };
