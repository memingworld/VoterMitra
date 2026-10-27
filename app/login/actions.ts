'use server';

import { redirect } from 'next/navigation';
import { createSession, destroySession } from '@/lib/auth';
import { isRole } from '@/lib/labels';

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const name = String(formData.get('name') ?? '').trim();
  const role = String(formData.get('role') ?? '');

  if (name.length < 2 || name.length > 60) return { error: 'Enter your name (2 to 60 characters).' };
  if (!isRole(role)) return { error: 'Choose a role.' };

  await createSession({ name, role });
  redirect('/dashboard');
}

export async function logout() {
  await destroySession();
  redirect('/');
}
