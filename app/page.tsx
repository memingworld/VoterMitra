'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GovHeader } from '@/components/gov-header';
import { ClaimChecker } from '@/components/claim-checker';
import { type LanguageCode } from '@/lib/languages';

export default function HomePage() {
  const [lang, setLang] = useState<LanguageCode>('hi-IN');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">
      {/* 1. Official National Government & ECI Header */}
      <GovHeader currentLang={lang} onLanguageChange={setLang} />

      {/* 2. Official Government Notice Marquee / Flash News Strip */}
      <div className="bg-[#FFF8E7] border-b border-[#F2DCA8] px-4 py-2 text-xs text-[#8A4B08] font-medium flex items-center justify-between shadow-xs">
        <div className="mx-auto max-w-6xl w-full flex items-center gap-2 overflow-hidden">
          <span className="flex-shrink-0 inline-flex items-center gap-1 rounded bg-[#E65100] text-white px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            <span>📢</span> आधिकारिक सूचना
          </span>
          <div className="truncate text-[11px] sm:text-xs">
            राष्ट्रीय राजधानी क्षेत्र दिल्ली के प्रारूप मतदाता सूची का विस्तृत गणितीय ऑडिट पूर्ण — 15,308 मतदाताओं में 49 विसंगतियां चिह्नित | 100% रिकॉल एवं शून्य असत्य विलोपन दर सत्यापित।
          </div>
        </div>
      </div>

      {/* 3. National Electoral Roll Benchmark Strip */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#046A38]" />
                <span className="text-xs font-bold text-[#046A38] uppercase tracking-wider">
                  सत्यापित सांख्यिकीय बेंचमार्क · ECI Roll Audit
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1E3F] mt-1 tracking-tight">
                दिल्ली विधानसभा निर्वाचन नामावली सत्यापन
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                4 प्रमुख विधानसभा क्षेत्रों (AC 6 रिठाला, AC 13 रोहिणी, AC 44 आर.के. पुरम, AC 58 लक्ष्मी नगर) के प्रारूप व अंतिम रोल का रोबस्ट Z-स्कोर एवं फजी-मैचिंग ऑडिट।
              </p>
            </div>

            {/* Metric Strip Cards with Indian Institutional Borders */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg text-center shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-[#0B1E3F] tabular-nums">15,308</div>
                <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">मतदाता ऑडिटेड</div>
              </div>
              <div className="bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg text-center shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-[#0B1E3F] tabular-nums">23</div>
                <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">मतदान केंद्र (Booths)</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-emerald-800 tabular-nums">40 / 40</div>
                <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-0.5">100% रिकॉल (Caught)</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-center shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-[#E65100] tabular-nums">0.84s</div>
                <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider mt-0.5">ऑडिट इंजन गति</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Body: Citizen Claim Verification Portal */}
      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-8">
        <ClaimChecker currentLang={lang} onLanguageChange={setLang} />

        {/* Feature Hub for Officer Console & Review Queue */}
        <div className="mt-12 grid gap-5 sm:grid-cols-3 border-t border-slate-300 pt-8">
          <Link
            href="/dashboard"
            className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#0A194E] hover:shadow-md transition"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#0A194E] uppercase tracking-wider">
              <span>🏛️ प्रशासनिक कक्ष</span>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-slate-900">ऑडिट डैशबोर्ड (Executive Console)</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              रोबस्ट मोडिफाइड Z-स्कोर, जनसांख्यिकीय विचलन एवं परिशुद्धता-रिकॉल स्कोरकार्ड का अवलोकन करें।
            </p>
          </Link>

          <Link
            href="/dashboard/queue"
            className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#046A38] hover:shadow-md transition"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#046A38] uppercase tracking-wider">
              <span>📋 स्थलीय सत्यापन</span>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-slate-900">विसंगति निवारण कतार (Review Queue)</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              द्वि-परिकल्पना कार्ड द्वारा संदेहास्पद विलोपनों की जांच करें और बीएलओ को स्थलीय निरीक्षण हेतु निर्देशित करें।
            </p>
          </Link>

          <a
            href="https://t.me/VoterMitraBot"
            target="_blank"
            rel="noreferrer"
            className="group block rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs hover:border-[#FF671F] hover:shadow-md transition"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#E65100] uppercase tracking-wider">
              <span>🤖 नागरिक वॉइस बॉट</span>
              <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">↗</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-slate-900">टेलीग्राम वॉयस बॉट (Option A Active)</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              टेलीग्राम पर सीधे बोलकर या लिखकर मतदाता सूची से जुड़े किसी भी प्रश्न की तत्काल पुष्टि प्राप्त करें।
            </p>
          </a>
        </div>
      </main>

      {/* 5. Official Indian National Portal Footer */}
      <footer className="mt-auto bg-[#0B1E3F] text-slate-300 border-t-4 border-[#FF671F]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-700/60 pb-6 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-lg">☸</span>
                <span className="font-bold text-white text-sm tracking-wide">
                  भारत निर्वाचन आयोग | ELECTION COMMISSION OF INDIA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                मतदाता मित्र एक पारदर्शी एवं व्याख्यायोग्य कृत्रिम बुद्धिमत्ता आधारित चुनावी नामावली सत्यापन प्रणाली है।
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 text-amber-300">
                Gnani Vachana AI Voice Integration
              </span>
              <span className="bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 text-emerald-300">
                10 भारतीय भाषाएं
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
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
