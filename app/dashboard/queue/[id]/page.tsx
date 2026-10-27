import { notFound } from 'next/navigation';
import { requireReviewer } from '@/lib/auth';
import { getFlagDetail } from '@/lib/dashboard';
import { FlagDetailView } from '@/components/flag-detail-view';

export const dynamic = 'force-dynamic';

export default async function FlagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [reviewer, detail] = await Promise.all([requireReviewer(), getFlagDetail(id)]);
  if (!detail) notFound();

  return (
    <FlagDetailView
      flag={detail.flag}
      reviews={detail.reviews}
      reviewer={reviewer}
    />
  );
}
