import type { ReactNode } from 'react';
import { maskName } from '@/lib/queries';

// Keys whose values identify a person. Place names (ac_name, section_name...) stay readable.
// Adjust to match the keys your detector writes into evidence_payload.
const PERSON_KEYS =
  /^(name|names|full_name|voter_name|voter_names|name_clean|relation_name|relation_clean|relative_name|matched_names)$/i;
const MAX_ROWS = 50;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const humanize = (key: string) => key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

function maskDeep(value: unknown, key = ''): unknown {
  if (typeof value === 'string') return PERSON_KEYS.test(key) ? maskName(value) : value;
  if (Array.isArray(value)) return value.map((v) => maskDeep(v, key));
  if (isObj(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, maskDeep(v, k)]));
  return value;
}

function display(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value) && value.every((x) => typeof x !== 'object')) return value.join(', ');
  return JSON.stringify(value);
}

function renderValue(value: unknown): ReactNode {
  if (isObj(value) && ('before' in value || 'v1' in value) && ('after' in value || 'v2' in value)) {
    return <BeforeAfter before={value.before ?? value.v1} after={value.after ?? value.v2} />;
  }
  if (Array.isArray(value) && value.length > 0 && value.every(isObj)) {
    return <ObjectTable rows={value as Record<string, unknown>[]} />;
  }
  if (isObj(value)) return <KeyValues obj={value} />;
  return <p className="text-sm">{display(value)}</p>;
}

export function EvidenceViewer({ payload }: { payload: unknown }) {
  const safe = maskDeep(payload);
  if (safe === null || typeof safe !== 'object') {
    return <p className="text-sm text-slate-500">No evidence attached.</p>;
  }
  const sections: [string, unknown][] = Array.isArray(safe) ? [['rows', safe]] : Object.entries(safe);
  return (
    <div className="space-y-6">
      {sections.map(([key, value]) => (
        <section key={key}>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">{humanize(key)}</h3>
          {renderValue(value)}
        </section>
      ))}
    </div>
  );
}

function BeforeAfter({ before, after }: { before: unknown; after: unknown }) {
  if (isObj(before) && isObj(after)) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-slate-500">
            <th className="py-1 pr-4 font-medium">Field</th>
            <th className="py-1 pr-4 font-medium">Before (v1)</th>
            <th className="py-1 font-medium">After (v2)</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => {
            const changed = JSON.stringify(before[k]) !== JSON.stringify(after[k]);
            return (
              <tr key={k} className={changed ? 'bg-amber-50' : ''}>
                <td className="py-1 pr-4 text-slate-500">{humanize(k)}</td>
                <td className="py-1 pr-4">{display(before[k])}</td>
                <td className={`py-1 ${changed ? 'font-medium text-amber-900' : ''}`}>{display(after[k])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <p className="mb-1 text-xs font-medium text-slate-500">Before (v1)</p>
        {renderValue(before)}
      </div>
      <div>
        <p className="mb-1 text-xs font-medium text-slate-500">After (v2)</p>
        {renderValue(after)}
      </div>
    </div>
  );
}

function ObjectTable({ rows }: { rows: Record<string, unknown>[] }) {
  const columns = [...new Set(rows.flatMap((r) => Object.keys(r)))].slice(0, 10);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-slate-500">
            {columns.map((c) => (
              <th key={c} className="py-1 pr-4 font-medium">
                {humanize(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, MAX_ROWS).map((row, i) => (
            <tr key={i} className="border-b border-slate-100">
              {columns.map((c) => (
                <td key={c} className="py-1 pr-4">
                  {display(row[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > MAX_ROWS && (
        <p className="mt-2 text-xs text-slate-500">
          Showing {MAX_ROWS} of {rows.length} rows.
        </p>
      )}
    </div>
  );
}

function KeyValues({ obj }: { obj: Record<string, unknown> }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-slate-500">{humanize(k)}</dt>
          <dd>{display(v)}</dd>
        </div>
      ))}
    </dl>
  );
}
