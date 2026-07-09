import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export const setCache = async (key, value, expirySeconds = 3600) => {
  try {
    await redis.setex(key, expirySeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
    return false;
  }
};

export const getCache = async (key) => {
  try {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value);
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error(`Error deleting cache for key ${key}:`, error);
    return false;
  }
};

export const clearCachePattern = async (pattern) => {
  try {
    let cursor = 0;
    const keysToDelete = [];
    do {
      const result = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = result[0];
      const keys = result[1];
      if (keys.length > 0) {
        keysToDelete.push(...keys);
      }
    } while (cursor !== 0);
    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete);
    }
    return true;
  } catch (error) {
    console.error(`Error clearing cache pattern ${pattern}:`, error);
    return false;
  }
};

export { redis };
