import { Injectable } from '@nestjs/common';
import {
  getSessionCookieName,
  type RequestWithSession,
  type SessionWithAccount,
} from '@vsp/backend-shared/auth-session';
import type { Response } from 'express';

import { env } from '../../../config/env.js';

@Injectable()
export class SessionService {
  async regenerate(request: RequestWithSession): Promise<SessionWithAccount> {
    return new Promise<SessionWithAccount>((resolve, reject) => {
      request.session.regenerate((error) => {
        if (error) {
          reject(this.toError(error));
          return;
        }

        resolve(request.session);
      });
    });
  }

  async save(session: SessionWithAccount) {
    await new Promise<void>((resolve, reject) => {
      session.save((error) => {
        if (error) {
          reject(this.toError(error));
          return;
        }

        resolve();
      });
    });
  }

  async destroy(session: SessionWithAccount) {
    await new Promise<void>((resolve, reject) => {
      session.destroy((error) => {
        if (error) {
          reject(this.toError(error));
          return;
        }

        resolve();
      });
    });
  }

  clearCookie(response: Response) {
    response.clearCookie(
      getSessionCookieName(env.NODE_ENV, env.SESSION_COOKIE_NAME),
      {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
      },
    );
  }

  private toError(error: unknown) {
    return error instanceof Error
      ? error
      : new Error('Unexpected session error');
  }
}
