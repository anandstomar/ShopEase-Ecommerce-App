const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const admin     = require('../config/firebase');        // Firebase Admin SDK
const {
  createUser,
  getUserByEmail,
  getUserByFirebaseUid,
  getUserByGoogleId,
  updateUserFirebaseUid
} = require('../models/userModel');
const db = require('../config/postgresql'); 

const JWT_SECRET     = 'some-very-strong-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(user) {
  const payload = { sub: user.id, email: user.email };
  const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

async function registerEmail({ name, email, password }) {
  if (await getUserByEmail(email)) {
    throw new Error('Email already in use');
  }
  const hashed = await bcrypt.hash(password, 12);
  const user   = await createUser({ name, email, password: hashed });
  return signToken(user);
}

async function loginEmail({ email, password }) {
  const user = await getUserByEmail(email);
  if (!user || !user.password) {
    throw new Error('Invalid email or password');
  }
  if (!await bcrypt.compare(password, user.password)) {
    throw new Error('Invalid email or password');
  }
  return signToken(user);
}

// async function loginWithFirebase(idToken) {
//   const decoded = await admin.auth().verifyIdToken(idToken);
//   const { uid, name, email } = decoded;
//   let user = await getUserByFirebaseUid(uid);
//   if (!user) {
//     user = await createUser({ name, email, firebaseUid: uid });
//   }
//   return signToken(user);
// }

async function loginWithFirebase(idToken) {
  const decoded = await admin.auth().verifyIdToken(idToken);
  const { uid, name, email } = decoded;

  let user = await getUserByFirebaseUid(uid);
  if (user) {
    return signToken(user);
  }

  user = await getUserByEmail(email);
  if (user) {
    user = await updateUserFirebaseUid(user.id, uid);
    return signToken(user);
  }

  user = await createUser({ name, email, firebaseUid: uid });
  return signToken(user);
}


async function loginWithGoogleOAuth({ googleId, name, email }) {
  let user = await getUserByGoogleId(googleId);
  if (!user) {
    user = await createUser({ name, email, googleId });
  }
  return signToken(user);
}

const saveResetToken = async (email, token, expires) => {
  await db.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
    [token, new Date(expires), email]
  );
};

const getUserByResetToken = async (token) => {
  const result = await db.query(
    'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
    [token]
  );
  return result.rows[0];
};

module.exports = {
  registerEmail,
  loginEmail,
  loginWithFirebase,
  loginWithGoogleOAuth,
  saveResetToken,
  getUserByResetToken
};


