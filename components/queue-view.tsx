'use client';

import Link from 'next/link';
import type { FlagListItem } from '@/lib/dashboard';
import { ANOMALY_LABELS, ANOMALY_TYPES, SEVERITIES, STATUSES, STATUS_LABELS } from '@/lib/labels';
import { Card, SeverityBadge, StatusBadge } from '@/components/ui';
import { useLanguage } from '@/components/language-context';

interface QueueViewProps {
  flags: FlagListItem[];
  currentStatus: string;
  currentSeverity?: string;
  currentType?: string;
}

export function QueueView({
  flags,
  currentStatus,
  currentSeverity,
  currentType,
}: QueueViewProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-[#D97706] border border-amber-300">
            {t.queue.badge}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2C59] mt-1 tracking-tight">
            {t.queue.title}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {t.queue.sub}
          </p>
        </div>

        <div className="text-xs font-bold text-slate-700 bg-white px-3.5 py-2 rounded-lg border border-slate-300 shadow-2xs">
          {t.queue.totalCases}: <span className="text-[#0F2C59] font-black">{flags.length}</span>
        </div>
      </div>

      {/* Institutional Filter Form */}
      <form method="get" className="flex flex-wrap items-end gap-3 bg-slate-50 p-4 rounded-lg border border-slate-300 shadow-2xs">
        <label className="text-xs font-bold text-slate-700">
          <span className="block text-[11px] font-semibold text-slate-500 mb-1">{t.queue.statusLabel}</span>
          <select
            name="status"
            defaultValue={currentStatus}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-[#0F2C59] focus:outline-none"
          >
            <option value="OPEN">लंबित / Open Pending</option>
            <option value="ALL">सभी / All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-bold text-slate-700">
          <span className="block text-[11px] font-semibold text-slate-500 mb-1">{t.queue.severityLabel}</span>
          <select
            name="severity"
            defaultValue={currentSeverity ?? ''}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-[#0F2C59] focus:outline-none"
          >
            <option value="">सभी स्तर / Any</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-bold text-slate-700">
          <span className="block text-[11px] font-semibold text-slate-500 mb-1">{t.queue.patternLabel}</span>
          <select
            name="type"
            defaultValue={currentType ?? ''}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-[#0F2C59] focus:outline-none"
          >
            <option value="">सभी श्रेणियां / Any</option>
            {ANOMALY_TYPES.map((type) => (
              <option key={type} value={type}>
                {ANOMALY_LABELS[type]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="rounded bg-[#0F2C59] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#0A1E3F] transition uppercase tracking-wider cursor-pointer"
        >
          {t.queue.btnFilter}
        </button>
      </form>

      {/* Flag List */}
      <Card className="p-0 border border-slate-200 overflow-hidden shadow-2xs">
        {flags.length === 0 ? (
          <p className="p-8 text-xs text-slate-500 text-center font-medium italic">
            {t.queue.noCases}
          </p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {flags.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/dashboard/queue/${f.id}`}
                  className="grid gap-2 px-5 py-3.5 hover:bg-slate-50 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-4 transition group"
                >
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={f.severity} />
                    <StatusBadge status={f.status} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-slate-900 group-hover:text-[#0F2C59] transition">
                        {ANOMALY_LABELS[f.anomalyType] ?? f.anomalyType}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        · {f.acName ?? `AC ${f.acNo}`} Part {f.partNo}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-600 font-medium">
                      {f.primaryFinding}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div className="text-xs">
                      <div className="font-bold tabular-nums text-slate-900">
                        {f.affectedCount ? `${f.affectedCount.toLocaleString('en-IN')} voters` : '(None)'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Confidence {Math.round(f.confidence * 100)}%
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#0F2C59] bg-slate-100 px-3 py-1 rounded border border-slate-300 group-hover:bg-[#0F2C59] group-hover:text-white transition">
                      {t.queue.btnInspect} →
                    </span>
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
