'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/languages';
import { useLanguage } from '@/components/language-context';

interface GovHeaderProps {
  currentLang?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export function GovHeader({ currentLang: propLang, onLanguageChange: propOnChange }: GovHeaderProps) {
  const { lang: contextLang, setLang: contextSetLang, t } = useLanguage();
  const activeLang = propLang || contextLang;
  const handleLangChange = (code: LanguageCode) => {
    if (propOnChange) propOnChange(code);
    contextSetLang(code);
  };

  const pathname = usePathname();
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFontResize = (size: 'sm' | 'base' | 'lg') => {
    setFontSize(size);
    if (typeof document !== 'undefined') {
      if (size === 'sm') document.documentElement.style.fontSize = '14px';
      else if (size === 'base') document.documentElement.style.fontSize = '16px';
      else if (size === 'lg') document.documentElement.style.fontSize = '18px';
    }
  };

  const isHome = pathname === '/';
  const isDashboard = pathname === '/dashboard';
  const isQueue = pathname?.startsWith('/dashboard/queue');

  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-200">
      {/* 1. National Tricolor Top Strip (Saffron, White, Green) */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF671F]" title="Kesari / Deep Saffron" />
        <div className="flex-1 bg-white" title="White" />
        <div className="flex-1 bg-[#046A38]" title="India Green" />
      </div>

      {/* 2. Official Government Top Accessibility & Utility Bar */}
      <div className="bg-[#0b1728] text-slate-200 text-[11px] font-medium border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-1.5 flex flex-wrap items-center justify-between gap-3">
          {/* Government of India label */}
          <div className="flex items-center gap-2">
            <span className="inline-block w-3.5 h-2.5 bg-gradient-to-b from-[#FF671F] via-white to-[#046A38] rounded-[1px] shadow-xs" />
            <span className="font-semibold text-white tracking-wide">
              {activeLang === 'en-IN' ? 'Government of India' : 'भारत सरकार | Government of India'}
            </span>
            <span className="hidden sm:inline-block text-slate-400">·</span>
            <span className="hidden sm:inline-block text-slate-300">
              {activeLang === 'en-IN' ? 'National Electoral Roll Transparency Portal' : 'राष्ट्रीय मतदाता सेवा एवं सत्यापन पोर्टल'}
            </span>
          </div>

          {/* Accessibility controls & Language Picker */}
          <div className="flex items-center gap-3 ml-auto">
            {currentTime && (
              <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">
                🕒 {currentTime}
              </span>
            )}

            {/* Font Size Adjuster */}
            <div className="flex items-center border border-slate-700 rounded bg-slate-900/60 overflow-hidden text-[10px]">
              <button
                onClick={() => handleFontResize('sm')}
                className={`px-1.5 py-0.5 hover:bg-slate-700 transition ${fontSize === 'sm' ? 'bg-[#FF671F] text-white font-bold' : 'text-slate-300'}`}
                title="Decrease Text Size"
              >
                A-
              </button>
              <button
                onClick={() => handleFontResize('base')}
                className={`px-1.5 py-0.5 hover:bg-slate-700 transition border-x border-slate-700 ${fontSize === 'base' ? 'bg-slate-700 text-white font-bold' : 'text-slate-300'}`}
                title="Normal Text Size"
              >
                A
              </button>
              <button
                onClick={() => handleFontResize('lg')}
                className={`px-1.5 py-0.5 hover:bg-slate-700 transition ${fontSize === 'lg' ? 'bg-[#FF671F] text-white font-bold' : 'text-slate-300'}`}
                title="Increase Text Size"
              >
                A+
              </button>
            </div>

            {/* Language Selector (10 Scheduled Languages) */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">🌐</span>
              <select
                value={activeLang}
                onChange={(e) => handleLangChange(e.target.value as LanguageCode)}
                className="bg-slate-900 border border-slate-700 text-amber-300 rounded px-2 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label} ({item.englishName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official ECI Masthead with National Emblems */}
      <div className="bg-[#fcfaf7] border-b border-[#e9e3d8] py-3.5 px-4">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Ashoka Emblem / ECI Seal & Bilingual Title */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            {/* Ashoka Chakra & ECI Insignia Badge */}
            <div className="relative flex-shrink-0 w-13 h-13 rounded-full bg-gradient-to-tr from-[#002147] to-[#0A194E] p-0.5 shadow-md flex items-center justify-center text-white ring-2 ring-amber-500/40">
              <div className="w-11 h-11 rounded-full border border-amber-300/40 flex flex-col items-center justify-center">
                <span className="text-[17px] leading-none">☸</span>
                <span className="text-[8px] font-bold text-amber-200 uppercase tracking-tighter mt-0.5">ECI</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-base sm:text-lg font-bold text-[#0B1E3F] tracking-tight">
                  {t.portalTitle}
                </h1>
                <span className="text-slate-300 font-light">|</span>
                <span className="text-xs sm:text-sm font-semibold text-[#0B1E3F] tracking-wide uppercase">
                  Election Commission of India
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#E65100] mt-0.5">
                {t.portalSub}
              </div>
              <div className="text-[10px] text-slate-500 hidden sm:block">
                {t.nav.legalNotice}
              </div>
            </div>
          </div>

          {/* Right: Official Badges & Audit Status */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end border-r border-slate-300 pr-3 text-right">
              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[11px] font-bold border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                100% Recall Verified
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                दिल्ली रोल ऑडिट: 15,308 मतदाता
              </span>
            </div>

            {/* Emblem Seal Motif */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-xs">
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-800 leading-tight">सत्यमेव जयते</div>
                <div className="text-[8px] uppercase tracking-wider text-slate-500">Digital India</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Official Main Navigation Bar (Ashoka Navy) */}
      <nav className="bg-[#0A194E] text-white shadow-inner">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between text-xs sm:text-sm font-medium overflow-x-auto">
          <div className="flex items-center">
            <Link
              href="/"
              className={`px-3.5 py-2.5 flex items-center gap-1.5 whitespace-nowrap transition ${
                isHome
                  ? 'border-b-2 border-amber-400 bg-white/10 text-white font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🏛️</span>
              <span>{t.nav.home}</span>
            </Link>
            <Link
              href="/dashboard"
              className={`px-3.5 py-2.5 flex items-center gap-1.5 whitespace-nowrap transition ${
                isDashboard
                  ? 'border-b-2 border-amber-400 bg-white/10 text-white font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📊</span>
              <span>{t.nav.dashboard}</span>
            </Link>
            <Link
              href="/dashboard/queue"
              className={`px-3.5 py-2.5 flex items-center gap-1.5 whitespace-nowrap transition ${
                isQueue
                  ? 'border-b-2 border-amber-400 bg-white/10 text-white font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📋</span>
              <span>{t.nav.queue}</span>
            </Link>
          </div>

          <div className="flex items-center pl-2">
            <a
              href="https://t.me/VoterMitrabot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded bg-[#FF671F] px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-[#E65100] transition whitespace-nowrap"
            >
              <span>🤖</span>
              <span>{t.nav.bot}</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
