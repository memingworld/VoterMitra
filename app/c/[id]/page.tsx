import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClaimAudit } from '@/lib/dashboard';
import { VerdictCard } from '@/components/verdict-card';
import { fromTelegramCode, strings } from '@/lib/telegram/i18n';
import { formatDateTime } from '@/lib/labels';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getClaimAudit(id);
  if (!audit) return { title: 'VoterMitra' };

  const lang = fromTelegramCode(audit.language_code ?? undefined);
  const label = audit.verdict ? strings[lang].verdicts[audit.verdict] : 'VoterMitra';
  // WhatsApp renders this text itself, so Hindi and Marathi display correctly in the preview.
  return {
    title: `${label} · VoterMitra`,
    description: audit.official_explanation,
    openGraph: { title: `${label} · VoterMitra`, description: audit.official_explanation },
  };
}

export default async function SharedVerdictPage({ params }: Props) {
  const { id } = await params;
  const audit = await getClaimAudit(id);
  if (!audit) notFound();

  const lang = fromTelegramCode(audit.language_code ?? undefined);

  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-10">
      <Link href="/" className="text-lg font-semibold">
        VoterMitra
      </Link>
      <VerdictCard
        lang={lang}
        answer={{
          verdict: audit.verdict,
          confidence: audit.confidence,
          summary: audit.official_explanation,
          reasoning: audit.reasoning,
          sources: [],
        }}
      />
      <p className="text-xs text-slate-500">Checked on {formatDateTime(audit.created_at)}</p>
      <Link href="/" className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
        Check another claim
      </Link>
    </main>
  );
}
