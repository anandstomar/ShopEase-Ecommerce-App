const express = require('express');
const bodyParser = require('body-parser');
const apolloServer = require('./config/graphql');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { runNotificationConsumer } = require('./services/notificationService');
const { connectProducers, runConsumer  } = require('./config/kafka'); 
const paymentRoutes = require('./routes/paymentRoutes');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const { createUser,getUserByEmail } = require('./models/userModel');

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

passport.use(new GoogleStrategy({
  clientID:     '11253895168-59glkmmn2uu5ppqiaf7pod2c5kg35v4q.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL:  '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await getUserByEmail(email);
    if (!user) {
      const email = profile.emails[0].value;
      const name  = profile.displayName;
      user = await createUser({
        name:     profile.displayName,
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
secret:            'a06461067d3888fd577a5742ea653f023043e87728fba28279c35abbd32e042f7b4add266bafaa721d93e1a01f956bb293a46d61545bcae82a3b16520f360e6d',
resave:            false,
saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/** 1) Kick off Google OAuth **/
app.get('/auth/google',
passport.authenticate('google', { scope: ['profile','email'] })
);

/** 2) Google calls us back here **/
app.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/login', session: false }),
(req, res) => {
  const token = jwt.sign(
    { id: req.user.id, email: req.user.email },
    'some-very-strong-secret',
    { expiresIn: '2h' }
  );
  res.redirect('http://localhost:5173/dashboard');
}
);


apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  const startApp = async () => {
    try {
      //await connectProducers() ;
      // console.log("Kafka producer connected");
      // console.log(`Notification Service running on port ${PORT}`);
      //await runNotificationConsumer();
       await runConsumer().catch(err => {
        console.error('Notification consumer error:', err);
        process.exit(1);
      });
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
      });
    } catch (error) {
      console.error("Failed to connect Kafka producer", error);
    }
  };
  startApp();
});  


  

