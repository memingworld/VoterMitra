import type { AssistantAnswer } from '@/lib/assistant';
import { strings, type BotLanguage } from '@/lib/telegram/i18n';

const VERDICT_BANNER = {
  VERIFIED: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  DISPUTED: 'border-amber-200 bg-amber-50 text-amber-900',
  NOT_PROVABLE: 'border-slate-200 bg-slate-100 text-slate-800',
} as const;

type CardAnswer = Pick<AssistantAnswer, 'verdict' | 'confidence' | 'summary' | 'reasoning' | 'sources'>;

export function VerdictCard({ answer, lang, question }: { answer: CardAnswer; lang: BotLanguage; question?: string }) {
  const s = strings[lang];
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {answer.verdict && (
        <div className={`border-b px-5 py-3 text-sm font-semibold ${VERDICT_BANNER[answer.verdict]}`}>
          {s.verdicts[answer.verdict]}
        </div>
      )}
      <div className="space-y-4 p-5">
        {question && (
          <p className="text-sm text-slate-500">
            {s.youAsked}: “{question}”
          </p>
        )}
        <p className="text-lg leading-relaxed">{answer.summary}</p>
        {answer.confidence && (
          <p className="text-sm">
            <span className="font-medium">{s.confidence}:</span> {s.confidenceLevels[answer.confidence]}
          </p>
        )}
        {answer.reasoning.length > 0 && (
          <div>
            <h3 className="mb-1 text-sm font-semibold text-slate-700">{s.basis}</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              {answer.reasoning.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        )}
        {answer.sources.length > 0 && <p className="text-xs text-slate-400">📎 {answer.sources.join(' · ')}</p>}
        {answer.reasoning.length > 0 && (
          <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">ℹ️ {s.disclaimer}</p>
        )}
      </div>
    </article>
  );
}
