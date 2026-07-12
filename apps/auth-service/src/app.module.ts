import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '@vsp/backend-shared/filters';
import { createPinoConfig, LoggingModule } from '@vsp/backend-shared/logger';

import { env } from './config/env.js';
import { PrismaModule } from './infrastructure/prisma/prisma.module.js';
import { RedisModule } from './infrastructure/redis/redis.module.js';
import { SessionModule } from './infrastructure/session/session.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggingModule.register(
      createPinoConfig({
        serviceName: 'auth-service',
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
    RedisModule,
    SessionModule,
    AuthModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
