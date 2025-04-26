const redis = require('redis');

const REDIS_HOST = 'localhost';// 'redis' if using Docker Compose
const REDIS_PORT = 6379;

const client = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT
  }
});

client.on('error', err => {
  console.error('Redis error:', err);
});

(async () => {
  try {
    await client.connect();
    console.log(`✅ Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);
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

