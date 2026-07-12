import { redirect } from 'next/navigation';

import { ApiError, fetchJson } from '@/api';
import { getRequestCookieHeader } from '@/features/auth/api/get-request-cookie-header';
import { routes } from '@/model/constants/routes';
import { makeAuthUrl } from '@/model/constants/server-url';

import 'server-only';

import type { PublicAccount } from '../model/schemas/auth.schemas';
import { publicAccountSchema } from '../model/schemas/auth.schemas';

async function getSessionHeaders(additionalHeaders?: HeadersInit) {
  const cookieHeader = await getRequestCookieHeader();

  return {
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    ...additionalHeaders,
  };
}

export async function getCurrentAccount(): Promise<PublicAccount | null> {
  try {
    return await fetchJson(
      makeAuthUrl(routes.backendEndpoints.auth.me),
      publicAccountSchema,
      {
        cache: 'no-store',
        headers: await getSessionHeaders(),
      },
    );
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return null;
    }

    if (isServiceUnavailableError(error)) {
      return null;
    }

    throw error;
  }
}

export async function requireCurrentAccount() {
  const account = await getCurrentAccount();

  if (!account) {
    redirect(routes.appRoutes.auth);
  }

  return account;
}

export async function ensureGuest() {
  const account = await getCurrentAccount();

  if (account) {
    redirect(routes.appRoutes.home);
  }
}

function isServiceUnavailableError(error: unknown) {
  return error instanceof TypeError && error.message === 'fetch failed';
}
