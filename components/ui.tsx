import type { ReactNode } from 'react';
import { SEVERITY_STYLES, STATUS_LABELS, STATUS_STYLES, VERDICT_LABELS, VERDICT_PILL_STYLES } from '@/lib/labels';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-slate-200 bg-white p-5 shadow-2xs ${className}`}>{children}</div>;
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#0F2C59] tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-600 font-medium">{hint}</p>}
    </Card>
  );
}

export function Badge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}

export const SeverityBadge = ({ severity }: { severity: string }) => (
  <Badge className={SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.LOW}>{severity.toLowerCase()}</Badge>
);

export const StatusBadge = ({ status }: { status: string }) => (
  <Badge className={STATUS_STYLES[status] ?? STATUS_STYLES.PENDING}>{STATUS_LABELS[status] ?? status}</Badge>
);

export const VerdictPill = ({ verdict }: { verdict: string | null }) => (
  <Badge className={VERDICT_PILL_STYLES[verdict ?? 'INFO'] ?? VERDICT_PILL_STYLES.INFO}>
    {VERDICT_LABELS[verdict ?? 'INFO'] ?? verdict}
  </Badge>
);

export function Bar({ value, max, className = 'bg-slate-700' }: { value: number; max: number; className?: string }) {
  const pct = max > 0 && value > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div className={`h-2 rounded-full ${className}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
