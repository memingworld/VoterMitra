'use client';

import { useActionState, useState } from 'react';
import { submitReview, type ReviewState } from '@/app/dashboard/actions';
import { DECISION_META, REVIEW_DECISIONS, canDecide, type ReviewDecision, type Role } from '@/lib/labels';

export function ReviewForm({ flagId, role, explanations }: { flagId: string; role: Role; explanations: string[] }) {
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(submitReview, { ok: false });
  const allowed = REVIEW_DECISIONS.filter((d) => canDecide(role, d));
  const [decision, setDecision] = useState<ReviewDecision>(allowed[0]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="flagId" value={flagId} />

      <fieldset className="space-y-2">
        {allowed.map((d) => (
          <label
            key={d}
            className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition ${
              decision === d ? 'border-[#0F2C59] bg-slate-50 ring-1 ring-[#0F2C59]' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="decision"
              value={d}
              checked={decision === d}
              onChange={() => setDecision(d)}
              className="mt-1 accent-[#0F2C59]"
            />
            <span>
              <span className="block text-xs font-bold text-slate-900">{DECISION_META[d].label}</span>
              <span className="block text-[11px] text-slate-600 mt-0.5">{DECISION_META[d].help}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {decision === 'FALSE_POSITIVE_BENIGN' && explanations.length > 0 && (
        <fieldset className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <legend className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-700">Which explanation was confirmed?</legend>
          {explanations.map((e, i) => (
            <label key={e} className="flex items-center gap-2 text-xs font-medium text-slate-800">
              <input type="radio" name="innocentReason" value={e} defaultChecked={i === 0} className="accent-[#0F2C59]" />
              {e}
            </label>
          ))}
        </fieldset>
      )}

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Justification / Audit Notes</span>
        <textarea
          name="justification"
          required
          minLength={10}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-[#0F2C59] focus:outline-none"
          placeholder="Record statutory verification findings, BLO field report reference, or Electoral Roll verification basis."
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-[#0F2C59] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-2xs hover:bg-[#0A1E3F] transition cursor-pointer disabled:opacity-50"
      >
        {pending ? 'Recording Decision…' : 'Record Statutory Decision'}
      </button>

      {state.error && <p className="text-xs text-red-700 font-bold">{state.error}</p>}
      {state.ok && state.message && <p className="text-xs text-emerald-700 font-bold">{state.message}</p>}
    </form>
  );
}
