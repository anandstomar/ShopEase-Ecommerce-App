// middleware/authMiddleware.js
const jwt          = require('jsonwebtoken');
const { getUserById } = require('../models/userModel');
const JWT_SECRET   = 'some-very-strong-secret';

async function authMiddleware(req, res, next) {
  const hdr = req.headers.authorization || '';
  if (!hdr.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }
  const token = hdr.slice(7);
  try {
    const { sub: userId } = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = { id: user.id, name: user.name, email: user.email };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
