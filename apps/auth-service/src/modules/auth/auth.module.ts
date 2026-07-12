import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller.js';
import { AuthMapper } from './auth.mapper.js';
import { AuthService } from './services/auth.service.js';
import { LoginAttemptService } from './services/login-attempt.service.js';
import { PasswordService } from './services/password.service.js';
import { SessionService } from './services/session.service.js';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    LoginAttemptService,
    SessionService,
    AuthMapper,
  ],
  exports: [AuthService],
})
export class AuthModule {}
