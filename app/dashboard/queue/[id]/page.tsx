import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireReviewer } from '@/lib/auth';
import { getFlagDetail } from '@/lib/dashboard';
import { ANOMALY_LABELS, DECISION_META, REVIEW_DECISIONS, canDecide, formatDateTime, type ReviewDecision } from '@/lib/labels';
import { Bar, Card, SeverityBadge, StatusBadge } from '@/components/ui';
import { EvidenceViewer } from '@/components/evidence-viewer';
import { ReviewForm } from '@/components/review-form';

const humanize = (key: string) => key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export default async function FlagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [reviewer, detail] = await Promise.all([requireReviewer(), getFlagDetail(id)]);
  if (!detail) notFound();

  const { flag, reviews } = detail;
  const breakdown = Object.entries(flag.confidenceBreakdown).filter(
    (entry): entry is [string, number] => typeof entry[1] === 'number',
  );
  const maxWeight = breakdown.reduce((m, [, v]) => Math.max(m, v), 0);
  const canReview = REVIEW_DECISIONS.some((d) => canDecide(reviewer.role, d));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/queue" className="text-sm text-slate-500 hover:text-slate-800">
          ← Review queue
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={flag.severity} />
          <StatusBadge status={flag.status} />
          <span className="text-xs text-slate-400">Flag {flag.id.slice(0, 8)}</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold">{ANOMALY_LABELS[flag.anomalyType] ?? flag.anomalyType}</h1>
        <p className="text-slate-600">
          {flag.acName ?? `AC ${flag.acNo}`} · Part {flag.partNo}
          {flag.sectionNo ? ` · Section ${flag.sectionNo}` : ''} · {flag.affectedCount.toLocaleString('en-IN')} entries
          affected
        </p>
      </div>

      {/* Explainability card: what, why, innocent explanations, confidence */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-5 lg:col-span-2">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">What was found</h2>
            <p className="mt-1 leading-relaxed">{flag.primaryFinding}</p>
          </section>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why it is unusual</h2>
            <p className="mt-1 text-sm">
              {flag.zScore !== null ? (
                <>
                  Robust z-score of <strong>{flag.zScore}</strong> against comparable areas (review threshold 3.5).
                </>
              ) : (
                'Rule-based check (no z-score).'
              )}
            </p>
          </section>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Innocent explanations to rule out first
            </h2>
            {flag.innocentExplanations.length > 0 ? (
              <ul className="mt-2 space-y-1 text-sm">
                {flag.innocentExplanations.map((e) => (
                  <li key={e} className="flex gap-2">
                    <span className="text-emerald-600">○</span>
                    {e}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-500">None recorded.</p>
            )}
          </section>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Confidence</p>
            <p className="text-3xl font-semibold tabular-nums">{Math.round(flag.confidence * 100)}%</p>
          </div>
          {breakdown.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">How the score is built</p>
              {breakdown.map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{humanize(key)}</span>
                    <span className="tabular-nums">{value <= 1 ? `${Math.round(value * 100)}%` : value}</span>
                  </div>
                  <Bar value={value} max={maxWeight} className="bg-indigo-500" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold">Evidence</h2>
        <p className="mb-4 text-xs text-slate-500">Names are partly hidden: flags are about patterns, not individuals.</p>
        <EvidenceViewer payload={flag.evidence} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Record a decision</h2>
          {canReview ? (
            <ReviewForm flagId={flag.id} role={reviewer.role} explanations={flag.innocentExplanations} />
          ) : (
            <p className="text-sm text-slate-500">
              Observers can view flags and the decision trail but cannot record decisions.
            </p>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">Decision trail</h2>
          {reviews.length > 0 ? (
            <ol className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="border-l-2 border-slate-200 pl-3 text-sm">
                  <p className="font-medium">{DECISION_META[r.decision as ReviewDecision]?.label ?? r.decision}</p>
                  <p className="text-slate-600">{r.justification}</p>
                  {r.innocentReasonAccepted && (
                    <p className="text-xs text-emerald-700">Explanation confirmed: {r.innocentReasonAccepted}</p>
                  )}
                  <p className="text-xs text-slate-400">
                    {r.reviewerName} ({r.reviewerRole}) · {formatDateTime(r.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-500">No decisions yet.</p>
          )}
          <p className="mt-4 text-xs text-slate-400">Decisions are append-only and cannot be edited.</p>
        </Card>
      </div>
    </div>
  );
}
