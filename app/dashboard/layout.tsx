import type { ReactNode } from 'react';
import { requireReviewer } from '@/lib/auth';
import { logout } from '@/app/login/actions';
import { GovHeader } from '@/components/gov-header';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const reviewer = await requireReviewer();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">
      {/* 1. Official Unified Government Masthead & Navigation with Language Selector */}
      <GovHeader />

      {/* 2. Official Officer Session & Security Strip */}
      <div className="bg-[#FFF8E7] border-b border-[#F2DCA8] px-4 py-2 text-xs text-[#8A4B08] font-medium shadow-xs">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-bold text-slate-900">
              🔒 सक्रिय अधिकारी सत्र (Officer Active): {reviewer.name}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-[#046A38] font-semibold">{reviewer.role}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] text-slate-600">
              ECI Roll Verification & Field Remediation Console
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded border border-amber-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition cursor-pointer"
              >
                सत्र समाप्त (Sign out)
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-6 flex-1 w-full">{children}</main>

      {/* Official Government Footer */}
      <footer className="mt-auto bg-[#0B1E3F] text-slate-300 border-t-4 border-[#FF671F] py-6 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base text-amber-300">☸</span>
            <span className="font-semibold text-white">भारत निर्वाचन आयोग | ELECTION COMMISSION OF INDIA</span>
          </div>
          <div>National Voter Services Portal · NIC Standards & Digital India Compliance</div>
        </div>
      </footer>
    </div>
  );
}
