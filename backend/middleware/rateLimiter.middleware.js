import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis.js';

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  store: new RedisStore({
    
    sendCommand: async (command, ...args) => {
      switch (command) {
        case 'INCR':
          return redis.incr(args[0]);
        case 'EXPIRE':
          return redis.expire(args[0], args[1]);
        case 'DEL':
          return redis.del(args[0]);
        case 'SCRIPT':
          if (args[0] === 'LOAD') {
            return redis.scriptLoad(args[1]);
          }
          if (args[0] === 'EXISTS') {
            return redis.scriptExists(...args.slice(1));
          }
          throw new Error(`Unsupported SCRIPT subcommand: ${args[0]}`);
        case 'EVALSHA':
          return redis.evalsha(args[0], args[1], ...args.slice(2));
        default:
          throw new Error(`Unsupported Redis command for Upstash: ${command}`);
      }
    },
  }),
});


export const postRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: async (command, ...args) => {
      switch (command) {
        case 'INCR':
          return redis.incr(args[0]);
        case 'EXPIRE':
          return redis.expire(args[0], args[1]);
        case 'DEL':
          return redis.del(args[0]);
        case 'SCRIPT':
          if (args[0] === 'LOAD') {
            return redis.scriptLoad(args[1]);
          }
          if (args[0] === 'EXISTS') {
            return redis.scriptExists(...args.slice(1));
          }
          throw new Error(`Unsupported SCRIPT subcommand: ${args[0]}`);
        case 'EVALSHA':
          return redis.evalsha(args[0], args[1], ...args.slice(2));
        default:
          throw new Error(`Unsupported Redis command for Upstash: ${command}`);
      }
    },
  }),
});

export const commentRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, 
  max: 30, 
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: async (command, ...args) => {
      switch (command) {
        case 'INCR':
          return redis.incr(args[0]);
        case 'EXPIRE':
          return redis.expire(args[0], args[1]);
        case 'DEL':
          return redis.del(args[0]);
        case 'SCRIPT':
          if (args[0] === 'LOAD') {
            return redis.scriptLoad(args[1]);
          }
          if (args[0] === 'EXISTS') {
            return redis.scriptExists(...args.slice(1));
          }
          throw new Error(`Unsupported SCRIPT subcommand: ${args[0]}`);
        case 'EVALSHA':
          return redis.evalsha(args[0], args[1], ...args.slice(2));
        default:
          throw new Error(`Unsupported Redis command for Upstash: ${command}`);
      }
    },
  }),
});

export const messageRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: async (command, ...args) => {
      switch (command) {
        case 'INCR':
          return redis.incr(args[0]);
        case 'EXPIRE':
          return redis.expire(args[0], args[1]);
        case 'DEL':
          return redis.del(args[0]);
        case 'SCRIPT':
          if (args[0] === 'LOAD') {
            return redis.scriptLoad(args[1]);
          }
          if (args[0] === 'EXISTS') {
            return redis.scriptExists(...args.slice(1));
          }
          throw new Error(`Unsupported SCRIPT subcommand: ${args[0]}`);
        case 'EVALSHA':
          return redis.evalsha(args[0], args[1], ...args.slice(2));
        default:
          throw new Error(`Unsupported Redis command for Upstash: ${command}`);
      }
    },
  }),
});

export default rateLimiter;