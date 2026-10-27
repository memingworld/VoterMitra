import { NextResponse, type NextRequest } from 'next/server';
import { transcribe } from '@/lib/gnani';
import { checkDevAuth, errorResponse } from '@/lib/route-helpers';

export async function POST(req: NextRequest) {
  const authError = checkDevAuth(req);
  if (authError) return authError;

  const form = await req.formData().catch(() => null);
  const file = form?.get('audio_file') || form?.get('file');
  const lang = String(form?.get('lang') ?? form?.get('language_code') ?? 'hi-IN');

  if (!file || typeof file === 'string' || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'Missing audio file (field: file or audio_file)' }, { status: 400 });
  }

  try {
    const result = await transcribe(file, { language: lang });
    return NextResponse.json({
      success: true,
      transcript: result.transcript,
      requestId: result.requestId,
      timestamp: result.timestamp,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
