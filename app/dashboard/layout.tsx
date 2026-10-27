import Link from 'next/link';
import type { ReactNode } from 'react';
import { requireReviewer } from '@/lib/auth';
import { logout } from '@/app/login/actions';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const reviewer = await requireReviewer();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">
      {/* 1. National Tricolor Top Ribbon */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF671F]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#046A38]" />
      </div>

      {/* 2. Official Utility Top Bar */}
      <div className="bg-[#0B1728] text-slate-200 text-[11px] font-medium border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-1.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-2 bg-gradient-to-b from-[#FF671F] via-white to-[#046A38] rounded-[1px]" />
            <span className="font-semibold text-white">
              भारत सरकार | Government of India — निर्वाचन अधिकारी नियंत्रण कक्ष
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-300 font-mono text-[10px]">
              🔒 सुरक्षित सत्र (Officer Session Active)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Official ECI Masthead */}
      <div className="bg-[#FCFAF7] border-b border-[#E9E3D8] py-3 px-4">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#002147] to-[#0A194E] p-0.5 shadow-md flex items-center justify-center text-white ring-2 ring-amber-500/40">
              <span className="text-lg">☸</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0B1E3F] text-base">भारत निर्वाचन आयोग</span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-semibold text-[#0B1E3F] uppercase tracking-wide">
                  ELECTION COMMISSION OF INDIA
                </span>
              </div>
              <div className="text-xs font-bold text-[#E65100]">
                मतदाता मित्र — निर्वाचन अधिकारी ऑडिट एवं स्थलीय निवारण कक्ष
              </div>
            </div>
          </div>

          {/* Officer identity badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">{reviewer.name}</div>
              <div className="text-[10px] font-semibold text-[#046A38]">{reviewer.role}</div>
            </div>
            <form action={logout}>
              <button className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs">
                सत्र समाप्त (Sign out)
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 4. Ashoka Navy Navigation Bar */}
      <nav className="bg-[#0A194E] text-white shadow-inner">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 hover:bg-white/10 text-white font-semibold flex items-center gap-1.5 transition"
            >
              <span>📊</span>
              <span>ऑडिट सारांश (Overview)</span>
            </Link>
            <Link
              href="/dashboard/queue"
              className="px-4 py-2.5 hover:bg-white/10 text-white font-semibold flex items-center gap-1.5 transition border-l border-white/10"
            >
              <span>📋</span>
              <span>समीक्षा कतार (Review Queue)</span>
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 text-amber-300 hover:bg-white/10 font-semibold flex items-center gap-1.5 transition border-l border-white/10"
            >
              <span>🏛️</span>
              <span>नागरिक दावा सत्यापन पोर्टल ↗</span>
            </Link>
          </div>
          <div className="text-[11px] text-emerald-300 hidden md:block">
            ● 15,308 मतदाता ऑडिटेड · 49 विसंगतियां
          </div>
        </div>
      </nav>

      {/* Notice Ribbon */}
      <div className="border-b border-amber-200 bg-[#FFF8E7] px-4 py-1.5 text-center text-xs text-[#8A4B08] font-medium">
        विधिक संदर्भ: लोक प्रतिनिधित्व अधिनियम 1950 एवं निर्वाचक रजिस्ट्रीकरण नियम 1960 के अंतर्गत सांख्यिकीय ऑडिट
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6 flex-1 w-full">{children}</main>

      {/* Official Government Footer */}
      <footer className="mt-auto bg-[#0B1E3F] text-slate-300 border-t-4 border-[#FF671F] py-6 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span>☸</span>
            <span className="font-semibold text-white">भारत निर्वाचन आयोग | ECI VoterMitra Executive Suite</span>
          </div>
          <div>NIC Standards & Digital India Compliance</div>
        </div>
      </footer>
    </div>
  );
}
