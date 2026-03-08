const redis = require('redis');
require('dotenv').config();

// const REDIS_HOST = 'red-d5eft6ngi27c73avusd0';
// const REDIS_PORT = 6379;

// const client = redis.createClient({
//   socket: {
//     host: REDIS_HOST,
//     port: REDIS_PORT
//   }
// });

const REDIS_URL = process.env.REDIS_URL; 

const client = redis.createClient({
  url: REDIS_URL
});

client.on('error', err => {
  console.error('Redis error:', err);
});

(async () => {
  try {
    await client.connect();
    //console.log(`✅ Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);
    console.log(`✅ Connected to Redis at ${REDIS_URL}`);
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

module.exports = client;




// const redis = require('redis');

// const client = redis.createClient({
//   host: 'localhost',
//   port: 6379,
// });

// client.on('error', (err) => {
//   console.error('Redis error:', err);
// });

// (async () => {
//   try {
//     await client.connect();
//     console.log('Connected to Redis');
//   } catch (err) {
//     console.error('Error connecting to Redis:', err);
//   }
// })();

// module.exports = client;

