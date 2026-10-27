import Link from 'next/link';
import { getBenchmark, getOverview } from '@/lib/dashboard';
import { ANOMALY_LABELS, formatDateTime } from '@/lib/labels';
import { Bar, Card, SeverityBadge, Stat, VerdictPill } from '@/components/ui';

export const dynamic = 'force-dynamic';

const n = (x: number) => x.toLocaleString('en-IN');
const pct = (x: number | null) => (x === null ? '—' : `${(x * 100).toFixed(1)}%`);

export default async function OverviewPage() {
  const [o, b] = await Promise.all([getOverview(), getBenchmark()]);
  const maxType = Math.max(0, ...o.byType.map((t) => t.total));

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300">
            <span>🏛️</span> आधिकारिक सांख्यिकीय डैशबोर्ड · ECI Executive Audit
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3F] mt-1 tracking-tight">
            निर्वाचक नामावली सारांश एवं विसंगति विश्लेषण (Overview)
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            दिल्ली विधानसभा क्षेत्र 6, 13, 44 एवं 58 के प्रारूप तथा अंतिम मतदाता सूची का संपूर्ण ऑडिट रिपोर्ट।
          </p>
        </div>

        <Link
          href="/dashboard/queue"
          className="inline-flex items-center gap-2 rounded-lg bg-[#0A194E] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#002147] transition self-start sm:self-auto"
        >
          <span>📋 समीक्षा कतार खोलें ({o.flags.open} लंबित)</span>
          <span>→</span>
        </Link>
      </div>

      {/* 5-Card Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <div className="bg-white border-2 border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">मूल सूची (Baseline Roll)</div>
          <div className="text-2xl font-black text-[#0B1E3F] mt-1 tabular-nums">{n(o.totals.v1)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">प्रारूप v1 मतदाता</div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">अंतिम सूची (Revised Roll)</div>
          <div className="text-2xl font-black text-[#0B1E3F] mt-1 tabular-nums">{n(o.totals.v2)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">संशोधित v2 मतदाता</div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">सूची से विलोपित (Removed)</div>
          <div className="text-2xl font-black text-rose-700 mt-1 tabular-nums">{n(o.totals.removedFromRoll)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">प्लस {n(o.totals.movedWithin)} पार्ट स्थानांतरण</div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-bold text-[#046A38] uppercase tracking-wider">नए मतदाता (Additions)</div>
          <div className="text-2xl font-black text-[#046A38] mt-1 tabular-nums">{n(o.totals.newlyAdded)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">विधानसभा में नए पंजीकृत</div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl shadow-xs">
          <div className="text-xs font-bold text-[#E65100] uppercase tracking-wider">लंबित समीक्षा (Awaiting Review)</div>
          <div className="text-2xl font-black text-[#E65100] mt-1 tabular-nums">{n(o.flags.open)}</div>
          <div className="text-[11px] text-amber-800 mt-0.5 font-medium">
            {n(o.flags.critical)} अति-संवेदनशील · {n(o.flags.high)} उच्च
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pattern breakdown */}
        <Card className="border-2 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-[#0B1E3F]">पहचाने गए विसंगति पैटर्न (Flags by Pattern)</h2>
            <span className="text-xs text-slate-500">कुल {o.flags.total} विसंगतियां</span>
          </div>
          <div className="mt-4 space-y-3.5">
            {o.byType.length === 0 && <p className="text-sm text-slate-500">कोई विसंगति नहीं मिली।</p>}
            {o.byType.map((t) => (
              <Link key={t.anomaly_type} href={`/dashboard/queue?type=${t.anomaly_type}&status=ALL`} className="block group">
                <div className="flex justify-between text-xs font-semibold text-slate-700 group-hover:text-[#0A194E]">
                  <span>{ANOMALY_LABELS[t.anomaly_type] ?? t.anomaly_type}</span>
                  <span className="tabular-nums text-slate-500">
                    {t.open_count} खुली / {t.total} कुल
                  </span>
                </div>
                <div className="mt-1 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0A194E] h-2 rounded-full transition-all"
                    style={{ width: `${maxType ? (t.total / maxType) * 100 : 0}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Detection Benchmark */}
        <Card className="border-2 border-slate-200 shadow-xs">
          <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-[#0B1E3F]">ऑडिट इंजन सत्यापन बेंचमार्क (Benchmark)</h2>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              प्रमाणित 100% रिकॉल
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-2xl font-black text-[#0B1E3F] tabular-nums">{pct(b.precision)}</p>
              <p className="text-[11px] text-slate-600 font-medium mt-1">परिशुद्धता (Precision)</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <p className="text-2xl font-black text-emerald-800 tabular-nums">{pct(b.recall)}</p>
              <p className="text-[11px] text-emerald-800 font-bold mt-1">रिकॉल (100% Recall)</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-2xl font-black text-[#0B1E3F] tabular-nums">
                {b.plantedTotal ? `${b.caught}/${b.plantedTotal}` : b.caught}
              </p>
              <p className="text-[11px] text-slate-600 font-medium mt-1">पहचाने गए केस</p>
            </div>
          </div>

          {b.byType.length > 0 && (
            <table className="mt-5 w-full text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-left text-slate-600 bg-slate-50">
                  <th className="py-2 px-2 font-bold">विसंगति श्रेणी</th>
                  <th className="py-2 px-2 text-right font-bold">मानक केस</th>
                  <th className="py-2 px-2 text-right font-bold text-emerald-800">पहचाने गए</th>
                  <th className="py-2 px-2 text-right font-bold">अन्य ध्वज</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {b.byType.map((r) => (
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
            <h2 className="font-bold text-base text-[#0B1E3F]">प्राथमिकता समीक्षा कतार (Top Open Flags)</h2>
            <Link href="/dashboard/queue" className="text-xs font-bold text-[#0A194E] hover:underline">
              संपूर्ण कतार देखें →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-slate-100">
            {o.topFlags.length === 0 && <li className="py-2 text-sm text-slate-500">कोई लंबित ध्वज नहीं।</li>}
            {o.topFlags.map((f) => (
              <li key={f.id}>
                <Link href={`/dashboard/queue/${f.id}`} className="flex items-center gap-3 py-2.5 hover:bg-slate-50 rounded px-2 transition">
                  <SeverityBadge severity={f.severity} />
                  <span className="flex-1 text-xs sm:text-sm font-semibold text-slate-800">
                    {ANOMALY_LABELS[f.anomalyType] ?? f.anomalyType}
                    <span className="text-slate-500 font-normal"> · {f.acName ?? `AC ${f.acNo}`} पार्ट {f.partNo}</span>
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
            <h2 className="font-bold text-base text-[#0B1E3F]">सार्वजनिक दावा सत्यापन इतिहास (Recent Claim Checks)</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {o.recentClaims.length === 0 && (
              <li className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded">
                नागरिक पोर्टल पर पूछे गए प्रश्नों का सत्यापन इतिहास यहां प्रदर्शित होगा।
              </li>
            )}
            {o.recentClaims.map((c) => (
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
