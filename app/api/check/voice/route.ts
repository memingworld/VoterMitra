import { NextResponse, type NextRequest } from 'next/server';
import { answerQuestion } from '@/lib/assistant';
import { synthesize, transcribe } from '@/lib/gnani';
import { askGeminiAudio } from '@/lib/gemini';
import { isBotLanguage, strings, type BotLanguage } from '@/lib/telegram/i18n';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { errorResponse } from '@/lib/route-helpers';

export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!rateLimit(`voice:${clientIp(req)}`, 15, 60_000)) {
    return NextResponse.json({ error: 'Too many voice requests. Please wait a minute.' }, { status: 429 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  const lang = (String(form?.get('lang') ?? 'hi-IN')) as BotLanguage;

  if (!(file instanceof File)) return NextResponse.json({ error: 'Missing audio file.' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Recording too long.' }, { status: 413 });
  if (!isBotLanguage(lang)) return NextResponse.json({ error: `Unsupported lang: ${lang}` }, { status: 400 });

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');
    const mimeType = file.type || 'audio/webm';

    let transcript = '';

    // 1. Primary Engine: Google Gemini 2.5 Flash Multimodal Audio Transcription
    try {
      const geminiResult = await askGeminiAudio(base64Audio, mimeType, lang);
      if (geminiResult?.transcription && geminiResult.transcription.trim()) {
        transcript = geminiResult.transcription.trim();
      }
    } catch (gErr) {
      console.warn('[check/voice] Gemini audio call failed, falling back to Gnani:', gErr);
    }

    // 2. Secondary Fallback: Gnani STT
    if (!transcript) {
      try {
        const gnaniRes = await transcribe(file, {
          language: lang,
          mimeType,
          filename: file.name || 'question.webm',
        });
        if (gnaniRes?.transcript) {
          transcript = gnaniRes.transcript.trim();
        }
      } catch (sttErr) {
        console.warn('[check/voice] Gnani STT fallback failed:', sttErr);
      }
    }

    if (!transcript) {
      const errorMsg = strings[lang]?.notUnderstood || 'आपकी आवाज़ स्पष्ट सुनाई नहीं दी। कृपया पुनः बोलें या लिखकर पूछें।';
      return NextResponse.json({ transcript: '', answer: null, error: errorMsg });
    }

    // 3. Process Verified Answer via assistant engine
    const answer = await answerQuestion(transcript.slice(0, 500), lang, {
      source: 'WEB_UI',
      transcribedText: transcript,
    });

    // 4. Synthesize Regional Voice Note via Gnani AI TTS
    let audio: string | null = null;
    try {
      const spokenText = answer.spokenSummary || answer.summary;
      const tts = await synthesize(spokenText, { language: lang, format: 'wav' });
      audio = tts.audio.toString('base64');
    } catch (err) {
      console.warn('[check/voice] Voice reply synthesis skipped:', err);
    }

    return NextResponse.json({ transcript, answer, audio });
  } catch (err) {
    return errorResponse(err);
  }
}
