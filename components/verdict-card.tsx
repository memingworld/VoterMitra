import type { AssistantAnswer } from '@/lib/assistant';
import { strings, type BotLanguage } from '@/lib/telegram/i18n';

const VERDICT_THEMES = {
  VERIFIED: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-900',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    label: 'सत्यापित / VERIFIED IN OFFICIAL ROLL',
  },
  DISPUTED: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-900',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    label: 'विसंगति दर्ज / AUDIT ANOMALY DETECTED',
  },
  NOT_PROVABLE: {
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    text: 'text-slate-900',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    label: 'अपुष्ट / INSUFFICIENT DATA FOR CONCLUSIVE PROOF',
  },
} as const;

type CardAnswer = Pick<AssistantAnswer, 'verdict' | 'confidence' | 'summary' | 'reasoning' | 'sources'>;

export function VerdictCard({ answer, lang, question }: { answer: CardAnswer; lang: BotLanguage; question?: string }) {
  const s = strings[lang];
  const verdictKey = answer.verdict ?? 'NOT_PROVABLE';
  const theme = VERDICT_THEMES[verdictKey];

  return (
    <article className="overflow-hidden rounded-lg border-2 border-slate-300 bg-white shadow-2xs">
      {/* Tricolor Gazette Header Bar */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF671F]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#046A38]" />
      </div>

      {/* Gazette Insignia Header */}
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#0F2C59] font-serif font-black text-lg">⚖</span>
          <span className="text-xs font-black tracking-widest text-[#0F2C59] uppercase">
            भारत निर्वाचन आयोग · ELECTION COMMISSION OF INDIA
          </span>
        </div>
        <p className="text-[11px] font-bold text-slate-600 mt-0.5 tracking-tight">
          राष्ट्रीय मतदाता सूची सत्यापन एवं सत्यनिष्ठा प्रमाण-पत्र (Statutory Verification Certificate)
        </p>
        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
          Pursuant to Representation of the People Act 1950 (Sec 22/23) &amp; DPDP Act 2023
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Verdict Banner */}
        <div className={`p-4 rounded-lg border ${theme.border} ${theme.bg}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-black uppercase tracking-wider border ${theme.badge}`}>
              {theme.label}
            </span>
            {answer.confidence && (
              <span className="text-xs font-bold text-slate-600">
                {s.confidence}: <strong className="text-slate-900">{s.confidenceLevels[answer.confidence]}</strong>
              </span>
            )}
          </div>
          <p className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
            {answer.summary}
          </p>
        </div>

        {/* Citizen Query */}
        {question && (
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {s.youAsked} (Citizen Verification Request)
            </span>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-800 italic">
              &quot;{question}&quot;
            </p>
          </div>
        )}

        {/* Statutory Reasoning */}
        {answer.reasoning.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
              {s.basis} (Statutory Basis &amp; Roll Analysis)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {answer.reasoning.map((line, i) => (
                <li key={i} className="flex items-start gap-2.5 bg-slate-50/50 p-2.5 rounded border border-slate-200">
                  <span className="text-[#0F2C59] font-bold mt-0.5">§</span>
                  <span className="leading-relaxed font-medium">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cryptographic Seal */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-1.5 text-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 text-xs font-black">⛓</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
              ब्लॉकचेन सत्यनिष्ठा रजिस्टर (Polygon Amoy Roll Integrity)
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-600">
            Master Merkle Root: <span className="font-bold text-slate-900">0x9e4b7c1a8d3f5026b4...</span> (15,308 Electors)
          </p>
          <p className="text-[10px] text-slate-500">
            Smart Contract: <span className="font-mono text-slate-700">0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B</span> (Block #14892103)
          </p>
        </div>

        {/* Legal Disclaimer */}
        <p className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 leading-normal">
          {s.disclaimer}
        </p>
      </div>
    </article>
  );
}
