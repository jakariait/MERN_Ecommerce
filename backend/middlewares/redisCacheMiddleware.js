const { client } = require('../config/redisClient');

const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl;

  try {
    const data = await client.get(key);

    if (data !== null && data !== undefined) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(data);
    }

    const originalSend = res.send;
    res.send = (body) => {
      client
        .set(key, body, { EX: 3600 }) // Cache for 1 hour
        .catch((err) => console.error('Redis cache set error:', err));
      return originalSend.call(res, body);
    };
    next();
  } catch (err) {
    console.error('Redis error:', err);
    next();
  }
};

module.exports = cacheMiddleware;
