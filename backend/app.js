const express = require('express');
const bodyParser = require('body-parser');
const apolloServer = require('./config/graphql');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { runNotificationConsumer } = require('./services/notificationService');
const { connectProducers, runConsumer } = require('./config/kafka');
const paymentRoutes = require('./routes/paymentRoutes');
const driverRoutes = require('./routes/driverRoutes');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3007;
const cors = require('cors');
const { createUser, getUserByEmail } = require('./models/userModel');
const { initSocket } = require('./config/socketio');
const http = require('http');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = process.env;
const pool = require('./config/postgresql');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/drivers', driverRoutes);

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // const email = profile.emails[0].value;
      // let user = await getUserByEmail(email);
      // if (!user) {
      //   const email = profile.emails[0].value;
      //   const name  = profile.displayName;
      //   console.log("name ", name)
      //   user = await createUser({
      //     name:     profile.displayName,
      //     email,
      //     googleId: profile.id
      //   });

      const email = profile.emails[0].value;
      let user = await getUserByEmail(email);

      if (user) {
        if (!user.google_id) {
          const { rows } = await pool.query(
            `UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *`,
            [profile.id, email]
          );
          user = rows[0];
        }
      } else {
        user = await createUser({
          name: profile.displayName,
          email,
          googleId: profile.id
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await getUserByEmail(id);
  done(null, user);
});


app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      'some-very-strong-secret',
      { expiresIn: '2h' }
    );
    const googleId = req.user.google_id;
    console.log('Google ID:', googleId);
    console.log('JWT Token:', token);
    const redirectUrl =
      `https://shop-ease-ecommerce-app.vercel.app/dashboard/products` +
      `?googleId=${encodeURIComponent(googleId)}`;  //&
    res.redirect(redirectUrl);
  }
);


apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  const startApp = async () => {
    try {
      await connectProducers();
      console.log("Kafka producer connected");
      // console.log(`Notification Service running on port ${PORT}`);
      await runNotificationConsumer();
      //  await runConsumer().catch(err => {
      //   console.error('Notification consumer error:', err);
      //   process.exit(1);
      // });

      const server = http.createServer(app);
      initSocket(server);

      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
      });
    } catch (error) {
      console.error("Failed to connect Kafka producer", error);
    }
  };
  startApp();
});




