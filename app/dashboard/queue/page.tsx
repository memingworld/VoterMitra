import Link from 'next/link';
import { listFlags } from '@/lib/dashboard';
import { ANOMALY_LABELS, ANOMALY_TYPES, SEVERITIES, STATUSES, STATUS_LABELS } from '@/lib/labels';
import { Card, SeverityBadge, StatusBadge } from '@/components/ui';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const STATUS_FILTERS = ['OPEN', 'ALL', ...STATUSES] as const;

function Select({ name, label, value, options }: { name: string; label: string; value: string; options: [string, string][] }) {
  return (
    <label className="text-sm">
      <span className="block text-xs text-slate-500">{label}</span>
      <select name={name} defaultValue={value} className="mt-1 rounded-lg border border-slate-300 bg-white p-2">
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
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Review queue</h1>

      <form method="get" className="flex flex-wrap items-end gap-3">
        <Select
          name="status"
          label="Status"
          value={filters.status}
          options={[['OPEN', 'Open'], ['ALL', 'All'], ...STATUSES.map((s): [string, string] => [s, STATUS_LABELS[s]])]}
        />
        <Select
          name="severity"
          label="Severity"
          value={filters.severity ?? ''}
          options={[['', 'Any'], ...SEVERITIES.map((s): [string, string] => [s, s.toLowerCase()])]}
        />
        <Select
          name="type"
          label="Pattern"
          value={filters.type ?? ''}
          options={[['', 'Any'], ...ANOMALY_TYPES.map((t): [string, string] => [t, ANOMALY_LABELS[t]])]}
        />
        <button className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">Apply</button>
      </form>

      <Card className="p-0">
        {flags.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No flags match these filters.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {flags.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/dashboard/queue/${f.id}`}
                  className="grid gap-2 px-5 py-3 hover:bg-slate-50 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-4"
                >
                  <div className="flex gap-2">
                    <SeverityBadge severity={f.severity} />
                    <StatusBadge status={f.status} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">
                      {ANOMALY_LABELS[f.anomalyType] ?? f.anomalyType}
                      <span className="font-normal text-slate-500">
                        {' '}· {f.acName ?? `AC ${f.acNo}`} Part {f.partNo}
                      </span>
                    </p>
                    <p className="line-clamp-1 text-sm text-slate-600">{f.primaryFinding}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium tabular-nums">{Math.round(f.confidence * 100)}%</p>
                    <p className="text-xs text-slate-500">
                      {f.affectedCount} affected{f.z !== null ? ` · z ${f.z}` : ''}
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
