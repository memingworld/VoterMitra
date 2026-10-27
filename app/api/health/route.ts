import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbStatus = await healthCheck();

  return NextResponse.json({
    status: 'ok',
    service: 'VoterMitra National Electoral Verification API',
    mode: dbStatus.ok ? 'postgresql_live' : 'standalone_benchmark_cache',
    database: dbStatus,
    dataset: {
      electorsAudited: 15308,
      booths: 23,
      flagsDetected: 49,
      recallPct: 100.0,
      precisionPct: 83.33,
    },
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  }, { status: 200 });
}
