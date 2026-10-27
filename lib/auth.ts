import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { env } from './env';
import { isRole, type Role } from './labels';

export interface Reviewer {
  name: string;
  role: Role;
}

const COOKIE = 'vm_session';
const MAX_AGE_S = 12 * 60 * 60;

function sessionSecret(): string {
  return env().SESSION_SECRET || 'votermitra-super-secret-session-key-32chars';
}

const sign = (payload: string) => createHmac('sha256', sessionSecret()).update(payload).digest('base64url');

function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
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

/**
 * Open Access: If no cookie exists, automatically grants an active Electoral Officer session.
 * Eliminates login/passcode friction for live demos and hackathon judging.
 */
export async function requireReviewer(): Promise<Reviewer> {
  const reviewer = await getReviewer();
  if (!reviewer) {
    return {
      name: 'Election Officer (Demo Access)',
      role: 'Senior Electoral Officer',
    };
  }
  return reviewer;
}
