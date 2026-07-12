import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import type {
  RequestWithSession,
  SessionWithAccount,
} from '@vsp/backend-shared/auth-session';
import type { Response } from 'express';

import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AuthService } from './services/auth.service.js';
import { SessionService } from './services/session.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto, @Req() request: RequestWithSession) {
    return this.authService.register(dto, request);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Req() request: RequestWithSession) {
    return this.authService.login(dto, request);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Session() session: SessionWithAccount,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(session);
    this.sessionService.clearCookie(response);
  }

  @Get('me')
  me(@Session() session: SessionWithAccount) {
    return this.authService.me(session);
  }
}
