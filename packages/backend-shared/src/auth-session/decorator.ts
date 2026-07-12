import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

import { getSessionActorId, type RequestWithSession } from './types.js';

export const CurrentAdminId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestWithSession>();

    return getSessionActorId(request.session)!;
  },
);

export const CurrentAccountId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestWithSession>();

    return getSessionActorId(request.session)!;
  },
);
