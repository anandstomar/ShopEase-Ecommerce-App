const redis = require('redis');
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL env var is required');
}

const client = redis.createClient(redisUrl);
  // host: 'localhost',
  // port: 6379,

client.on('error', (err) => {
  console.error('Redis error:', err);
});

(async () => {
  try {
    await client.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

module.exports = client;

