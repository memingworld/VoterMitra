import { NextResponse, type NextRequest } from 'next/server';
import { synthesize } from '@/lib/gnani';
import { checkDevAuth, errorResponse } from '@/lib/route-helpers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authError = checkDevAuth(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || 'मतदाता सूची में आपका स्वागत है। वोटर मित्र आपकी सहायता के लिए तैयार है।';
  const lang = searchParams.get('lang') || 'hi-IN';
  const format = (searchParams.get('format') as 'mp3' | 'ogg' | 'wav') || 'mp3';

  try {
    const result = await synthesize(text, { language: lang, format });
    return new NextResponse(new Uint8Array(result.audio), {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Content-Disposition': `inline; filename="dev-tts.${format}"`,
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
