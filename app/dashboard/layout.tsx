import Link from 'next/link';
import type { ReactNode } from 'react';
import { requireReviewer } from '@/lib/auth';
import { logout } from '@/app/login/actions';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const reviewer = await requireReviewer();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-4 py-3">
          <Link href="/dashboard" className="font-semibold">
            VoterMitra <span className="font-normal text-slate-400">· Audit console</span>
          </Link>
          <nav className="flex gap-4 text-sm text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-900">Overview</Link>
            <Link href="/dashboard/queue" className="hover:text-slate-900">Review queue</Link>
            <Link href="/" className="hover:text-slate-900">Public claim checker ↗</Link>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-slate-700">
              {reviewer.name} <span className="text-slate-400">· {reviewer.role}</span>
            </span>
            <form action={logout}>
              <button className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
        Synthetic test data. Flags are statistical patterns for human review, not findings of wrongdoing.
      </div>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
