import type { AssistantAnswer } from '@/lib/assistant';
import { strings, type BotLanguage } from '@/lib/telegram/i18n';

const VERDICT_BANNER = {
  VERIFIED: 'bg-emerald-600 text-white',
  DISPUTED: 'bg-rose-600 text-white',
  NOT_PROVABLE: 'bg-slate-700 text-white',
} as const;

type CardAnswer = Pick<AssistantAnswer, 'verdict' | 'confidence' | 'summary' | 'reasoning' | 'sources'>;

export function VerdictCard({ answer, lang, question }: { answer: CardAnswer; lang: BotLanguage; question?: string }) {
  const s = strings[lang];
  const verdictKey = answer.verdict ?? 'NOT_PROVABLE';
  const bannerStyle = VERDICT_BANNER[verdictKey];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {answer.verdict && (
        <div className={`flex items-center justify-between px-6 py-3.5 text-sm font-semibold tracking-wide ${bannerStyle}`}>
          <span>{s.verdicts[answer.verdict]}</span>
          <span className="text-xs uppercase tracking-wider opacity-90">Official Audit Verdict</span>
        </div>
      )}
      <div className="space-y-4 p-6 sm:p-7">
        {question && (
          <div className="border-b border-slate-100 pb-3">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              {s.youAsked}
            </span>
            <p className="mt-1 text-sm font-medium text-slate-700">“{question}”</p>
          </div>
        )}
        
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Audit Finding
          </span>
          <p className="mt-1 text-base sm:text-lg font-medium leading-relaxed text-slate-900">
            {answer.summary}
          </p>
        </div>

        {answer.confidence && (
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-700">
            <span className="font-semibold">{s.confidence}:</span>
            <span className="font-bold text-slate-950">{s.confidenceLevels[answer.confidence]}</span>
          </div>
        )}

        {answer.reasoning.length > 0 && (
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {s.basis}
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              {answer.reasoning.map((line, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {answer.sources.length > 0 && (
          <p className="text-[11px] text-slate-400">
            Data Source: {answer.sources.join(' · ')}
          </p>
        )}

        <p className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 leading-normal">
          {s.disclaimer}
        </p>
      </div>
    </article>
  );
}
