'use client';

import Link from 'next/link';
import { GovHeader } from '@/components/gov-header';
import { ClaimChecker } from '@/components/claim-checker';
import { useLanguage } from '@/components/language-context';

export default function HomePage() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* 1. Official National Government & ECI Header */}
      <GovHeader />

      {/* 2. Official Government Notice Strip */}
      <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-950 font-medium">
        <div className="mx-auto max-w-6xl w-full flex items-center gap-2.5 overflow-hidden">
          <span className="flex-shrink-0 inline-flex items-center gap-1 rounded bg-[#C2410C] text-white px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            <span>📢</span> {lang === 'en-IN' ? 'Official Gazette Notice' : 'आधिकारिक सूचना'}
          </span>
          <div className="truncate text-[11px] sm:text-xs text-amber-900">
            {t.flashNotice}
          </div>
        </div>
      </div>

      {/* 3. National Electoral Roll Benchmark Strip */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
                  {lang === 'en-IN' ? 'Verified Statistical Audit: ECI Benchmark' : 'सत्यापित सांख्यिकीय बेंचमार्क: ECI Roll Audit'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F2C59] mt-1 tracking-tight">
                {t.benchmarkTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {t.benchmarkSub}
              </p>
            </div>

            {/* Metric Strip Cards with Uniform Institutional Borders */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                <div className="text-xl sm:text-2xl font-bold text-[#0F2C59] tabular-nums">15,308</div>
                <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">{t.metricAudited}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                <div className="text-xl sm:text-2xl font-bold text-[#0F2C59] tabular-nums">23</div>
                <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">{t.metricBooths}</div>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-lg text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-800 tabular-nums">40 / 40</div>
                <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-0.5">{t.metricRecall}</div>
              </div>
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg text-center">
                <div className="text-xl sm:text-2xl font-bold text-[#C2410C] tabular-nums">0.84s</div>
                <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider mt-0.5">{t.metricSpeed}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 Official Blockchain Roll Integrity Strip (Clean Light Registry) */}
      <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 text-slate-800">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span className="font-bold text-[#0F2C59]">
              ⛓️ {lang === 'en-IN' ? 'Cryptographic Roll Integrity Register (Polygon Amoy PoS)' : 'ब्लॉकचेन रोल सत्यनिष्ठा रजिस्टर (Polygon Amoy PoS)'}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-600 text-[11px]">
              {lang === 'en-IN' ? '15,308 elector records mathematically sealed in Merkle Tree' : '15,308 मतदाता रिकॉर्ड मर्कल ट्री द्वारा ऑन-चेन प्रमाणित'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-500 text-[10px] font-sans font-semibold uppercase">Merkle Root:</span>
            <span className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-300 text-[10px]">
              0x9e4b7c1a...9e2f
            </span>
            <a
              href="https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B"
              target="_blank"
              rel="noreferrer"
              className="text-[#0F2C59] hover:underline font-bold text-[10px] ml-1"
            >
              {lang === 'en-IN' ? 'Verify on Explorer ↗' : 'एक्सप्लोरर सत्यापन ↗'}
            </a>
          </div>
        </div>
      </div>

      {/* 4. Main Body: Citizen Claim Verification Portal */}
      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-8">
        <ClaimChecker />

        {/* Feature Hub for Officer Console & Review Queue */}
        <div className="mt-12 grid gap-5 sm:grid-cols-3 border-t border-slate-200 pt-8">
          <Link
            href="/dashboard"
            className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-2xs hover:border-[#0F2C59] hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#0F2C59] uppercase tracking-wider">
              <span>🏛️ {lang === 'en-IN' ? 'Executive Wing' : 'प्रशासनिक कक्ष'}</span>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-slate-900">{t.cardConsoleTitle}</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {t.cardConsoleDesc}
            </p>
          </Link>

          <Link
            href="/dashboard/queue"
            className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-2xs hover:border-[#15803D] hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#15803D] uppercase tracking-wider">
              <span>📋 {lang === 'en-IN' ? 'Field Verification' : 'स्थलीय सत्यापन'}</span>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-slate-900">{t.cardQueueTitle}</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {t.cardQueueDesc}
            </p>
          </Link>

          <a
            href="https://t.me/VoterMitrabot"
            target="_blank"
            rel="noreferrer"
            className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-2xs hover:border-[#C2410C] hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#C2410C] uppercase tracking-wider">
              <span>🤖 {lang === 'en-IN' ? 'Citizen Voice Bot' : 'नागरिक वॉइस बॉट'}</span>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">↗</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-slate-900">{t.cardBotTitle}</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {t.cardBotDesc}
            </p>
          </a>
        </div>
      </main>

      {/* 5. Official Indian National Portal Footer */}
      <footer className="mt-auto bg-[#0F2C59] text-slate-200 border-t-4 border-[#FF671F]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-700/60 pb-6 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-lg">☸</span>
                <span className="font-bold text-white text-sm tracking-wide">
                  {t.footerTitle}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {t.footerDesc}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="bg-[#0A1F3D] px-3 py-1.5 rounded border border-slate-700 text-amber-200">
                Gnani Voice AI (48kHz)
              </span>
              <span className="bg-[#0A1F3D] px-3 py-1.5 rounded border border-slate-700 text-emerald-200">
                10 भारतीय भाषाएं
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-300 gap-2">
            <div>
              Designed for Election Commission of India / State Election Commissions Hackathon
            </div>
            <div>
              विधिक संदर्भ: लोक प्रतिनिधित्व अधिनियम 1950 एवं निर्वाचक रजिस्ट्रीकरण नियम 1960
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
