import Link from 'next/link';
import { ClaimChecker } from '@/components/claim-checker';

export default function HomePage() {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'VoterMitraBot';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-base shadow-sm">
              VM
            </div>
            <div>
              <span className="font-semibold tracking-tight text-slate-950 text-base sm:text-lg">
                VoterMitra <span className="text-slate-400 font-normal">| मतदाता मित्र</span>
              </span>
              <span className="hidden sm:inline-block ml-2 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                Live Audit Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Audit Console
            </Link>
            <Link
              href="/dashboard/queue"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Review Queue
            </Link>
            {botUsername && (
              <a
                href={`https://t.me/${botUsername}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                <span>Telegram Bot</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero & Benchmark Metric Strip */}
      <section className="border-b border-slate-200 bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                Electoral Roll Verification & Anomaly Detection
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Mathematical audit of Delhi draft revisions across AC 6 (Rithala), AC 13 (Rohini), AC 44 (R.K. Puram), and AC 58 (Laxmi Nagar).
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div className="px-2">
                <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">15,308</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Electors</div>
              </div>
              <div className="px-2 border-l border-slate-200">
                <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">23</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Booths</div>
              </div>
              <div className="px-2 border-l border-slate-200">
                <div className="text-base sm:text-lg font-bold text-emerald-700 tabular-nums">40 / 40</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Caught (100%)</div>
              </div>
              <div className="px-2 border-l border-slate-200">
                <div className="text-base sm:text-lg font-bold text-indigo-700 tabular-nums">0.84s</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Engine Speed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Claim Checker Section */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <ClaimChecker />

        {/* Feature Cards Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 border-t border-slate-200 pt-8">
          <Link
            href="/dashboard"
            className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Administrative Suite
              </span>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-900">Executive Audit Dashboard</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Inspect statistical modified z-scores, localized demographic distortions, and precision-recall benchmark metrics.
            </p>
          </Link>

          <Link
            href="/dashboard/queue"
            className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Field Operations
              </span>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-900">Auditor Review Queue</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Triage open flags with dual-hypothesis explanation cards, review innocent reasons, and dispatch Booth Level Officers.
            </p>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 space-y-1">
          <p>
            VoterMitra operates on deterministic whitelisted database queries and explainable machine-checked statistical tests.
          </p>
          <p className="text-slate-400">
            Powered by Next.js Fluid Compute · PostgreSQL · Gnani Voice AI · Vachana TTS
          </p>
        </footer>
      </main>
    </div>
  );
}
