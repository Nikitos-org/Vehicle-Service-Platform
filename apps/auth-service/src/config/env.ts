import { loadServiceEnv } from './load-env.js';

loadServiceEnv();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
  REDIS_URL: process.env.REDIS_URL,
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME ?? 'vsp.sid',
  SESSION_TTL_SECONDS: Number(
    process.env.SESSION_TTL_SECONDS ?? 60 * 60 * 24 * 7,
  ),
  SESSION_SECRET: process.env.SESSION_SECRET,
};
