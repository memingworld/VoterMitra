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
      <div className="border-b border-slate-200 pb-4">
        <Link href="/dashboard/queue" className="text-xs font-bold text-[#0F2C59] hover:underline inline-flex items-center gap-1">
          <span>←</span>
          <span>{lang === 'en-IN' ? 'Back to Review Queue' : 'समीक्षा कतार पर वापस लौटें'}</span>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={flag.severity} />
          <StatusBadge status={flag.status} />
          <span className="text-xs text-slate-500 font-mono font-medium">Case Reference: #{flag.id.slice(0, 8)}</span>
        </div>
        <h1 className="mt-2 text-xl sm:text-2xl font-black text-[#0F2C59]">
          {ANOMALY_LABELS[flag.anomalyType] ?? flag.anomalyType}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
          {flag.acName ?? `AC ${flag.acNo}`} · Part {flag.partNo}
          {flag.sectionNo ? ` · Section ${flag.sectionNo}` : ''} · {flag.affectedCount.toLocaleString('en-IN')} {lang === 'en-IN' ? 'voters affected' : 'मतदाता प्रभावित'}
        </p>
      </div>

      {/* Dual-Hypothesis & Explainability Card */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2 border border-slate-200 shadow-2xs">
          <section className="bg-amber-50/50 p-4 rounded-r-lg border-l-4 border-l-amber-600 border-y border-r border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              {t.queue.hypothesisA}
            </h2>
            <p className="mt-1 leading-relaxed text-slate-900 text-xs sm:text-sm font-medium">{flag.primaryFinding}</p>
          </section>

          <section className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              {lang === 'en-IN' ? 'Statistical Significance (Robust Z-Score)' : 'सांख्यिकीय विचलन एवं रोबस्ट Z-स्कोर'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-800">
              {flag.zScore !== null ? (
                <>
                  Robust modified z-score of <strong className="text-rose-700 font-mono text-base">{flag.zScore}σ</strong> (Significance Threshold: 3.5σ).
                </>
              ) : (
                'Rule-based algorithmic check against Representation of the People Act standards.'
              )}
            </p>
          </section>

          <section className="bg-emerald-50/50 p-4 rounded-r-lg border-l-4 border-l-emerald-600 border-y border-r border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              {t.queue.hypothesisB}
            </h2>
            {flag.innocentExplanations.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-800">
                {flag.innocentExplanations.map((e: string) => (
                  <li key={e} className="flex gap-2 items-start">
                    <span className="text-[#15803D] font-bold">○</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-xs text-slate-500 italic">None recorded.</p>
            )}
          </section>
        </Card>

        <Card className="space-y-4 border border-slate-200 shadow-2xs">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'en-IN' ? 'Confidence Score' : 'विश्वसनीयता स्तर'}
            </p>
            <p className="text-3xl font-black text-[#0F2C59] tabular-nums mt-1">{Math.round(flag.confidence * 100)}%</p>
          </div>
          {breakdown.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'en-IN' ? 'Score Composition' : 'सांख्यिकीय भारांक'}
              </p>
              {breakdown.map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>{humanize(key)}</span>
                    <span className="tabular-nums font-bold">{value <= 1 ? `${Math.round(value * 100)}%` : value}</span>
                  </div>
                  <Bar value={value} max={maxWeight} className="bg-[#0F2C59]" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-2xs">
        <h2 className="font-bold text-sm text-[#0F2C59] uppercase tracking-wide">
          {lang === 'en-IN' ? 'Audit Evidence Table' : 'सांख्यिकीय साक्ष्य एवं मतदाता विवरण'}
        </h2>
        <p className="mb-4 text-xs text-slate-500">
          {lang === 'en-IN'
            ? 'Names partially redacted for privacy under DPDP Act 2023. Flags evaluate mathematical patterns, not individuals.'
            : 'गोपनीयता सुरक्षा हेतु नाम आंशिक रूप से छिपे हैं (DPDP Act 2023)। ऑडिट इंजन व्यक्तियों का नहीं बल्कि सांख्यिकीय पैटर्नों का विश्लेषण करता है।'}
        </p>
        <EvidenceViewer payload={flag.evidence} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border border-slate-200 shadow-2xs">
          <h2 className="mb-3 font-bold text-sm text-[#0F2C59] uppercase tracking-wide">
            {lang === 'en-IN' ? 'Record Auditor Decision' : 'अधिकारी निर्णय दर्ज करें (Record Decision)'}
          </h2>
          {canReview ? (
            <ReviewForm flagId={flag.id} role={reviewer.role} explanations={flag.innocentExplanations} />
          ) : (
            <p className="text-xs text-slate-500 italic">
              Observers can view flags and the decision trail but cannot record decisions.
            </p>
          )}
        </Card>

        <Card className="border border-slate-200 shadow-2xs">
          <h2 className="mb-3 font-bold text-sm text-[#0F2C59] uppercase tracking-wide">
            {lang === 'en-IN' ? 'Audit Trail & Prior Decisions' : 'निर्णय इतिहास एवं कार्य प्रगति (Decision Trail)'}
          </h2>
          {reviews.length > 0 ? (
            <ol className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="border-l-2 border-[#0F2C59] pl-3 text-xs sm:text-sm">
                  <p className="font-bold text-slate-900">{DECISION_META[r.decision as ReviewDecision]?.label ?? r.decision}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{r.justification}</p>
                  {r.innocentReasonAccepted && (
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                      स्वीकृत कारण: {r.innocentReasonAccepted}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    {r.reviewerName} ({r.reviewerRole}) · {formatDateTime(r.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-xs text-slate-500 italic">
              {lang === 'en-IN' ? 'No statutory decisions recorded yet.' : 'अभी तक कोई निर्णय दर्ज नहीं है।'}
            </p>
          )}
          <p className="mt-4 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
            विधिक संदर्भ: सभी निर्णय अपरिवर्तनीय (Immutable Audit Log) हैं। ECI Rule 21A compliant.
          </p>
        </Card>
      </div>
    </div>
  );
}
