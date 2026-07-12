import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { createClient, type RedisClientType } from 'redis';

import { env } from '../../config/env.js';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  private readonly client: RedisClientType;

  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(RedisService.name);
    this.client = createClient({
      url: env.REDIS_URL,
    });

    this.client.on('error', (error: Error) => {
      this.logger.error(error, 'Redis client error');
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      this.logger.info('Connecting to Redis');
      await this.client.connect();
      this.logger.info('Redis connection established');
    }
  }

  getClient() {
    return this.client;
  }

  async onApplicationShutdown() {
    if (this.client.isOpen) {
      this.logger.info('Closing Redis connection');
      await this.client.quit();
    }
  }
}
