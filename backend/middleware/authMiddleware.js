// const admin = require('../config/firebase');

// async function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;
// if (!authHeader || !authHeader.startsWith('Bearer ')) {
//   return res.status(401).json({ error: 'Authorization header missing or malformed' });
// }
// const token = authHeader.split(' ')[1];
// if (!token) return res.status(401).json({ error: 'No token' });

//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     req.user = decoded; 
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// }

// module.exports = authMiddleware;
