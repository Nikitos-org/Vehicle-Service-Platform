import { Injectable } from '@nestjs/common';
import {
  buildSessionMiddleware,
  SESSION_KEY_PREFIX,
} from '@vsp/backend-shared/auth-session';
import { RedisStore } from 'connect-redis';
import { PinoLogger } from 'nestjs-pino';

import { env } from '../../config/env.js';
import { RedisService } from '../redis/redis.service.js';

@Injectable()
export class SessionService {
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(SessionService.name);
  }

  async createMiddleware() {
    await this.redisService.connect();
    const redisClient = this.redisService.getClient();
    const store = new RedisStore({
      client: redisClient,
      prefix: SESSION_KEY_PREFIX,
      ttl: env.SESSION_TTL_SECONDS,
    });

    return buildSessionMiddleware({
      cookieName: env.SESSION_COOKIE_NAME,
      nodeEnv: env.NODE_ENV,
      secret: env.SESSION_SECRET!,
      store,
      ttlSeconds: env.SESSION_TTL_SECONDS,
    });
  }
}
