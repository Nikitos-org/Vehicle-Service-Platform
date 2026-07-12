import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { RedisService } from '../../../infrastructure/redis/redis.service.js';

@Injectable()
export class LoginAttemptService {
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly BLOCK_TTL_SECONDS = 5 * 60;
  private static readonly KEY_PREFIX = 'auth:login:fail';

  constructor(private readonly redisService: RedisService) {}

  async assertNotBlocked(email: string, ip?: string): Promise<void> {
    const client = await this.getClient();
    const key = this.getKey(email, ip);
    const attempts = Number((await client.get(key)) ?? 0);

    if (attempts < LoginAttemptService.MAX_ATTEMPTS) {
      return;
    }

    const ttl = await client.ttl(key);
    const secondsLeft = ttl > 0 ? ttl : LoginAttemptService.BLOCK_TTL_SECONDS;
    const minutesLeft = Math.ceil(secondsLeft / 60);

    throw new HttpException(
      `Too many failed login attempts. Try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`,
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  async recordFailure(email: string, ip?: string): Promise<void> {
    const client = await this.getClient();
    const key = this.getKey(email, ip);
    const attempts = await client.incr(key);

    if (attempts === 1) {
      await client.expire(key, LoginAttemptService.BLOCK_TTL_SECONDS);
    }
  }

  async reset(email: string, ip?: string): Promise<void> {
    const client = await this.getClient();
    const key = this.getKey(email, ip);

    await client.del(key);
  }

  private async getClient() {
    await this.redisService.connect();

    return this.redisService.getClient();
  }

  private getKey(email: string, ip?: string): string {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedIp = ip?.trim() || 'unknown';

    return `${LoginAttemptService.KEY_PREFIX}:${normalizedEmail}:${normalizedIp}`;
  }
}
