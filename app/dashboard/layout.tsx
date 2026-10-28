import type { ReactNode } from 'react';
import { requireReviewer } from '@/lib/auth';
import { logout } from '@/app/login/actions';
import { GovHeader } from '@/components/gov-header';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const reviewer = await requireReviewer();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* 1. Official Unified Government Masthead & Navigation with Language Selector */}
      <GovHeader />

      {/* 2. Official Officer Session & Security Strip */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs text-slate-800 font-medium">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#15803D]" />
            <span className="font-bold text-[#0F2C59]">
              🔒 सक्रिय अधिकारी सत्र (Officer Active): {reviewer.name}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-[#15803D] font-semibold">{reviewer.role}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] text-slate-600">
              ECI Roll Verification &amp; Field Remediation Console
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
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
      <footer className="mt-auto bg-[#0F2C59] text-slate-200 border-t-4 border-[#FF671F] py-6 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base text-amber-300">☸</span>
            <span className="font-semibold text-white">भारत निर्वाचन आयोग | ELECTION COMMISSION OF INDIA</span>
          </div>
          <div>National Voter Services Portal: NIC Standards &amp; Digital India Compliance</div>
        </div>
      </footer>
    </div>
  );
}
