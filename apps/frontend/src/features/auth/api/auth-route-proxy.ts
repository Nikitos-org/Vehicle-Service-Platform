import { NextResponse } from 'next/server';

import { makeAuthUrl } from '@/model/constants/server-url';

import 'server-only';

interface ProxyAuthRequestOptions {
  method: 'GET' | 'POST';
  path: string;
  request: Request;
}

export async function proxyAuthRequest({
  method,
  path,
  request,
}: ProxyAuthRequestOptions) {
  const headers = new Headers({
    Accept: 'application/json',
  });

  const contentType = request.headers.get('content-type');
  const cookie = request.headers.get('cookie');

  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  if (cookie) {
    headers.set('Cookie', cookie);
  }

  const init: RequestInit = {
    cache: 'no-store',
    headers,
    method,
  };

  if (method !== 'GET') {
    init.body = await request.text();
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(makeAuthUrl(path), init);
  } catch {
    return NextResponse.json(
      {
        error: 'Service Unavailable',
        message: 'Auth service is unavailable. Please try again in a moment.',
        statusCode: 503,
      },
      { status: 503 },
    );
  }

  const responseHeaders = new Headers();
  const responseContentType = backendResponse.headers.get('content-type');

  if (responseContentType) {
    responseHeaders.set('Content-Type', responseContentType);
  }

  const setCookies =
    typeof backendResponse.headers.getSetCookie === 'function'
      ? backendResponse.headers.getSetCookie()
      : [];

  if (setCookies.length > 0) {
    for (const setCookie of setCookies) {
      responseHeaders.append('Set-Cookie', setCookie);
    }
  } else {
    const setCookie = backendResponse.headers.get('set-cookie');

    if (setCookie) {
      responseHeaders.set('Set-Cookie', setCookie);
    }
  }

  const body = await backendResponse.text();

  return new NextResponse(body || null, {
    headers: responseHeaders,
    status: backendResponse.status,
  });
}
