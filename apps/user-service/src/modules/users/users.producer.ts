import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { lastValueFrom } from 'rxjs';

import {
  RMQ_CLIENTS,
  RMQ_PATTERNS,
} from '../../infrastructure/rabbitmq/rabbitmq.constants.js';
import { UserCreatedEvent } from './users.types.js';

@Injectable()
export class UsersEventsPublisher {
  constructor(
    @Inject(RMQ_CLIENTS.USERS) private readonly rabbitClient: ClientProxy,
    private readonly logger: PinoLogger,
  ) {}

  async publishUserCreated(user: UserCreatedEvent) {
    try {
      await lastValueFrom(
        this.rabbitClient.emit(RMQ_PATTERNS.USER_CREATED, user),
      );
    } catch (error) {
      this.logger.error(
        {
          err: error,
          pattern: RMQ_PATTERNS.USER_CREATED,
          userId: user.id,
        },
        'Failed to publish user created event',
      );
      throw error;
    }
  }
}
