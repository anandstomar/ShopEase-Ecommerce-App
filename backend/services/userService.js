const admin = require('../config/firebase'); // your initialized Admin SDK
const { createUser, getUserByEmail, getUserByUid } = require('../models/userModel');

async function registerEmail({ name, email, password }) {
  const exists = await getUserByEmail(email);
  if (exists) throw new Error('Email already in use');
  // const userRecord = await admin.auth().createUser({ displayName: name,email, password});
  // return await createUser({ name, email, firebaseUid: userRecord.uid });
  return await createUser({ name, email, password});
}

async function loginEmail({ email, password }) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('User not found');
  return user;
}

async function loginWithGoogle(idToken) {
  const decoded = await admin.auth().verifyIdToken(idToken);
  const { uid, name, email } = decoded;
  let user = await getUserByUid(uid);
  if (!user) {
    user = await createUser({ name, email, firebaseUid: uid });
  }
  return user;
}

module.exports = { registerEmail, loginEmail, loginWithGoogle };