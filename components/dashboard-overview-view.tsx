'use client';

import Link from 'next/link';
import type { OverviewResult, BenchmarkResult } from '@/lib/dashboard';
import { ANOMALY_LABELS, formatDateTime } from '@/lib/labels';
import { Card, SeverityBadge, VerdictPill } from '@/components/ui';
import { useLanguage } from '@/components/language-context';

const n = (x: number) => x.toLocaleString('en-IN');
const pct = (x: number | null) => (x === null ? '—' : `${(x * 100).toFixed(1)}%`);

interface DashboardOverviewViewProps {
  overview: OverviewResult;
  benchmark: BenchmarkResult;
}

export function DashboardOverviewView({ overview: o, benchmark: b }: DashboardOverviewViewProps) {
  const { t } = useLanguage();
  const maxType = Math.max(0, ...o.byType.map((item: any) => item.total));

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300">
            {t.dashboard.badge}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3F] mt-1 tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {t.dashboard.sub}
          </p>
        </div>

        <Link
          href="/dashboard/queue"
          className="inline-flex items-center gap-2 rounded-lg bg-[#0A194E] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#002147] transition self-start sm:self-auto"
        >
          <span>{t.dashboard.openQueueBtn} ({o.flags.open})</span>
          <span>→</span>
        </Link>
      </div>

      {/* 5-Card Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <div className="bg-white border-2 border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.dashboard.baselineRoll}
          </div>
          <div className="text-2xl font-black text-[#0B1E3F] mt-1 tabular-nums">{n(o.totals.v1)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t.dashboard.baselineSub}</div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.dashboard.revisedRoll}
          </div>
          <div className="text-2xl font-black text-[#0B1E3F] mt-1 tabular-nums">{n(o.totals.v2)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t.dashboard.revisedSub}</div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">
            {t.dashboard.removedRoll}
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1 tabular-nums">{n(o.totals.removedFromRoll)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t.dashboard.removedSub} ({n(o.totals.movedWithin)})</div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-bold text-[#046A38] uppercase tracking-wider">
            {t.dashboard.addedRoll}
          </div>
          <div className="text-2xl font-black text-[#046A38] mt-1 tabular-nums">{n(o.totals.newlyAdded)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{t.dashboard.addedSub}</div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-bold text-[#E65100] uppercase tracking-wider">
            {t.dashboard.awaitingReview}
          </div>
          <div className="text-2xl font-black text-[#E65100] mt-1 tabular-nums">{n(o.flags.open)}</div>
          <div className="text-[11px] text-amber-800 mt-0.5 font-medium">
            {t.dashboard.awaitingSub}: {n(o.flags.critical)} / {n(o.flags.high)}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pattern breakdown */}
        <Card className="border-2 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-[#0B1E3F]">{t.dashboard.patternsTitle}</h2>
            <span className="text-xs text-slate-500">{t.dashboard.patternsSub}: {o.flags.total}</span>
          </div>
          <div className="mt-4 space-y-3.5">
            {o.byType.length === 0 && <p className="text-sm text-slate-500">—</p>}
            {o.byType.map((item: any) => (
              <Link key={item.anomaly_type} href={`/dashboard/queue?type=${item.anomaly_type}&status=ALL`} className="block group">
                <div className="flex justify-between text-xs font-semibold text-slate-700 group-hover:text-[#0A194E]">
                  <span>{ANOMALY_LABELS[item.anomaly_type] ?? item.anomaly_type}</span>
                  <span className="tabular-nums text-slate-500">
                    {item.open_count} / {item.total}
                  </span>
                </div>
                <div className="mt-1 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0A194E] h-2 rounded-full transition-all"
                    style={{ width: `${maxType ? (item.total / maxType) * 100 : 0}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Detection Benchmark */}
        <Card className="border-2 border-slate-200 shadow-xs">
          <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-[#0B1E3F]">{t.dashboard.benchmarkTitle}</h2>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              {t.dashboard.benchmarkBadge}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-2xl font-black text-[#0B1E3F] tabular-nums">{pct(b.precision)}</p>
              <p className="text-[11px] text-slate-600 font-medium mt-1">{t.dashboard.precision}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <p className="text-2xl font-black text-emerald-800 tabular-nums">{pct(b.recall)}</p>
              <p className="text-[11px] text-emerald-800 font-bold mt-1">{t.dashboard.recall}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-2xl font-black text-[#0B1E3F] tabular-nums">
                {b.plantedTotal ? `${b.caught}/${b.plantedTotal}` : b.caught}
              </p>
              <p className="text-[11px] text-slate-600 font-medium mt-1">{t.dashboard.caught}</p>
            </div>
          </div>

          {b.byType.length > 0 && (
            <table className="mt-5 w-full text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-left text-slate-600 bg-slate-50">
                  <th className="py-2 px-2 font-bold">Category</th>
                  <th className="py-2 px-2 text-right font-bold">Benchmark</th>
                  <th className="py-2 px-2 text-right font-bold text-emerald-800">Caught</th>
                  <th className="py-2 px-2 text-right font-bold">Other</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {b.byType.map((r: any) => (
                  <tr key={r.anomaly_type} className="hover:bg-slate-50/50">
                    <td className="py-2 px-2 font-medium">{ANOMALY_LABELS[r.anomaly_type] ?? r.anomaly_type}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{r.planted}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-bold text-emerald-700">{r.caught}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-slate-500">{r.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      {/* Bottom Priority Flags & Claim Checks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-slate-200 shadow-xs">
          <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-[#0B1E3F]">{t.dashboard.topFlagsTitle}</h2>
            <Link href="/dashboard/queue" className="text-xs font-bold text-[#0A194E] hover:underline">
              {t.dashboard.topFlagsViewAll}
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-slate-100">
            {o.topFlags.length === 0 && <li className="py-2 text-sm text-slate-500">—</li>}
            {o.topFlags.map((f: any) => (
              <li key={f.id}>
                <Link href={`/dashboard/queue/${f.id}`} className="flex items-center gap-3 py-2.5 hover:bg-slate-50 rounded px-2 transition">
                  <SeverityBadge severity={f.severity} />
                  <span className="flex-1 text-xs sm:text-sm font-semibold text-slate-800">
                    {ANOMALY_LABELS[f.anomalyType] ?? f.anomalyType}
                    <span className="text-slate-500 font-normal"> · {f.acName ?? `AC ${f.acNo}`} Part {f.partNo}</span>
                  </span>
                  <span className="text-xs font-bold tabular-nums text-[#0A194E] bg-slate-100 px-2 py-0.5 rounded">
                    {Math.round(f.confidence * 100)}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-2 border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-[#0B1E3F]">{t.dashboard.recentClaimsTitle}</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {o.recentClaims.length === 0 && (
              <li className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded">
                नागरिक पोर्टल पर पूछे गए प्रश्नों का सत्यापन इतिहास यहां प्रदर्शित होगा।
              </li>
            )}
            {o.recentClaims.map((c: any) => (
              <li key={c.id}>
                <Link href={`/c/${c.id}`} className="block rounded-lg p-2.5 hover:bg-slate-50 border border-slate-100 transition">
                  <div className="flex items-center gap-2 text-xs">
                    <VerdictPill verdict={c.verdict} />
                    <span className="text-slate-400 font-mono text-[10px]">
                      {c.source.replace('_', ' ').toLowerCase()} · {c.language_code ?? '—'} · {formatDateTime(c.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-700 leading-relaxed font-medium">{c.official_explanation}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
