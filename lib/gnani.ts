import 'server-only';
import { env } from './env';

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

const DEFAULT_VOICES: Record<string, { model: string; voice: string }> = {
  'hi-IN': { model: 'timbre-v2.5', voice: 'Nalini' },
  'en-IN': { model: 'timbre-v2.5', voice: 'Nalini' },
  'mr-IN': { model: 'timbre-v2.5', voice: 'Zahira' },
};

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

  if (options.biasList && options.biasList.length > 0) {
    const validWords = options.biasList.filter((w) => /^[a-zA-Z]+$/.test(w)).slice(0, 100);
    if (validWords.length > 0) {
      formData.append('bias_list', JSON.stringify(validWords));
      if (options.biasScore !== undefined) {
        formData.append('bias_score', String(options.biasScore));
      }
    }
  }

  const res = await fetchWithRetry('https://api.vachana.ai/stt/v3', {
    method: 'POST',
    headers: {
      'X-API-Key-ID': apiKey,
    },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    const msg = data?.error?.message || `STT request failed with status ${res.status}`;
    const type = data?.error?.type || 'STT_ERROR';
    throw new GnaniError(msg, res.status, type);
  }

  return {
    transcript: data.transcript ?? '',
    requestId: data.request_id,
    timestamp: data.timestamp,
  };
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
  const lang = options.language ?? 'hi-IN';
  const defaults = DEFAULT_VOICES[lang] ?? { model: 'timbre-v3.0', voice: 'Shivani' };
  const model = options.model ?? defaults.model;
  const voice = options.voice ?? defaults.voice;
  const speed = Math.max(0.85, Math.min(1.15, options.speed ?? 1.0));
  const format = options.format ?? 'ogg';

  const audioConfig = {
    container: format,
    encoding: format === 'ogg' ? 'OPUS' : format === 'mp3' ? 'MP3' : 'LINEAR16',
  };

  const payload = {
    text,
    model,
    voice,
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
