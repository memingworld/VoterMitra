import { listFlags } from '@/lib/dashboard';
import { ANOMALY_TYPES, SEVERITIES, STATUSES } from '@/lib/labels';
import { QueueView } from '@/components/queue-view';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const STATUS_FILTERS = ['OPEN', 'ALL', ...STATUSES] as const;

export default async function QueuePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const pick = <T extends string>(key: string, allowed: readonly T[]): T | undefined => {
    const raw = sp[key];
    return typeof raw === 'string' && (allowed as readonly string[]).includes(raw) ? (raw as T) : undefined;
  };

  const status = pick('status', STATUS_FILTERS) ?? 'OPEN';
  const severity = pick('severity', SEVERITIES);
  const type = pick('type', ANOMALY_TYPES);

  const filters = {
    status,
    severity,
    type,
  };
  const flags = await listFlags(filters);

  return (
    <QueueView
      flags={flags}
      currentStatus={status}
      currentSeverity={severity}
      currentType={type}
    />
  );
}
