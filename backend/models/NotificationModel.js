const pool = require('../config/postgresql');

async function saveDeviceToken(userId, token) {
  const { rows } = await pool.query(
    `INSERT INTO user_devices (user_id, device_token)
     VALUES ($1, $2)
     ON CONFLICT (user_id, device_token) DO NOTHING`,
    [userId, token]
  );
  return rows[0];
}

async function getDeviceTokensByUserId(userId) {
  const { rows } = await pool.query(
    `SELECT device_token FROM user_devices WHERE user_id = $1`,
    [userId]
  );
  return rows.map(r => r.device_token);
}

async function getAllDeviceTokens() {
  const { rows } = await pool.query(
    `SELECT device_token FROM user_devices`
  );
  return rows.map(r => r.device_token);
}

module.exports = { saveDeviceToken, getDeviceTokensByUserId, getAllDeviceTokens };