'use client';

import Link from 'next/link';
import type { ReviewDecision } from '@/lib/labels';
import { ANOMALY_LABELS, DECISION_META, REVIEW_DECISIONS, canDecide, formatDateTime } from '@/lib/labels';
import { Bar, Card, SeverityBadge, StatusBadge } from '@/components/ui';
import { EvidenceViewer } from '@/components/evidence-viewer';
import { ReviewForm } from '@/components/review-form';
import { useLanguage } from '@/components/language-context';

const humanize = (key: string) => key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

interface FlagDetailViewProps {
  flag: any;
  reviews: any[];
  reviewer: { name: string; role: any };
}

export function FlagDetailView({ flag, reviews, reviewer }: FlagDetailViewProps) {
  const { lang, t } = useLanguage();

  const breakdown = Object.entries(flag.confidenceBreakdown).filter(
    (entry): entry is [string, number] => typeof entry[1] === 'number',
  );
  const maxWeight = breakdown.reduce((m, [, v]) => Math.max(m, v), 0);
  const canReview = REVIEW_DECISIONS.some((d) => canDecide(reviewer.role, d));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/queue" className="text-sm font-bold text-[#0A194E] hover:underline flex items-center gap-1">
          <span>←</span>
          <span>{lang === 'en-IN' ? 'Back to Review Queue' : 'समीक्षा कतार पर वापस लौटें'}</span>
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={flag.severity} />
          <StatusBadge status={flag.status} />
          <span className="text-xs text-slate-400 font-mono">Flag {flag.id.slice(0, 8)}</span>
        </div>
        <h1 className="mt-2 text-2xl font-black text-[#0B1E3F]">
          {ANOMALY_LABELS[flag.anomalyType] ?? flag.anomalyType}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm font-medium">
          {flag.acName ?? `AC ${flag.acNo}`} · Part {flag.partNo}
          {flag.sectionNo ? ` · Section ${flag.sectionNo}` : ''} · {flag.affectedCount.toLocaleString('en-IN')} {lang === 'en-IN' ? 'voters affected' : 'मतदाता प्रभावित'}
        </p>
      </div>

      {/* Dual-Hypothesis & Explainability Card */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-5 lg:col-span-2 border-2 border-slate-200">
          <section className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200">
            <h2 className="text-xs font-bold uppercase tracking-wide text-[#E65100]">
              {t.queue.hypothesisA}
            </h2>
            <p className="mt-1 leading-relaxed text-slate-900 text-sm font-medium">{flag.primaryFinding}</p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {lang === 'en-IN' ? 'Statistical Significance (Robust Z-Score)' : 'सांख्यिकीय विचलन एवं रोबस्ट Z-स्कोर'}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {flag.zScore !== null ? (
                <>
                  Robust modified z-score of <strong className="text-rose-700 font-mono text-base">{flag.zScore}σ</strong> (Threshold: 3.5σ).
                </>
              ) : (
                'Rule-based algorithmic check.'
              )}
            </p>
          </section>

          <section className="bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-200">
            <h2 className="text-xs font-bold uppercase tracking-wide text-[#046A38]">
              {t.queue.hypothesisB}
            </h2>
            {flag.innocentExplanations.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-sm text-slate-800">
                {flag.innocentExplanations.map((e: string) => (
                  <li key={e} className="flex gap-2 items-start">
                    <span className="text-[#046A38] font-bold">○</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-500">None recorded.</p>
            )}
          </section>
        </Card>

        <Card className="space-y-4 border-2 border-slate-200">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'en-IN' ? 'Confidence Score' : 'विश्वसनीयता स्तर'}
            </p>
            <p className="text-3xl font-black text-[#0B1E3F] tabular-nums mt-1">{Math.round(flag.confidence * 100)}%</p>
          </div>
          {breakdown.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'en-IN' ? 'Score Composition' : 'सांख्यिकीय भारांक'}
              </p>
              {breakdown.map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>{humanize(key)}</span>
                    <span className="tabular-nums font-bold">{value <= 1 ? `${Math.round(value * 100)}%` : value}</span>
                  </div>
                  <Bar value={value} max={maxWeight} className="bg-[#0A194E]" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="border-2 border-slate-200">
        <h2 className="font-bold text-base text-[#0B1E3F]">
          {lang === 'en-IN' ? 'Audit Evidence Table' : 'सांख्यिकीय साक्ष्य एवं मतदाता विवरण'}
        </h2>
        <p className="mb-4 text-xs text-slate-500">
          {lang === 'en-IN'
            ? 'Names partially redacted for privacy. Flags evaluate mathematical patterns, not individuals.'
            : 'गोपनीयता सुरक्षा हेतु नाम आंशिक रूप से छिपे हैं। ऑडिट इंजन व्यक्तियों का नहीं बल्कि सांख्यिकीय पैटर्नों का विश्लेषण करता है।'}
        </p>
        <EvidenceViewer payload={flag.evidence} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-2 border-slate-200">
          <h2 className="mb-3 font-bold text-base text-[#0B1E3F]">
            {lang === 'en-IN' ? 'Record Auditor Decision' : 'अधिकारी निर्णय दर्ज करें (Record Decision)'}
          </h2>
          {canReview ? (
            <ReviewForm flagId={flag.id} role={reviewer.role} explanations={flag.innocentExplanations} />
          ) : (
            <p className="text-sm text-slate-500">
              Observers can view flags and the decision trail but cannot record decisions.
            </p>
          )}
        </Card>

        <Card className="border-2 border-slate-200">
          <h2 className="mb-3 font-bold text-base text-[#0B1E3F]">
            {lang === 'en-IN' ? 'Audit Trail & Prior Decisions' : 'निर्णय इतिहास एवं कार्य प्रगति (Decision Trail)'}
          </h2>
          {reviews.length > 0 ? (
            <ol className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="border-l-2 border-slate-300 pl-3 text-sm">
                  <p className="font-bold text-slate-900">{DECISION_META[r.decision as ReviewDecision]?.label ?? r.decision}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{r.justification}</p>
                  {r.innocentReasonAccepted && (
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                      स्वीकृत कारण: {r.innocentReasonAccepted}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {r.reviewerName} ({r.reviewerRole}) · {formatDateTime(r.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-500">
              {lang === 'en-IN' ? 'No decisions recorded yet.' : 'अभी तक कोई निर्णय दर्ज नहीं है।'}
            </p>
          )}
          <p className="mt-4 text-xs text-slate-400">
            विधिक संदर्भ: सभी निर्णय अपरिवर्तनीय (Immutable Audit Log) हैं।
          </p>
        </Card>
      </div>
    </div>
  );
}
