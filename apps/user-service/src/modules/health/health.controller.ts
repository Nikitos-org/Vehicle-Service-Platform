import { Controller, Get } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

import { env } from '../../config/env.js';
import { PrismaService } from '../../infrastructure/prisma/prisma.service.js';
import { RMQ_QUEUES } from '../../infrastructure/rabbitmq/rabbitmq.constants.js';
import { RedisHealthIndicator } from './indicators/redis.health.js';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly redisHealth: RedisHealthIndicator,
    private readonly microserviceHealth: MicroserviceHealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prismaService),
      () => this.redisHealth.pingCheck('redis'),
      () =>
        this.microserviceHealth.pingCheck('rabbitmq', {
          transport: Transport.RMQ,
          timeout: 1_000,
          options: {
            urls: [env.RABBITMQ_URL!],
            queue: RMQ_QUEUES.USERS,
            queueOptions: {
              durable: true,
            },
          },
        }),
    ]);
  }
}
