import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { GlobalExceptionFilter } from '@vsp/backend-shared/filters';
import { createPinoConfig, LoggingModule } from '@vsp/backend-shared/logger';

import { env } from './config/env.js';
import { PrismaModule } from './infrastructure/prisma/prisma.module.js';
import { RedisModule } from './infrastructure/redis/redis.module.js';
import { SessionModule } from './infrastructure/session/session.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { UsersModule } from './modules/users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggingModule.register(
      createPinoConfig({
        serviceName: 'user-service',
        level: env.LOG_LEVEL,
        nodeEnv: env.NODE_ENV,
        redactPaths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.body.password',
          'req.body.passwordHash',
          'res.headers["set-cookie"]',
        ],
      }),
    ),
    HealthModule,
    PrismaModule,
    RedisModule,
    SessionModule,
    UsersModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 20,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
