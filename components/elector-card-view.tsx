'use client';

import React from 'react';

interface Elector {
  index: number;
  name: string;
  badge: string;
  constituency: string;
  pollingStation: string;
  epic: string;
  relative: string;
  ageGender: string;
  rollStatus: string;
}

interface ElectorCardViewProps {
  text: string;
  lang?: string;
}

export function parseElectorResponse(text: string): { electors: Elector[]; headerText: string; extraText: string; privacyNotice: string } | null {
  if (!text || (!text.includes('👤') && !text.includes('Electoral Roll') && !text.includes('मतदाता सूची'))) {
    return null;
  }

  const electorBlocks = text.split(/👤\s*\*?[0-9]+\.\s*/).slice(1);
  if (electorBlocks.length === 0) {
    return null;
  }

  const lines = text.split('\n');
  const headerText = lines[0]?.replace(/[🔍*]/g, '').trim() || 'Official Electoral Roll Verification';

  const electors: Elector[] = [];

  let extraText = '';
  let privacyNotice = '';

  electorBlocks.forEach((block, idx) => {
    const bLines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const firstLine = bLines[0] || '';

    // Name and badge
    const badgeMatch = firstLine.match(/\[(.*?)\]/);
    const badge = badgeMatch ? badgeMatch[1] : '';
    const name = firstLine.replace(/\[.*?\]/, '').replace(/\*/g, '').trim();

    let constituency = '';
    let pollingStation = '';
    let epic = '';
    let relative = '';
    let ageGender = '';
    let rollStatus = '';

    bLines.forEach((l) => {
      const cleanL = l.replace(/^[•\s*-]+/, '').trim();
      const unstarred = cleanL.replace(/[*`]/g, '');

      if (/^(Constituency|विधानसभा|मतदारसंघ|নির্বাচনী|தொகுதி|నియోజకవర్గం|મતવિસ્તાર|ಕ್ಷೇತ್ರ|മണ്ഡലം|ਹਲਕਾ):/i.test(unstarred)) {
        const parts = unstarred.split(/:\s*/);
        constituency = parts.slice(1).join(': ').trim();
      } else if (/^(Polling Station|मतदान केंद्र|ভোটগ্রহণ|வாக்குச்சாவடி|పోలింగ్|મતદાન મથક|ಮತಗಟ್ಟೆ|പോളിംഗ്|ਪੋਲਿੰਗ):/i.test(unstarred)) {
        const parts = unstarred.split(/:\s*/);
        pollingStation = parts.slice(1).join(': ').trim();
      } else if (/^(EPIC|पहचान पत्र|ओळखपत्र|ভোটার কার্ড|வாக்காளர் அட்டை|ఓటరు కార్డు|ઓળખપત્ર|ಗುರುತಿನ ಚೀಟಿ|തിരിച്ചറിയൽ|ਪਛਾਣ ਪੱਤਰ)/i.test(unstarred)) {
        const parts = unstarred.split(/:\s*/);
        epic = parts.slice(1).join(': ').trim();
      } else if (/^(Relative|संबंधी|नातेवाईक|অভিভাবক|உறவினர்|సంబంధీకుడు|સંબંધી|ಸಂಬಂಧಿ|ബന്ധു|ਰਿਸ਼ਤੇਦਾਰ):/i.test(unstarred)) {
        const parts = unstarred.split(/:\s*/);
        relative = parts.slice(1).join(': ').trim();
      } else if (/^(Age\s*\/\s*Gender|आयु\s*\/\s*लिंग|वय|বয়স|வயது|వయస్సు|ઉંમર|ವಯಸ್ಸು|പ്രായം|ਉਮਰ)/i.test(unstarred)) {
        const parts = unstarred.split(/:\s*/);
        ageGender = parts.slice(1).join(': ').trim();
      } else if (/^(Roll Status|स्थिति|स्थिती|অবস্থা|நிலை|നില|ਸਥਿਤੀ):/i.test(unstarred)) {
        const parts = unstarred.split(/:\s*/);
        rollStatus = parts.slice(1).join(': ').trim();
      }
    });

    electors.push({
      index: idx + 1,
      name,
      badge,
      constituency,
      pollingStation,
      epic,
      relative,
      ageGender,
      rollStatus,
    });
  });

  // Check for overflow note
  const overflowMatch = text.match(/_(\.\.\.and [0-9]+ more.*?|\.\.\.तथा .*?)_/);
  if (overflowMatch) {
    extraText = overflowMatch[1];
  }

  // Check for privacy note
  const privacyMatch = text.match(/🔒\s*\*?(Privacy Notice|गोपनीयता सूचना|गोपनीयता|സ്വകാര്യതാ|ਪਰਦੇਦਾਰੀ|ગોપનીયતા|గోప్యతా|രഹസ്യത)[\s\S]*$/i);
  if (privacyMatch) {
    privacyNotice = privacyMatch[0].replace(/\*/g, '').trim();
  }

  return { electors, headerText, extraText, privacyNotice };
}

/**
 * Formats inline bold text and code backticks cleanly
 */
function renderFormattedInline(text: string) {
  // Split on bold *text* and `code`
  const parts = text.split(/(\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(1, -1)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-slate-100 text-slate-800 font-mono text-[11px] px-1.5 py-0.5 rounded border border-slate-200">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/**
 * Clean markdown typography renderer for non-elector answers
 */
export function CleanMarkdownView({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="space-y-3 text-sm text-slate-800 leading-relaxed font-sans">
      {paragraphs.map((p, pIdx) => {
        // If paragraph is a bullet list
        if (p.includes('\n•') || p.includes('\n-') || p.startsWith('•') || p.startsWith('-')) {
          const items = p.split(/\n?[•-]\s+/).map((item) => item.trim()).filter(Boolean);
          return (
            <ul key={pIdx} className="space-y-1.5 pl-1 my-2">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold select-none">•</span>
                  <span>{renderFormattedInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return <p key={pIdx}>{renderFormattedInline(p)}</p>;
      })}
    </div>
  );
}

export function ElectorCardView({ text, lang = 'hi-IN' }: ElectorCardViewProps) {
  const parsed = parseElectorResponse(text);

  if (!parsed || parsed.electors.length === 0) {
    return <CleanMarkdownView text={text} />;
  }

  const { electors, headerText, extraText, privacyNotice } = parsed;

  return (
    <div className="w-full space-y-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg">🛡️</span>
          <h3 className="text-xs sm:text-sm font-bold text-[#0B1E3F] tracking-tight">
            {headerText}
          </h3>
        </div>
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
          {electors.length} {lang === 'en-IN' ? (electors.length === 1 ? 'Record' : 'Records') : 'रिकॉर्ड'}
        </span>
      </div>

      {/* Elector Cards Grid */}
      <div className="space-y-3.5">
        {electors.map((e) => {
          const isDeleted = e.badge.includes('DELETED');
          const isDuplicate = e.badge.includes('DUPLICATE');

          let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
          let badgeIcon = '✅';
          let statusBorder = 'border-slate-200 hover:border-emerald-300';

          if (isDeleted) {
            badgeBg = 'bg-rose-50 text-rose-800 border-rose-300';
            badgeIcon = '⚠️';
            statusBorder = 'border-rose-200 bg-rose-50/20';
          } else if (isDuplicate) {
            badgeBg = 'bg-amber-50 text-amber-800 border-amber-300';
            badgeIcon = '⚠️';
            statusBorder = 'border-amber-200 bg-amber-50/20';
          }

          return (
            <div
              key={e.index}
              className={`rounded-xl border bg-white p-4 sm:p-5 shadow-xs transition ${statusBorder}`}
            >
              {/* Card Title & Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {e.index}
                  </span>
                  <span className="text-sm sm:text-base font-black text-[#0B1E3F] tracking-tight">
                    {e.name}
                  </span>
                </div>

                {e.badge && (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                    <span>{badgeIcon}</span>
                    <span>{e.badge.replace(/[✅⚠️]/g, '').trim()}</span>
                  </span>
                )}
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 py-3 text-xs">
                {/* Constituency */}
                <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                  <span className="text-sm">🏛️</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {lang === 'en-IN' ? 'Constituency' : 'विधानसभा क्षेत्र'}
                    </span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{e.constituency || '—'}</span>
                  </div>
                </div>

                {/* Polling Station */}
                <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                  <span className="text-sm">🏫</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {lang === 'en-IN' ? 'Polling Station' : 'मतदान केंद्र'}
                    </span>
                    <span className="font-bold text-slate-900 mt-0.5 block leading-tight">{e.pollingStation || '—'}</span>
                  </div>
                </div>

                {/* Masked EPIC */}
                <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                  <span className="text-sm">🪪</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {lang === 'en-IN' ? 'EPIC (Voter ID)' : 'पहचान पत्र (EPIC)'}
                    </span>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="font-mono font-bold bg-white text-slate-900 px-2 py-0.5 rounded border border-slate-200 text-xs">
                        {e.epic || '—'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">🔒 DPDP Masked</span>
                    </div>
                  </div>
                </div>

                {/* Relative */}
                <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                  <span className="text-sm">👨‍👩‍👦</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      {lang === 'en-IN' ? 'Relative / Guardian' : 'संबंधी का नाम'}
                    </span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{e.relative || '—'}</span>
                  </div>
                </div>

                {/* Age & Gender */}
                {e.ageGender && (
                  <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-100 flex items-start gap-2 sm:col-span-2">
                    <span className="text-sm">🎂</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        {lang === 'en-IN' ? 'Age & Gender' : 'आयु व लिंग'}
                      </span>
                      <span className="font-bold text-slate-900 mt-0.5 block">{e.ageGender}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status / Statutory Action Banner */}
              {e.rollStatus && (
                <div
                  className={`mt-1 p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                    isDeleted
                      ? 'bg-rose-50 border-rose-200 text-rose-900 font-medium'
                      : isDuplicate
                      ? 'bg-amber-50 border-amber-200 text-amber-900 font-medium'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                  }`}
                >
                  <span className="mt-0.5">{isDeleted || isDuplicate ? '⚠️' : '✅'}</span>
                  <div className="leading-relaxed">
                    <span className="font-bold block text-[11px] uppercase tracking-wider mb-0.5">
                      {lang === 'en-IN' ? 'Statutory Roll Status' : 'आधिकारिक नामावली स्थिति'}:
                    </span>
                    <span>{e.rollStatus}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overflow Notice if many records */}
      {extraText && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-center gap-2">
          <span>ℹ️</span>
          <span className="italic">{extraText}</span>
        </div>
      )}

      {/* Privacy Notice */}
      {privacyNotice && (
        <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center gap-2">
          <span>🔒</span>
          <span>{privacyNotice}</span>
        </div>
      )}
    </div>
  );
}
