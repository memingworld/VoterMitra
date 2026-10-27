import Link from 'next/link';
import { listFlags } from '@/lib/dashboard';
import { ANOMALY_LABELS, ANOMALY_TYPES, SEVERITIES, STATUSES, STATUS_LABELS } from '@/lib/labels';
import { Card, SeverityBadge, StatusBadge } from '@/components/ui';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const STATUS_FILTERS = ['OPEN', 'ALL', ...STATUSES] as const;

function Select({ name, label, value, options }: { name: string; label: string; value: string; options: [string, string][] }) {
  return (
    <label className="text-xs font-semibold text-slate-700">
      <span className="block text-[11px] text-slate-500 mb-1">{label}</span>
      <select name={name} defaultValue={value} className="rounded-lg border-2 border-slate-300 bg-white p-2 text-xs font-medium focus:border-[#0A194E] focus:outline-none">
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function QueuePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const pick = <T extends string>(key: string, allowed: readonly T[]): T | undefined => {
    const raw = sp[key];
    return typeof raw === 'string' && (allowed as readonly string[]).includes(raw) ? (raw as T) : undefined;
  };

  const filters = {
    status: pick('status', STATUS_FILTERS) ?? 'OPEN',
    severity: pick('severity', SEVERITIES),
    type: pick('type', ANOMALY_TYPES),
  };
  const flags = await listFlags(filters);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-[#E65100] border border-amber-300">
            <span>🛡️</span> स्थलीय सत्यापन एवं बीएलओ कार्यभार
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3F] mt-1 tracking-tight">
            विसंगति निवारण एवं स्थलीय समीक्षा कतार (Review Queue)
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            संदेहास्पद विलोपन, अत्यधिक पता संकेंद्रण अथवा डुप्लीकेट कार्ड मामलों की जांच एवं BLO आदेश प्रणाली।
          </p>
        </div>

        <div className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs">
          कुल मामले: <span className="text-[#0A194E] font-black">{flags.length}</span>
        </div>
      </div>

      {/* Institutional Filter Form */}
      <form method="get" className="flex flex-wrap items-end gap-3 bg-white p-4 rounded-xl border-2 border-slate-200 shadow-xs">
        <Select
          name="status"
          label="समीक्षा स्थिति (Status)"
          value={filters.status}
          options={[['OPEN', 'लंबित (Open / Pending)'], ['ALL', 'सभी (All)'], ...STATUSES.map((s): [string, string] => [s, STATUS_LABELS[s]])]}
        />
        <Select
          name="severity"
          label="संवेदनशीलता (Severity)"
          value={filters.severity ?? ''}
          options={[['', 'सभी स्तर (Any)'], ...SEVERITIES.map((s): [string, string] => [s, s])]}
        />
        <Select
          name="type"
          label="विसंगति श्रेणी (Pattern)"
          value={filters.type ?? ''}
          options={[['', 'सभी श्रेणियां (Any)'], ...ANOMALY_TYPES.map((t): [string, string] => [t, ANOMALY_LABELS[t]])]}
        />
        <button className="rounded-lg bg-[#0A194E] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#002147] transition uppercase tracking-wider">
          फ़िल्टर लागू करें (Apply)
        </button>
      </form>

      {/* Flag List */}
      <Card className="p-0 border-2 border-slate-200 overflow-hidden shadow-xs">
        {flags.length === 0 ? (
          <p className="p-6 text-xs text-slate-500 text-center font-medium">
            इस फ़िल्टर मानदंड के अनुसार कोई विसंगति मामला नहीं मिला।
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {flags.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/dashboard/queue/${f.id}`}
                  className="grid gap-2 px-5 py-4 hover:bg-slate-50 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-4 transition"
                >
                  <div className="flex gap-2">
                    <SeverityBadge severity={f.severity} />
                    <StatusBadge status={f.status} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-slate-900">
                      {ANOMALY_LABELS[f.anomalyType] ?? f.anomalyType}
                      <span className="font-semibold text-slate-500">
                        {' '}· {f.acName ?? `AC ${f.acNo}`} पार्ट {f.partNo}
                      </span>
                    </p>
                    <p className="line-clamp-1 text-xs text-slate-600 mt-0.5">{f.primaryFinding}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-black tabular-nums text-[#0A194E] bg-slate-100 px-2 py-0.5 rounded inline-block">
                      {Math.round(f.confidence * 100)}% सांख्यिकीय भरोसा
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      {f.affectedCount} मतदाता प्रभावित{f.z !== null ? ` · Z = +${f.z}σ` : ''}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
