import type { ReactNode } from 'react';

export function maskName(name: string): string {
  if (!name) return '-';
  return name
    .split(/\s+/)
    .map((part) => {
      if (part.length <= 2) return part[0] + '*';
      return part[0] + '***' + part[part.length - 1];
    })
    .join(' ');
}

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
  if (value === null || value === undefined) return '-';
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
  return <p className="text-xs font-mono">{display(value)}</p>;
}

export function EvidenceViewer({ payload }: { payload: unknown }) {
  const safe = maskDeep(payload);
  if (safe === null || typeof safe !== 'object') {
    return <p className="text-xs text-slate-500 italic">No evidence attached.</p>;
  }
  const sections: [string, unknown][] = Array.isArray(safe) ? [['rows', safe]] : Object.entries(safe);
  return (
    <div className="space-y-5">
      {sections.map(([key, value]) => (
        <section key={key}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">{humanize(key)}</h3>
          {renderValue(value)}
        </section>
      ))}
    </div>
  );
}

function ObjectTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (rows.length === 0) return null;
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const truncated = rows.length > MAX_ROWS;
  const slice = rows.slice(0, MAX_ROWS);

  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-200 bg-slate-100 text-slate-700">
          <tr>
            {cols.map((c) => (
              <th key={c} className="py-2 px-3 font-bold">
                {humanize(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white font-mono text-slate-800">
          {slice.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50">
              {cols.map((c) => (
                <td key={c} className="py-2 px-3">
                  {display(r[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {truncated && (
        <p className="p-2 text-[11px] text-slate-500 bg-slate-50 border-t border-slate-200">
          Showing {MAX_ROWS} of {rows.length} rows.
        </p>
      )}
    </div>
  );
}

function KeyValues({ obj }: { obj: Record<string, unknown> }) {
  return (
    <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} className="rounded border border-slate-200 bg-white p-2.5 shadow-2xs">
          <dt className="text-[11px] font-semibold text-slate-500">{humanize(k)}</dt>
          <dd className="mt-0.5 font-mono text-slate-800 font-medium">{display(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

function BeforeAfter({ before, after }: { before: unknown; after: unknown }) {
  return (
    <div className="grid gap-3 text-xs sm:grid-cols-2">
      <div className="rounded border border-rose-200 bg-rose-50/50 p-3">
        <p className="mb-1 font-bold text-rose-800 uppercase tracking-wider text-[11px]">Before (Baseline Roll)</p>
        <div className="font-mono text-slate-800">{renderValue(before)}</div>
      </div>
      <div className="rounded border border-emerald-200 bg-emerald-50/50 p-3">
        <p className="mb-1 font-bold text-emerald-800 uppercase tracking-wider text-[11px]">After (Revised Roll)</p>
        <div className="font-mono text-slate-800">{renderValue(after)}</div>
      </div>
    </div>
  );
}
