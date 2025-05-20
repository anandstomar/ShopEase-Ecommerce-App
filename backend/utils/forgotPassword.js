const crypto = require('crypto');
const { sendEmail } = require('./emailService');
const { getUserByEmail } = require('../models/userModel');
const { saveResetToken } = require('../services/userService');

const forgotPassword = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('User not found');

  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 3600000; 

  await saveResetToken(email, token, expires);

  const resetLink = `http://localhost5173/reset-password?token=${token}&email=${email}`;

  await sendEmail(email, 'Password Reset Request', `Reset your password using this link: ${resetLink}`);
};

module.exports = { forgotPassword };
