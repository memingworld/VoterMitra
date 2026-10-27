import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { env } from './env';
import { isRole, type Role } from './labels';

export interface Reviewer {
  name: string;
  role: Role;
}

const COOKIE = 'vm_session';
const MAX_AGE_S = 12 * 60 * 60;

function sessionSecret(): string {
  const secret = env().SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set (min 32 characters)');
  return secret;
}

const sign = (payload: string) => createHmac('sha256', sessionSecret()).update(payload).digest('base64url');

/** Constant-time comparison of two strings of any length. */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}

export function checkPasscode(input: string): 'ok' | 'wrong' | 'unset' {
  const expected = env().DASHBOARD_PASSCODE;
  if (!expected) return 'unset';
  return safeEqual(input, expected) ? 'ok' : 'wrong';
}

export async function createSession(reviewer: Reviewer): Promise<void> {
  const payload = Buffer.from(
    JSON.stringify({ name: reviewer.name, role: reviewer.role, exp: Date.now() + MAX_AGE_S * 1000 }),
  ).toString('base64url');

  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_S,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function getReviewer(): Promise<Reviewer | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;

  const [payload, signature] = raw.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<string, unknown>;
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    if (typeof data.name !== 'string' || typeof data.role !== 'string' || !isRole(data.role)) return null;
    return { name: data.name, role: data.role };
  } catch {
    return null;
  }
}

export async function requireReviewer(): Promise<Reviewer> {
  const reviewer = await getReviewer();
  if (!reviewer) redirect('/login');
  return reviewer;
}
