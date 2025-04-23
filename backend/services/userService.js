const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const admin     = require('../config/firebase');        // Firebase Admin SDK
const {
  createUser,
  getUserByEmail,
  getUserByFirebaseUid,
  getUserByGoogleId
} = require('../models/userModel');

const JWT_SECRET     = 'some-very-strong-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ─── Helpers ────────────────────────────────────────────────────────────────
function signToken(user) {
  const payload = { sub: user.id, email: user.email };
  const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

// ─── 1) Email/Password ──────────────────────────────────────────────────────
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

// ─── 2) Firebase “Sign in with Google” ─────────────────────────────────────
async function loginWithFirebase(idToken) {
  const decoded = await admin.auth().verifyIdToken(idToken);
  const { uid, name, email } = decoded;
  let user = await getUserByFirebaseUid(uid);
  if (!user) {
    user = await createUser({ name, email, firebaseUid: uid });
  }
  return signToken(user);
}

// ─── 3) OAuth2 “Continue with Google” ──────────────────────────────────────
//    Called when your frontend has already obtained a Google‐ID (via gapi or
//    popup) and POSTs { googleId, name, email }.
async function loginWithGoogleOAuth({ googleId, name, email }) {
  let user = await getUserByGoogleId(googleId);
  if (!user) {
    user = await createUser({ name, email, googleId });
  }
  return signToken(user);
}

module.exports = {
  registerEmail,
  loginEmail,
  loginWithFirebase,
  loginWithGoogleOAuth
};


