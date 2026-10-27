import { NextResponse, type NextRequest } from 'next/server';
import { answerQuestion } from '@/lib/assistant';
import { synthesize, transcribe } from '@/lib/gnani';
import { isBotLanguage, strings } from '@/lib/telegram/i18n';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { errorResponse } from '@/lib/route-helpers';

export const maxDuration = 60;

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!rateLimit(`voice:${clientIp(req)}`, 6, 60_000)) {
    return NextResponse.json({ error: 'Too many voice requests. Please wait a minute.' }, { status: 429 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  const lang = String(form?.get('lang') ?? 'hi-IN');

  if (!(file instanceof File)) return NextResponse.json({ error: 'Missing audio file.' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Recording too long.' }, { status: 413 });
  if (!isBotLanguage(lang)) return NextResponse.json({ error: `Unsupported lang: ${lang}` }, { status: 400 });

  try {
    const { transcript } = await transcribe(file, {
      language: lang,
      mimeType: file.type || 'audio/wav',
      filename: file.name || 'question.wav',
    });
    if (!transcript) {
      return NextResponse.json({ transcript: '', answer: null, error: strings[lang].notUnderstood });
    }

    const answer = await answerQuestion(transcript.slice(0, 500), lang, {
      source: 'WEB_UI',
      transcribedText: transcript,
    });

    let audio: string | null = null;
    try {
      const tts = await synthesize(answer.spokenSummary, { language: lang, format: 'mp3' });
      audio = tts.audio.toString('base64');
    } catch (err) {
      console.error('[check] voice reply failed:', err); // text answer still goes out
    }

    return NextResponse.json({ transcript, answer, audio });
  } catch (err) {
    return errorResponse(err);
  }
}
