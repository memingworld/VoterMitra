'use client';

import { useRef, useState, type FormEvent } from 'react';
import type { AssistantAnswer } from '@/lib/assistant';
import { BOT_LANGUAGES, strings, type BotLanguage } from '@/lib/telegram/i18n';
import { blobToWav16k } from '@/lib/wav';
import { VerdictCard } from './verdict-card';

const UI: Record<
  BotLanguage,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    check: string;
    checking: string;
    record: string;
    stop: string;
    listening: string;
    share: string;
    copy: string;
    copied: string;
    examples: string[];
    micError: string;
    genericError: string;
  }
> = {
  'hi-IN': {
    title: 'वायरल दावे की जाँच करें',
    subtitle: 'मतदाता सूची से जुड़ा सवाल या दावा लिखें या बोलें। जवाब सांख्यिकीय ऑडिट पर आधारित है।',
    placeholder: 'जैसे: क्या पार्ट 4 में 15000 नाम कटे?',
    check: 'दावा जाँचें',
    checking: 'डेटाबेस जाँच जारी है…',
    record: 'बोलकर पूछें',
    stop: 'रोकें',
    listening: 'सुन रहा हूँ… (अधिकतम 55 सेकंड)',
    share: 'WhatsApp पर शेयर करें',
    copy: 'लिंक कॉपी करें',
    copied: 'कॉपी हो गया ✓',
    examples: ['क्या पार्ट 4 में 15000 नाम कटे?', 'पार्ट 4 में कितने नाम हटाए गए?', 'पार्ट 4 में नाम क्यों हटाए गए?'],
    micError: 'माइक्रोफ़ोन उपलब्ध नहीं है। कृपया लिखकर पूछें।',
    genericError: 'कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।',
  },
  'en-IN': {
    title: 'Check a Viral Claim',
    subtitle: 'Type or speak a question or claim regarding the electoral roll. Audited against ground-truth data.',
    placeholder: 'e.g. Were 15,000 names deleted in Part 4?',
    check: 'Verify Claim',
    checking: 'Querying database…',
    record: 'Ask by Voice',
    stop: 'Stop Recording',
    listening: 'Listening… (up to 55 seconds)',
    share: 'Share on WhatsApp',
    copy: 'Copy Link',
    copied: 'Copied ✓',
    examples: ['Were 15000 names deleted in Part 4?', 'How many names were removed in Part 4?', 'Why were names deleted in Part 4?'],
    micError: 'Microphone not available. Please type your question.',
    genericError: 'Something went wrong. Please try again.',
  },
  'mr-IN': {
    title: 'व्हायरल दाव्याची पडताळणी करा',
    subtitle: 'मतदार यादीबद्दल प्रश्न किंवा दावा टाइप करा किंवा बोला. उत्तर अधिकृत ऑडिटवर आधारित आहे.',
    placeholder: 'उदा.: भाग 4 मधून 15000 नावे वगळली का?',
    check: 'दावा तपासा',
    checking: 'तपासणी सुरू आहे…',
    record: 'बोलून विचारा',
    stop: 'थांबवा',
    listening: 'ऐकत आहे… (जास्तीत जास्त 55 सेकंद)',
    share: 'WhatsApp वर शेअर करा',
    copy: 'लिंक कॉपी करा',
    copied: 'कॉपी झाले ✓',
    examples: ['भाग 4 मधून 15000 नावे वगळली का?', 'भाग 4 मधून किती नावे वगळली?', 'भाग 4 मधून नावे का वगळली?'],
    micError: 'मायक्रोफोन उपलब्ध नाही. कृपया टाइप करून विचारा.',
    genericError: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
  },
};

type Result = { answer: AssistantAnswer; question: string; audio?: string | null };

export function ClaimChecker() {
  const [lang, setLang] = useState<BotLanguage>('hi-IN');
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = UI[lang];

  async function ask(q: string) {
    if (!q.trim()) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, lang }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? t.genericError);
      if (!data?.answer) throw new Error(t.genericError);
      setResult({ answer: data.answer, question: q });
    } catch (e) {
      setError(e instanceof Error ? e.message : t.genericError);
    } finally {
      setBusy(false);
    }
  }

  async function sendVoice(blob: Blob) {
    setBusy(true);
    setResult(null);
    try {
      const wav = await blobToWav16k(blob);
      const form = new FormData();
      form.append('file', wav, 'question.wav');
      form.append('lang', lang);
      const res = await fetch('/api/check/voice', { method: 'POST', body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? t.genericError);
      if (!data?.answer) {
        setError(data?.error ?? strings[lang].notUnderstood);
        return;
      }
      setQuestion(data.transcript);
      setResult({ answer: data.answer, question: data.transcript, audio: data.audio });
    } catch (e) {
      setError(e instanceof Error ? e.message : t.genericError);
    } finally {
      setBusy(false);
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    setRecording(false);
  }

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (timerRef.current) clearTimeout(timerRef.current);
        void sendVoice(new Blob(chunksRef.current, { type: recorder.mimeType }));
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      timerRef.current = setTimeout(stopRecording, 55_000);
    } catch {
      setError(t.micError);
    }
  }

  function shareUrl(r: Result): string | null {
    return r.answer.auditId ? `${window.location.origin}/c/${r.answer.auditId}` : null;
  }

  function shareOnWhatsApp(r: Result) {
    const url = shareUrl(r);
    if (!url) return;
    const label = r.answer.verdict ? strings[lang].verdicts[r.answer.verdict] : '';
    const text = [label, r.answer.summary, url].filter(Boolean).join('\n\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  async function copyLink(r: Result) {
    const url = shareUrl(r);
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(question);
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">{t.title}</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">{t.subtitle}</p>
        </div>
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
          {BOT_LANGUAGES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                lang === l
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {strings[l].label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder={t.placeholder}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy || recording || !question.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            {busy ? t.checking : t.check}
          </button>
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            disabled={busy}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              recording
                ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-300 animate-pulse'
                : 'bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50'
            } disabled:opacity-40`}
          >
            <span className={`inline-block h-2 w-2 rounded-full ${recording ? 'bg-rose-600 animate-ping' : 'bg-rose-500'}`} />
            {recording ? t.stop : t.record}
          </button>
          {recording && (
            <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
              {t.listening}
            </span>
          )}
        </div>

        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Suggested Verification Prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {t.examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setQuestion(ex);
                  void ask(ex);
                }}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-950 transition-colors text-left"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </form>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <VerdictCard answer={result.answer} lang={lang} question={result.question} />
          {result.audio && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="block text-xs font-medium text-slate-500 mb-1.5">
                Official Voice Audio Response (Gnani AI):
              </span>
              <audio controls autoPlay src={`data:audio/mpeg;base64,${result.audio}`} className="w-full h-10" />
            </div>
          )}
          {result.answer.auditId && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => shareOnWhatsApp(result)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
              >
                <span>WhatsApp Share</span>
                <span>↗</span>
              </button>
              <button
                type="button"
                onClick={() => copyLink(result)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                {copied ? t.copied : t.copy}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
