const { UploadStream } = require('cloudinary');
const pool = require('../config/postgresql');

async function createUser({ name, email, password, googleId, firebaseUid }) {
  if (googleId) {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, google_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, email, googleId]
    );
    return rows[0];
  } else if (firebaseUid) {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, firebase_uid)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, email, firebaseUid]
    );
    return rows[0];
  } else {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, email, password]
    );
    return rows[0];
  }
}

async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1`, [email]
  );
  return rows[0];
}

async function getUserByFirebaseUid(firebaseUid) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE firebase_uid = $1`, [firebaseUid]
  );
  return rows[0];
}

async function getUserByGoogleId(googleId) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE google_id = $1`, [googleId]
  );
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, name, email FROM users WHERE id = $1`, [id]
  );
  return rows[0];
}

async function getUserByIdentifier(identifier) {
  if (!identifier) {
    throw new Error('Identifier is required');
  }
  const { rows } = await pool.query(
    `SELECT id, name, email, firebase_uid, google_id
     FROM users
     WHERE firebase_uid = $1
        OR google_id   = $1
        OR email       = $1
     LIMIT 1`,
    [identifier]
  );
  return rows[0];
}

async function updateUserFirebaseUid(userId, firebaseUid) {
  const { rows } = await pool.query(
    `UPDATE users
       SET firebase_uid = $1
     WHERE id = $2
   RETURNING *`,
    [firebaseUid, userId]
  );
  return rows[0];
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserByFirebaseUid,
  getUserByGoogleId,
  getUserById,
  getUserByIdentifier,
  updateUserFirebaseUid
};


