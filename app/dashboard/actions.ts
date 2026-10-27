'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getReviewer } from '@/lib/auth';
import { recordReview } from '@/lib/dashboard';
import { REVIEW_DECISIONS, canDecide } from '@/lib/labels';

export interface ReviewState {
  ok: boolean;
  error?: string;
  message?: string;
}

const ReviewInput = z.object({
  flagId: z.string().regex(/^[0-9a-f-]{36}$/i, 'Invalid flag id.'),
  decision: z.enum(REVIEW_DECISIONS),
  justification: z.string().trim().min(10, 'Please write at least 10 characters of justification.').max(2000),
  innocentReason: z.string().trim().max(255).optional(),
});

export async function submitReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const reviewer = await getReviewer();
  if (!reviewer) return { ok: false, error: 'Your session has expired. Please sign in again.' };

  const parsed = ReviewInput.safeParse({
    flagId: formData.get('flagId'),
    decision: formData.get('decision'),
    justification: formData.get('justification'),
    innocentReason: formData.get('innocentReason') || undefined,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };

  const { flagId, decision, justification, innocentReason } = parsed.data;
  if (!canDecide(reviewer.role, decision)) {
    return { ok: false, error: `The ${reviewer.role} role cannot record this decision.` };
  }

  try {
    await recordReview({
      flagId,
      decision,
      justification,
      innocentReason: decision === 'FALSE_POSITIVE_BENIGN' ? (innocentReason ?? null) : null,
      reviewer,
    });
  } catch (err) {
    console.error('[review] save failed:', err);
    return { ok: false, error: 'Could not save the review. Please try again.' };
  }

  revalidatePath(`/dashboard/queue/${flagId}`);
  revalidatePath('/dashboard/queue');
  revalidatePath('/dashboard');
  return { ok: true, message: 'Decision recorded.' };
}
