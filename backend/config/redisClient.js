const redis = require('redis');

const client = redis.createClient({
    // Add your Redis configuration here
    // For example:
    // host: 'localhost',
    // port: 6379
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

client.connect().then(() => {
    console.log('Connected to Redis');
});

module.exports = client;
