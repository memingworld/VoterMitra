import { NextResponse, type NextRequest } from 'next/server';
import { synthesize } from '@/lib/gnani';
import { errorResponse } from '@/lib/route-helpers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => ({}));
    const text = String(json.text || 'मतदाता मित्र में आपका स्वागत है।');
    const lang = String(json.language || 'hi-IN');
    const format = (json.format as 'mp3' | 'ogg' | 'wav') || 'wav';

    const result = await synthesize(text.slice(0, 400), { language: lang, format });
    return new NextResponse(new Uint8Array(result.audio), {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || 'मतदाता सूची में आपका स्वागत है। वोटर मित्र आपकी सहायता के लिए तैयार है।';
  const lang = searchParams.get('lang') || 'hi-IN';
  const format = (searchParams.get('format') as 'mp3' | 'ogg' | 'wav') || 'wav';

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
