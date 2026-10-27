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
            className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${
              decision === d ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200'
            }`}
          >
            <input
              type="radio"
              name="decision"
              value={d}
              checked={decision === d}
              onChange={() => setDecision(d)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-medium">{DECISION_META[d].label}</span>
              <span className="block text-xs text-slate-500">{DECISION_META[d].help}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {decision === 'FALSE_POSITIVE_BENIGN' && explanations.length > 0 && (
        <fieldset className="space-y-1">
          <legend className="mb-1 text-sm font-medium">Which explanation was confirmed?</legend>
          {explanations.map((e, i) => (
            <label key={e} className="flex items-center gap-2 text-sm">
              <input type="radio" name="innocentReason" value={e} defaultChecked={i === 0} />
              {e}
            </label>
          ))}
        </fieldset>
      )}

      <label className="block">
        <span className="text-sm font-medium">Justification</span>
        <textarea
          name="justification"
          required
          minLength={10}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
          placeholder="What did you check, and what did you find?"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Record decision'}
      </button>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state.ok && state.message && <p className="text-sm text-emerald-700">{state.message}</p>}
    </form>
  );
}
