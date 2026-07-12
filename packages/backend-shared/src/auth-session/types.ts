import type { Request } from 'express';
import type { Session } from 'express-session';

export type SessionWithAccount = Session & {
  adminId?: string;
  accountId?: string;
};

export type RequestWithSession = Request & {
  session: SessionWithAccount;
};

export function getSessionActorId(session?: SessionWithAccount | null) {
  return session?.adminId ?? session?.accountId;
}
