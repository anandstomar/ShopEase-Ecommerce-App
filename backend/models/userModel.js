const pool = require('../config/postgresql');


async function createUser({ name, email,password, googleId }) {
//   if(googleId){
//   const result = await pool.query(
//     `INSERT INTO users (name, email, google_id)
//      VALUES ($1, $2, $3)
//      ON CONFLICT (email) DO UPDATE
//        SET google_id = EXCLUDED.google_id
//      RETURNING *`,
//     [name, email, googleId]
//   );
//   return result.rows[0];
// }else{
  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, password]
  );
  return result.rows[0];
}
  

async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1`, [email]
  );
  return rows[0];
}

async function getUserByFirebaseUid(firebaseUid) {
  const { rows } = await pool.query(
    `SELECT id, name, email, firebase_uid
       FROM users WHERE firebase_uid = $1`,
    [firebaseUid]
  );
  return rows[0];
}

async function getUserByGoogleId(googleId) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE google_id = $1`,
    [googleId]
  );
  return rows[0];
}

async function getUserById(id) {
  const result = await pool.query(
    'SELECT id, name, email, firebase_uid FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

module.exports = { createUser, getUserByEmail, getUserByFirebaseUid, getUserByGoogleId, getUserById
 };
