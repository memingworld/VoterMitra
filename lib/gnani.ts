import 'server-only';
import { env } from './env';
import { VOICE_MAP, type LanguageCode } from './languages';

export class GnaniError extends Error {
  status: number;
  type?: string;

  constructor(message: string, status = 500, type?: string) {
    super(message);
    this.name = 'GnaniError';
    this.status = status;
    this.type = type;
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 2,
  timeoutMs = 15_000,
): Promise<Response> {
  let attempt = 0;
  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if ((res.status === 429 || res.status >= 500) && attempt < maxRetries) {
        attempt++;
        const delay = Math.pow(2, attempt) * 500 + Math.random() * 200;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      return res;
    } catch (err: unknown) {
      clearTimeout(timer);
      if (attempt < maxRetries) {
        attempt++;
        const delay = Math.pow(2, attempt) * 500 + Math.random() * 200;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      if (err instanceof Error && err.name === 'AbortError') {
        throw new GnaniError(`Gnani request timed out after ${timeoutMs}ms`, 504);
      }
      throw new GnaniError(err instanceof Error ? err.message : 'Network error reaching Gnani API', 502);
    }
  }
  throw new GnaniError('Max retries exceeded', 502);
}

export interface TranscribeOptions {
  language?: string;
  format?: 'verbatim' | 'transcribe';
  biasList?: string[];
  biasScore?: number;
  mimeType?: string;
  filename?: string;
}

export interface TranscribeResult {
  transcript: string;
  requestId?: string;
  timestamp?: string;
}

export async function transcribe(
  audio: Blob | File | Buffer,
  options: TranscribeOptions = {},
): Promise<TranscribeResult> {
  const apiKey = env().GNANI_API_KEY;
  if (!apiKey) {
    throw new GnaniError('GNANI_API_KEY is not configured in environment variables', 500);
  }
  const lang = options.language ?? 'hi-IN';
  const format = options.format ?? 'transcribe';

  const formData = new FormData();
  let audioBlob: Blob;

  if (audio instanceof Blob) {
    audioBlob = audio;
  } else {
    const mime = options.mimeType || 'audio/wav';
    audioBlob = new Blob([new Uint8Array(audio)], { type: mime });
  }

  formData.append('audio_file', audioBlob, options.filename || 'audio.wav');
  formData.append('language_code', lang);
  formData.append('format', format);

  try {
    const res = await fetchWithRetry('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: {
        'X-API-Key-ID': apiKey,
      },
      body: formData,
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.success) {
      return {
        transcript: data.transcript ?? '',
        requestId: data.request_id,
        timestamp: data.timestamp,
      };
    }

    console.warn('[gnani stt] Gnani STT API returned non-success:', data);
  } catch (sttErr) {
    console.warn('[gnani stt] Gnani STT attempt failed:', sttErr instanceof Error ? sttErr.message : sttErr);
  }

  return { transcript: '' };
}

export interface SynthesizeOptions {
  language?: string;
  voice?: string;
  model?: string;
  speed?: number;
  format?: 'mp3' | 'ogg' | 'wav';
}

export interface SynthesizeResult {
  audio: Buffer;
  contentType: string;
}

export async function synthesize(
  text: string,
  options: SynthesizeOptions = {},
): Promise<SynthesizeResult> {
  const apiKey = env().GNANI_API_KEY;
  if (!apiKey) {
    throw new GnaniError('GNANI_API_KEY is not configured in environment variables', 500);
  }
  const lang = (options.language ?? 'hi-IN') as LanguageCode;
  const mappedVoice = VOICE_MAP[lang] || 'Nalini';
  const voice = options.voice ?? mappedVoice;
  const model = options.model ?? 'timbre-v2.5';
  const speed = Math.max(0.85, Math.min(1.15, options.speed ?? 1.0));
  const format = options.format ?? 'wav';

  const audioConfig = {
    encoding: format === 'ogg' ? 'oggopus' : format === 'mp3' ? 'mp3' : 'linear_pcm',
    container: format,
    num_channels: 1,
    sample_rate: 48000,
    sample_width: 2,
  };

  const payload = {
    text,
    voice,
    model,
    language: lang,
    speed,
    audio_config: audioConfig,
  };

  const res = await fetchWithRetry('https://api.vachana.ai/api/v1/tts/inference', {
    method: 'POST',
    headers: {
      'X-API-Key-ID': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.error?.message || errorData?.message || `TTS failed with status ${res.status}`;
    const type = errorData?.error?.type || 'TTS_ERROR';
    throw new GnaniError(msg, res.status, type);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = format === 'ogg' ? 'audio/ogg' : format === 'mp3' ? 'audio/mpeg' : 'audio/wav';

  return {
    audio: buffer,
    contentType,
  };
}
