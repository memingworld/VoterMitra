import { ImageResponse } from 'next/og';
import { getClaimAudit } from '@/lib/dashboard';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'VoterMitra fact check';

// The image renderer can't shape Devanagari correctly, so the preview image stays in English.
// The localized explanation travels in the link text and on the page itself.
const LABELS = {
  VERIFIED: 'Supported by the data',
  DISPUTED: 'Disputed by the data',
  NOT_PROVABLE: 'Cannot be proven from public data',
} as const;
const COLORS = { VERIFIED: '#047857', DISPUTED: '#b45309', NOT_PROVABLE: '#475569' } as const;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getClaimAudit(id);
  const verdict = audit?.verdict ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: '#f8fafc',
          color: '#0f172a',
          fontSize: 32,
        }}
      >
        <div style={{ display: 'flex', fontSize: 36, fontWeight: 700 }}>VoterMitra · Fact check</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, color: verdict ? COLORS[verdict] : '#0f172a' }}>
            {verdict ? LABELS[verdict] : 'Electoral roll answer'}
          </div>
          {audit?.confidence ? <div style={{ display: 'flex' }}>{`Confidence: ${audit.confidence}`}</div> : null}
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#64748b' }}>
          Statistical check on synthetic test data · Not a finding of wrongdoing · Open for full reasoning
        </div>
      </div>
    ),
    size,
  );
}
