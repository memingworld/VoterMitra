import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbStatus = await healthCheck();

  if (!dbStatus.ok) {
    return NextResponse.json(
      {
        status: 'error',
        service: 'VoterMitra API',
        database: dbStatus,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    status: 'ok',
    service: 'VoterMitra API',
    database: dbStatus,
  });
}
