import { NextResponse, type NextRequest } from 'next/server';
import { env } from './env';
import { GnaniError } from './gnani';

export function checkDevAuth(req: NextRequest): NextResponse | null {
  const isProd = process.env.NODE_ENV === 'production';
  const secret = env().DEV_ROUTES_SECRET;
  const header = req.headers.get('x-dev-secret');

  if (isProd) {
    if (!secret || header !== secret) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
  } else {
    if (header && secret && header !== secret) {
      return NextResponse.json({ error: 'Unauthorized dev request' }, { status: 403 });
    }
  }
  return null;
}

export function errorResponse(err: unknown): NextResponse {
  console.error('[api error]', err);
  if (err instanceof GnaniError) {
    return NextResponse.json(
      { error: err.message, type: err.type },
      { status: err.status >= 400 && err.status < 600 ? err.status : 502 },
    );
  }
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  return NextResponse.json({ error: message }, { status: 500 });
}
