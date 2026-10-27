'use client';

import { useActionState } from 'react';
import { login, type LoginState } from './actions';
import { ROLES } from '@/lib/labels';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form action={formAction} className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold">VoterMitra audit console</h1>
          <p className="text-sm text-slate-500">For election officials and observers.</p>
        </div>
        <label className="block">
          <span className="text-sm font-medium">Your name</span>
          <input name="name" required className="mt-1 w-full rounded-lg border border-slate-300 p-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Role</span>
          <select name="role" required defaultValue="" className="mt-1 w-full rounded-lg border border-slate-300 p-2">
            <option value="" disabled>
              Choose…
            </option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Passcode</span>
          <input name="passcode" type="password" required className="mt-1 w-full rounded-lg border border-slate-300 p-2" />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-slate-900 py-2 font-medium text-white disabled:opacity-50"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
        {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      </form>
    </main>
  );
}
