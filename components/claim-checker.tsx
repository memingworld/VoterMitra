'use client';

import { useState, useRef, useEffect } from 'react';
import type { AssistantAnswer } from '@/lib/assistant';
import { I18N_DICTIONARY, type LanguageCode } from '@/lib/languages';

type Result = {
  answer: AssistantAnswer;
  question: string;
  audioUrl?: string | null;
};

interface ClaimCheckerProps {
  currentLang?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export function ClaimChecker({ currentLang = 'hi-IN', onLanguageChange }: ClaimCheckerProps) {
  const [lang, setLang] = useState<LanguageCode>(currentLang);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync external language changes
  useEffect(() => {
    setLang(currentLang);
  }, [currentLang]);

  const t = I18N_DICTIONARY[lang] || I18N_DICTIONARY['hi-IN'];

  // Initialize Speech Recognition for browser microphone
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setQuestion(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[speech recognition] error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setError('माइक्रोफोन अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफोन की अनुमति दें या टाइप करें।');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [lang]);

  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = lang;
          recognitionRef.current.start();
        } catch {
          // In case already started
        }
      } else {
        setError('इस ब्राउज़र में लाइव वॉयस रिकॉग्निशन समर्थित नहीं है। कृपया लिखकर प्रश्न पूछें।');
      }
    }
  };

  async function handleVerify(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    setResult(null);

    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, lang }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? 'सत्यापन अनुरोध विफल रहा');
      if (!data?.answer) throw new Error('अमान्य उत्तर प्रारूप');

      let audioUrl: string | null = null;
      // Fetch high-quality Gnani AI TTS audio
      try {
        const spokenText = `${data.answer.spokenSummary || data.answer.summary}`;
        const ttsRes = await fetch('/api/dev/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: spokenText, language: lang, format: 'wav' }),
        });
        if (ttsRes.ok) {
          const blob = await ttsRes.blob();
          audioUrl = URL.createObjectURL(blob);
        }
      } catch (ttsErr) {
        console.warn('[tts] Audio generation skipped:', ttsErr);
      }

      setResult({ answer: data.answer, question: trimmed, audioUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'सर्वर से संपर्क करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setBusy(false);
    }
  }

  const toggleAudio = () => {
    if (!result?.audioUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(result.audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      audioRef.current = audio;
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch((e) => {
        console.warn('Playback error:', e);
        setIsPlayingAudio(false);
      });
    }
  };

  const handleShareWhatsApp = () => {
    if (!result) return;
    const url = result.answer.auditId
      ? `${window.location.origin}/c/${result.answer.auditId}`
      : window.location.href;
    const verdictText = result.answer.verdict === 'VERIFIED' ? '✅ प्रमाणित (VERIFIED)' : '⚠️ विवादित (DISPUTED)';
    const text = `🇮🇳 *भारत निर्वाचन आयोग — मतदाता मित्र (VoterMitra)*\n\n📌 *सवाल:* "${result.question}"\n\n🔍 *निष्कर्ष:* ${verdictText}\n${result.answer.summary}\n\n🔗 आधिकारिक रिपोर्ट देखें: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  const handleCopyLink = async () => {
    if (!result) return;
    const url = result.answer.auditId
      ? `${window.location.origin}/c/${result.answer.auditId}`
      : window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Search & Verification Card */}
      <div className="rounded-xl border-2 border-[#0A194E]/20 bg-white p-5 sm:p-7 shadow-md relative overflow-hidden">
        {/* Subtle Ashoka Chakra watermark in background */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 text-slate-100/50 pointer-events-none select-none text-9xl font-mono flex items-center justify-center opacity-40">
          ☸
        </div>

        <div className="relative z-10">
          {/* Header & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-[#E65100] border border-amber-300">
                <span>🛡️</span> आधिकारिक मतदाता सत्यापन प्रणाली
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0B1E3F] mt-1.5 tracking-tight">
                {t.checkTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {t.checkSub}
              </p>
            </div>
          </div>

          {/* Input & Voice Controls */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(question);
            }}
            className="mt-5 space-y-3"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-50/50 px-4 py-3.5 pr-28 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:border-[#0A194E] focus:bg-white focus:outline-none transition shadow-inner"
              />

              {/* Action Buttons inside Input */}
              <div className="absolute right-2 flex items-center gap-1.5">
                {/* Voice Input Microphone Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-xs font-bold transition shadow-xs ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400'
                      : 'bg-amber-100 text-[#E65100] hover:bg-amber-200 border border-amber-300'
                  }`}
                  title={isListening ? t.btnStop : t.btnVoice}
                >
                  <span>{isListening ? '⏹️' : '🎙️'}</span>
                  <span className="hidden sm:inline">
                    {isListening ? t.btnStop : t.btnVoice}
                  </span>
                </button>

                {/* Submit Verify Button */}
                <button
                  type="submit"
                  disabled={busy || !question.trim()}
                  className="rounded-md bg-[#0A194E] hover:bg-[#002147] px-3.5 py-2 text-xs font-bold text-white shadow-xs disabled:opacity-50 transition uppercase tracking-wider"
                >
                  {busy ? '...' : t.btnCheck}
                </button>
              </div>
            </div>

            {/* Listening Banner */}
            {isListening && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-300 p-2 text-xs text-amber-900 font-medium animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span>{t.btnListening}</span>
                <span className="text-[11px] text-amber-700 ml-auto">Gnani Vachana AI Voice Engine</span>
              </div>
            )}

            {/* Example Queries Chips */}
            <div className="pt-1">
              <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                <span>⚡</span>
                <span>त्वरित परीक्षण प्रश्न (Frequent Inquiries):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.examples.map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuestion(ex);
                      handleVerify(ex);
                    }}
                    className="rounded-full bg-slate-100 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 px-3 py-1 text-xs text-slate-700 transition text-left"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Error Notice */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Official Verdict Certificate Result Card */}
      {result && (
        <div className="rounded-xl border-2 border-slate-300 bg-white p-6 shadow-md space-y-5 animate-in fade-in-50 duration-200 relative overflow-hidden">
          {/* Top Tricolor Accent on Verdict Card */}
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="flex-1 bg-[#FF671F]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#046A38]" />
          </div>

          {/* Verdict Header with Official Stamps */}
          <div className="flex flex-wrap items-start justify-between gap-4 pt-1 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                आधिकारिक ऑडिट परिणाम · OFFICIAL AUDIT VERDICT
              </span>
              <div className="mt-1 flex items-center gap-2.5">
                {result.answer.verdict === 'VERIFIED' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 border-2 border-emerald-600 px-3 py-1 text-sm font-black text-emerald-900 tracking-wide uppercase shadow-xs">
                    <span>✓</span> {t.verdicts.VERIFIED}
                  </span>
                ) : result.answer.verdict === 'DISPUTED' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 border-2 border-amber-600 px-3 py-1 text-sm font-black text-amber-900 tracking-wide uppercase shadow-xs">
                    <span>⚠️</span> {t.verdicts.DISPUTED}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 border-2 border-slate-500 px-3 py-1 text-sm font-black text-slate-800 tracking-wide uppercase shadow-xs">
                    <span>ℹ️</span> {t.verdicts.NOT_PROVABLE}
                  </span>
                )}
              </div>
            </div>

            {/* Confidence Stamp */}
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500">विश्वसनीयता स्तर</span>
              <div className="text-xs font-bold text-[#0A194E] flex items-center gap-1 justify-end mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>
                  {result.answer.confidence === 'HIGH'
                    ? t.confidence.HIGH
                    : result.answer.confidence === 'MEDIUM'
                    ? t.confidence.MEDIUM
                    : t.confidence.LOW}
                </span>
              </div>
            </div>
          </div>

          {/* Question & Finding */}
          <div>
            <div className="text-xs font-semibold text-slate-500">सत्यापित प्रश्न (Audited Query):</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 italic">"{result.question}"</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-800 font-medium bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              {result.answer.summary}
            </p>
          </div>

          {/* Gnani Voice AI Audio Player */}
          {result.audioUrl && (
            <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="w-10 h-10 rounded-full bg-[#E65100] text-white flex items-center justify-center shadow hover:bg-[#FF671F] transition text-base"
                  title={isPlayingAudio ? 'रोकें' : 'सुनें'}
                >
                  {isPlayingAudio ? '⏸️' : '▶️'}
                </button>
                <div>
                  <div className="text-xs font-bold text-slate-900">{t.audioLabel}</div>
                  <div className="text-[11px] text-slate-600">
                    {isPlayingAudio ? 'ऑडियो प्ले हो रहा है…' : 'स्वर में आधिकारिक सारांश सुनने के लिए क्लिक करें'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-800 bg-white/80 px-2 py-0.5 rounded border border-amber-300">
                  timbre-v2.5 · 48kHz WAV
                </span>
              </div>
            </div>
          )}

          {/* Reasoning & Evidence Details */}
          {result.answer.reasoning && result.answer.reasoning.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1 mb-2">
                <span>📋</span>
                <span>सांख्यिकीय साक्ष्य एवं विधिक आधार (Statistical Basis & Legal Context):</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 pl-1">
                {result.answer.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Bar (WhatsApp & Copy) */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs">
            <span className="text-[11px] text-slate-500">
              विधिक संदर्भ: लोक प्रतिनिधित्व अधिनियम 1950 (धारा 22/23)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 font-bold text-white shadow-xs hover:bg-[#20bd5a] transition"
              >
                <span>💬</span>
                <span>{t.shareWhatsApp}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                <span>🔗</span>
                <span>{copied ? t.copied : t.copyLink}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
