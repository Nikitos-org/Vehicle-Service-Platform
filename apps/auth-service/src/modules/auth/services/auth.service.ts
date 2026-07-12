import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type {
  RequestWithSession,
  SessionWithAccount,
} from '@vsp/backend-shared/auth-session';
import { getSessionActorId } from '@vsp/backend-shared/auth-session';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service.js';
import { AuthMapper } from '../auth.mapper.js';
import type { PublicAccount } from '../auth.types.js';
import type { LoginDto } from '../dto/login.dto.js';
import type { RegisterDto } from '../dto/register.dto.js';
import { LoginAttemptService } from './login-attempt.service.js';
import { PasswordService } from './password.service.js';
import { SessionService } from './session.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly loginAttemptService: LoginAttemptService,
    private readonly sessionService: SessionService,
    private readonly authMapper: AuthMapper,
  ) {}

  async register(
    dto: RegisterDto,
    request: RequestWithSession,
  ): Promise<PublicAccount> {
    const existingAccount = await this.prisma.admin.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
      },
    });

    if (existingAccount) {
      throw new ConflictException('Account with this email already exists');
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const account = await this.prisma.admin.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
      },
    });

    await this.startAuthenticatedSession(request, account.id);

    return this.authMapper.toPublicAccount(account);
  }

  async login(
    dto: LoginDto,
    request: RequestWithSession,
  ): Promise<PublicAccount> {
    await this.loginAttemptService.assertNotBlocked(dto.email, request.ip);

    const account = await this.prisma.admin.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!account) {
      await this.loginAttemptService.recordFailure(dto.email, request.ip);
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordService.verify(
      account.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      await this.loginAttemptService.recordFailure(dto.email, request.ip);
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.loginAttemptService.reset(dto.email, request.ip);

    this.assertAccountCanLogin(account);

    const updatedAccount = await this.prisma.admin.update({
      where: {
        id: account.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    await this.startAuthenticatedSession(request, updatedAccount.id);

    return this.authMapper.toPublicAccount(updatedAccount);
  }

  async logout(session: SessionWithAccount): Promise<void> {
    await this.sessionService.destroy(session);
  }

  async me(session: SessionWithAccount): Promise<PublicAccount> {
    const adminId = getSessionActorId(session);

    if (!adminId) {
      throw new UnauthorizedException('Authentication required');
    }

    const account = await this.prisma.admin.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!account) {
      throw new UnauthorizedException('Authentication required');
    }

    this.assertAccountCanLogin(account);

    return this.authMapper.toPublicAccount(account);
  }

  private assertAccountCanLogin(account: { isActive: boolean }) {
    if (!account?.isActive) {
      throw new ForbiddenException('Account is not active');
    }
  }

  private async startAuthenticatedSession(
    request: RequestWithSession,
    adminId: string,
  ) {
    const session = await this.sessionService.regenerate(request);
    session.adminId = adminId;
    session.accountId = adminId;
    await this.sessionService.save(session);
  }
}
