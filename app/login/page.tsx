'use client';

import { useActionState } from 'react';
import { login, type LoginState } from './actions';
import { ROLES } from '@/lib/labels';
import Link from 'next/link';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#FDFBF7]">
      <div className="w-full max-w-md rounded-2xl border-2 border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Tricolor Ribbon */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#FF671F]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#046A38]" />
        </div>

        <div className="p-6 sm:p-8">
          <div className="text-center pb-5 border-b border-slate-100">
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-tr from-[#002147] to-[#0A194E] flex items-center justify-center text-white ring-2 ring-amber-500/40 text-xl font-mono shadow-md">
              ☸
            </div>
            <h1 className="text-lg font-bold text-[#0B1E3F] mt-3 tracking-tight">
              भारत निर्वाचन आयोग
            </h1>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ELECTION COMMISSION OF INDIA
            </div>
            <div className="text-xs font-bold text-[#E65100] mt-1">
              मतदाता मित्र — निर्वाचन अधिकारी नियंत्रण कक्ष
            </div>
          </div>

          <form action={formAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-700">अधिकारी का नाम (Officer Name)</span>
              <input
                name="name"
                required
                defaultValue="Electoral Registration Officer"
                placeholder="उदा. राजेश कुमार"
                className="mt-1 w-full rounded-lg border-2 border-slate-300 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-[#0A194E] focus:bg-white focus:outline-none transition shadow-inner"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-700">पदनाम / भूमिका (Designation &amp; Role)</span>
              <select
                name="role"
                required
                defaultValue="Senior Electoral Officer"
                className="mt-1 w-full rounded-lg border-2 border-slate-300 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-[#0A194E] focus:bg-white focus:outline-none transition shadow-inner"
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
              className="w-full rounded-lg bg-[#0A194E] py-2.5 font-bold text-xs uppercase tracking-wider text-white shadow hover:bg-[#002147] disabled:opacity-50 transition cursor-pointer"
            >
              {pending ? 'सत्र प्रारंभ हो रहा है…' : 'नियंत्रण कक्ष में प्रवेश करें (Enter Console)'}
            </button>

            {state.error && <p className="text-xs text-red-700 font-bold text-center">{state.error}</p>}

            <div className="pt-2 text-center">
              <Link href="/" className="text-xs font-bold text-[#0A194E] hover:underline">
                ← नागरिक दावा सत्यापन मुख्य पृष्ठ पर लौटें
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
