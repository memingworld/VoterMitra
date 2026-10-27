import Link from 'next/link';
import { getBenchmark, getOverview } from '@/lib/dashboard';
import { ANOMALY_LABELS, formatDateTime } from '@/lib/labels';
import { Bar, Card, SeverityBadge, Stat, VerdictPill } from '@/components/ui';

const n = (x: number) => x.toLocaleString('en-IN');
const pct = (x: number | null) => (x === null ? '—' : `${(x * 100).toFixed(1)}%`);

export default async function OverviewPage() {
  const [o, b] = await Promise.all([getOverview(), getBenchmark()]);
  const maxType = Math.max(0, ...o.byType.map((t) => t.total));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Baseline roll" value={n(o.totals.v1)} hint="voters in v1" />
        <Stat label="Revised roll" value={n(o.totals.v2)} hint="voters in v2" />
        <Stat
          label="Removed from roll"
          value={n(o.totals.removedFromRoll)}
          hint={`plus ${n(o.totals.movedWithin)} transfers between parts`}
        />
        <Stat label="New additions" value={n(o.totals.newlyAdded)} hint="new to the constituency" />
        <Stat
          label="Awaiting review"
          value={n(o.flags.open)}
          hint={`${n(o.flags.critical)} critical · ${n(o.flags.high)} high`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Flags by pattern</h2>
          <div className="mt-4 space-y-3">
            {o.byType.length === 0 && <p className="text-sm text-slate-500">No flags yet. Run the detector.</p>}
            {o.byType.map((t) => (
              <Link key={t.anomaly_type} href={`/dashboard/queue?type=${t.anomaly_type}&status=ALL`} className="block">
                <div className="flex justify-between text-sm">
                  <span>{ANOMALY_LABELS[t.anomaly_type] ?? t.anomaly_type}</span>
                  <span className="tabular-nums text-slate-500">
                    {t.open_count} open / {t.total}
                  </span>
                </div>
                <Bar value={t.total} max={maxType} className="bg-indigo-500" />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Detection benchmark</h2>
            <span className="text-xs text-slate-500">against planted test anomalies</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-semibold tabular-nums">{pct(b.precision)}</p>
              <p className="text-xs text-slate-500">Precision: flags that match a planted case</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tabular-nums">{pct(b.recall)}</p>
              <p className="text-xs text-slate-500">Recall: planted cases caught</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tabular-nums">
                {b.plantedTotal ? `${b.caught}/${b.plantedTotal}` : b.caught}
              </p>
              <p className="text-xs text-slate-500">{b.otherFlags} other flags (possible false alarms)</p>
            </div>
          </div>
          {b.byType.length > 0 ? (
            <table className="mt-5 w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-slate-500">
                  <th className="py-1 font-medium">Pattern</th>
                  <th className="py-1 text-right font-medium">Planted</th>
                  <th className="py-1 text-right font-medium">Caught</th>
                  <th className="py-1 text-right font-medium">Other flags</th>
                </tr>
              </thead>
              <tbody>
                {b.byType.map((r) => (
                  <tr key={r.anomaly_type} className="border-b border-slate-100">
                    <td className="py-1">{ANOMALY_LABELS[r.anomaly_type] ?? r.anomaly_type}</td>
                    <td className="py-1 text-right tabular-nums">{r.planted}</td>
                    <td className="py-1 text-right tabular-nums">{r.caught}</td>
                    <td className="py-1 text-right tabular-nums">{r.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-4 text-xs text-slate-500">
              Add the answer key to benchmark_scenarios for a per-pattern breakdown.
            </p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Highest-priority open flags</h2>
            <Link href="/dashboard/queue" className="text-sm text-indigo-600 hover:underline">
              Open queue →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-slate-100">
            {o.topFlags.length === 0 && <li className="py-2 text-sm text-slate-500">Nothing waiting for review.</li>}
            {o.topFlags.map((f) => (
              <li key={f.id}>
                <Link href={`/dashboard/queue/${f.id}`} className="flex items-center gap-3 py-2 hover:bg-slate-50">
                  <SeverityBadge severity={f.severity} />
                  <span className="flex-1 text-sm">
                    {ANOMALY_LABELS[f.anomalyType] ?? f.anomalyType}
                    <span className="text-slate-500"> · Part {f.partNo}</span>
                  </span>
                  <span className="text-sm tabular-nums text-slate-500">{Math.round(f.confidence * 100)}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-semibold">Recent public claim checks</h2>
          <ul className="mt-3 space-y-1">
            {o.recentClaims.length === 0 && <li className="text-sm text-slate-500">No claims checked yet.</li>}
            {o.recentClaims.map((c) => (
              <li key={c.id}>
                <Link href={`/c/${c.id}`} className="block rounded-lg p-2 hover:bg-slate-50">
                  <div className="flex items-center gap-2 text-xs">
                    <VerdictPill verdict={c.verdict} />
                    <span className="text-slate-400">
                      {c.source.replace('_', ' ').toLowerCase()} · {c.language_code ?? '—'} · {formatDateTime(c.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-700">{c.official_explanation}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
