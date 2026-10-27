'use server';

import { redirect } from 'next/navigation';
import { checkPasscode, createSession, destroySession } from '@/lib/auth';
import { isRole } from '@/lib/labels';

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const passcode = String(formData.get('passcode') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const role = String(formData.get('role') ?? '');

  const check = checkPasscode(passcode);
  if (check === 'unset') return { error: 'DASHBOARD_PASSCODE is not configured on the server.' };
  if (check === 'wrong') return { error: 'Incorrect passcode.' };
  if (name.length < 2 || name.length > 60) return { error: 'Enter your name (2 to 60 characters).' };
  if (!isRole(role)) return { error: 'Choose a role.' };

  await createSession({ name, role });
  redirect('/dashboard');
}

export async function logout() {
  await destroySession();
  redirect('/login');
}
