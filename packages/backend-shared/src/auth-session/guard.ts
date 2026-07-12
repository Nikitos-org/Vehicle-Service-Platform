import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { getSessionActorId, type RequestWithSession } from './types.js';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithSession>();

    if (!getSessionActorId(request.session)) {
      throw new UnauthorizedException('Authentication required');
    }

    return true;
  }
}
