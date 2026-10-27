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
    subtitle: 'मतदाता सूची से जुड़ा सवाल या दावा लिखें या बोलें। जवाब परीक्षण डेटा पर आधारित है, कारण और भरोसे के स्तर के साथ।',
    placeholder: 'जैसे: क्या पार्ट 4 में 15000 नाम कटे?',
    check: 'जाँचें',
    checking: 'जाँच हो रही है…',
    record: '🎙️ बोलकर पूछें',
    stop: '⏹️ रोकें',
    listening: 'सुन रहा हूँ… (अधिकतम 55 सेकंड)',
    share: 'WhatsApp पर शेयर करें',
    copy: 'लिंक कॉपी करें',
    copied: 'कॉपी हो गया',
    examples: ['पार्ट 4 में कितने नाम हटे?', 'क्या पार्ट 4 में 15000 नाम कटे?', 'पार्ट 4 में नाम क्यों हटाए गए?'],
    micError: 'माइक्रोफ़ोन उपलब्ध नहीं है। कृपया लिखकर पूछें।',
    genericError: 'कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।',
  },
  'en-IN': {
    title: 'Check a viral claim',
    subtitle: 'Type or speak a question or claim about the electoral roll. Answers come from test data, with reasoning and a confidence level.',
    placeholder: 'e.g. Were 15000 names deleted in Part 4?',
    check: 'Check',
    checking: 'Checking…',
    record: '🎙️ Ask by voice',
    stop: '⏹️ Stop',
    listening: 'Listening… (up to 55 seconds)',
    share: 'Share on WhatsApp',
    copy: 'Copy link',
    copied: 'Copied',
    examples: ['How many names were removed in Part 4?', 'Were 5000 fake voters added in Part 12?', 'Why were names deleted in Part 4?'],
    micError: 'Microphone not available. Please type your question.',
    genericError: 'Something went wrong. Please try again.',
  },
  'mr-IN': {
    title: 'व्हायरल दाव्याची तपासणी करा',
    subtitle: 'मतदार यादीबद्दल प्रश्न किंवा दावा टाइप करा किंवा बोला. उत्तर चाचणी डेटावर आधारित आहे, कारणे आणि विश्वास पातळीसह.',
    placeholder: 'उदा.: भाग 4 मधून 15000 नावे वगळली का?',
    check: 'तपासा',
    checking: 'तपासणी सुरू आहे…',
    record: '🎙️ बोलून विचारा',
    stop: '⏹️ थांबवा',
    listening: 'ऐकत आहे… (जास्तीत जास्त 55 सेकंद)',
    share: 'WhatsApp वर शेअर करा',
    copy: 'लिंक कॉपी करा',
    copied: 'कॉपी झाले',
    examples: ['भाग 4 मधून किती नावे वगळली?', 'भाग 4 मधून 15000 नावे वगळली का?', 'भाग 4 मधून नावे का वगळली?'],
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
      timerRef.current = setTimeout(stopRecording, 55_000); // STT accepts up to 60 s
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
    <div className="space-y-6">
      <div className="flex gap-2">
        {BOT_LANGUAGES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`rounded-full px-3 py-1 text-sm ${
              lang === l ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'
            }`}
          >
            {strings[l].label}
          </button>
        ))}
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <p className="mt-1 text-slate-600">{t.subtitle}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder={t.placeholder}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={busy || recording || !question.trim()}
            className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {busy ? t.checking : t.check}
          </button>
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            disabled={busy}
            className={`rounded-lg px-4 py-2 font-medium ring-1 disabled:opacity-50 ${
              recording ? 'bg-red-50 text-red-700 ring-red-200' : 'bg-white text-slate-800 ring-slate-300'
            }`}
          >
            {recording ? t.stop : t.record}
          </button>
          {recording && <span className="text-sm text-red-700">{t.listening}</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {t.examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setQuestion(ex);
                void ask(ex);
              }}
              className="rounded-full bg-white px-3 py-1 text-sm text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </form>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      {result && (
        <div className="space-y-3">
          <VerdictCard answer={result.answer} lang={lang} question={result.question} />
          {result.audio && <audio controls autoPlay src={`data:audio/mpeg;base64,${result.audio}`} className="w-full" />}
          {result.answer.auditId && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => shareOnWhatsApp(result)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
              >
                {t.share}
              </button>
              <button
                type="button"
                onClick={() => copyLink(result)}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium ring-1 ring-slate-300"
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
