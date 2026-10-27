'use client';

import { useActionState } from 'react';
import { login, type LoginState } from './actions';
import { ROLES } from '@/lib/labels';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <form action={formAction} className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">VoterMitra Audit Console</h1>
          <p className="text-xs text-slate-500 mt-1">Select an officer identity to access executive audits and field queues.</p>
        </div>
        <label className="block">
          <span className="text-xs font-semibold text-slate-700">Official Name</span>
          <input
            name="name"
            required
            defaultValue="Election Officer"
            placeholder="e.g. Rajesh Kumar"
            className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-slate-700">Designation / Role</span>
          <select
            name="role"
            required
            defaultValue="Senior Electoral Officer"
            className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-900 focus:outline-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-slate-900 py-2.5 font-semibold text-xs uppercase tracking-wider text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {pending ? 'Opening Console…' : 'Enter Audit Console'}
        </button>
        {state.error && <p className="text-xs text-red-700 font-medium">{state.error}</p>}
      </form>
    </main>
  );
}
