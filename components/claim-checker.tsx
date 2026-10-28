'use client';

import { useState, useRef, useEffect } from 'react';
import type { AssistantAnswer } from '@/lib/assistant';
import { type LanguageCode } from '@/lib/languages';
import { useLanguage } from '@/components/language-context';
import { ElectorCardView } from '@/components/elector-card-view';

type Result = {
  answer: AssistantAnswer;
  question: string;
  audioUrl?: string | null;
};

interface ClaimCheckerProps {
  currentLang?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

// Categorized interactive inquiries across the official 15,308 elector dataset
const INQUIRY_CATEGORIES = [
  {
    id: 'elector',
    icon: '👤',
    labelEn: 'Elector & EPIC Search',
    labelHi: 'मतदाता व पहचान पत्र खोज',
    hintEn: 'Search any citizen or Voter ID across 15,308 verified Delhi records',
    hintHi: 'दिल्ली के 15,308 मतदाताओं में से किसी भी नागरिक या पहचान पत्र की खोज करें',
    queries: [
      { q: 'Is Yuv Jindal present in the list?', label: 'Yuv Jindal (AC 58 Kundan Nagar)' },
      { q: 'रोहिणी में अमित कुमार', label: 'Amit Kumar (AC 13 Rohini)' },
      { q: 'IPS3346004', label: 'EPIC: IPS3346004' },
      { q: 'Sarthak Prasad', label: 'Sarthak Prasad (AC 58)' },
    ],
  },
  {
    id: 'anomalies',
    icon: '⚠️',
    labelEn: 'Revision Deletion Audits',
    labelHi: 'पुनरीक्षण विलोपन जांच',
    hintEn: 'Audit targeted deletions and statistical shifts under Rule 21A',
    hintHi: 'नियम 21A के तहत संदिग्ध विलोपन व सांख्यिकीय विचलनों की जांच',
    queries: [
      { q: 'Check status for Vanshika Kain', label: 'Vanshika Kain (Part 4 Deletion Anomaly)' },
      { q: 'Were 49 women electors deleted in Part 4?', label: 'Part 4 (+4.9σ Female Deletion Anomaly)' },
      { q: 'Check cross-AC duplicate entries', label: 'Cross-AC Duplicate EPIC Check (AC 6 & 13)' },
    ],
  },
  {
    id: 'clusters',
    icon: '🏠',
    labelEn: 'Address Clusters & Boothing',
    labelHi: 'पता संकेंद्रण व मतदान केंद्र',
    hintEn: 'Detect abnormal voter density at single addresses or student hostels',
    hintHi: 'एकल पते पर अत्यधिक पंजीकरण या हॉस्टल संकेंद्रण की जांच',
    queries: [
      { q: 'How many electors are registered at Plot 12-B?', label: 'Plot 12-B Basement (43 Electors Cluster)' },
      { q: 'Check Part 1 Kundan Nagar polling station', label: 'Part 1 Kundan Nagar (Lovely Public School)' },
    ],
  },
  {
    id: 'rules',
    icon: '📜',
    labelEn: 'Statutory ECI Rules',
    labelHi: 'विधिक नियम व अधिकार',
    hintEn: 'Authoritative guidance on Form 6, 7, 8, and voting without EPIC',
    hintHi: 'फॉर्म 6, 7, 8 तथा बिना पहचान पत्र मतदान के विधिक नियम',
    queries: [
      { q: 'How to register a new voter using Form 6?', label: 'Form 6: New Voter Registration (Age 18+)' },
      { q: 'Can I vote if I do not have a physical EPIC card?', label: 'Voting Without Physical EPIC (12 Approved IDs)' },
      { q: 'What is mandatory notice under Rule 21A before deletion?', label: 'Rule 21A Notice & Hearing Safeguard' },
    ],
  },
];

export function ClaimChecker({ currentLang: propLang }: ClaimCheckerProps) {
  const { lang: contextLang, t } = useLanguage();
  const lang = propLang || contextLang;

  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeCategory, setActiveCategory] = useState('elector');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up recording stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
    };
  }, []);

  // Native HTML5 MediaRecorder (Cross-browser, universal microphone recording)
  const startVoiceRecording = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('आपके ब्राउज़र में ऑडियो रिकॉर्डिंग समर्थित नहीं है। कृपया लिखकर प्रश्न पूछें।');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/ogg')
        ? 'audio/ogg'
        : '';

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        }
        await handleVoiceSubmit(audioBlob);
      };

      mediaRecorder.start(250); // Slice into 250ms chunks
      setIsListening(true);
      setRecordingSeconds(0);

      // Start timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Safety timeout after 25s
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = setTimeout(() => {
        stopVoiceRecording();
      }, 25000);
    } catch (micErr: any) {
      console.warn('[mic] getUserMedia failed:', micErr);
      setIsListening(false);
      if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
        setError('माइक्रोफोन अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफोन अनुमति चालू करें।');
      } else {
        setError('माइक्रोफोन एक्सेस करने में त्रुटि। कृपया लिखकर प्रश्न पूछें।');
      }
    }
  };

  const stopVoiceRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Error stopping media recorder:', err);
      }
    }
    setIsListening(false);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  // Submit audio file directly to /api/check/voice (Gemini Multimodal Audio + Gnani TTS)
  async function handleVoiceSubmit(audioBlob: Blob) {
    setBusy(true);
    setError(null);
    setResult(null);

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('lang', lang);

      const res = await fetch('/api/check/voice', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? 'वॉयस सत्यापन विफल रहा');
      if (!data?.answer) throw new Error('अमान्य उत्तर प्रारूप');

      if (data.transcript) {
        setQuestion(data.transcript);
      }

      let audioUrl: string | null = null;
      if (data.audio) {
        try {
          const binary = atob(data.audio);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
          const blob = new Blob([array], { type: 'audio/wav' });
          audioUrl = URL.createObjectURL(blob);
        } catch (audioErr) {
          console.warn('[voice] Failed to create audio URL:', audioErr);
        }
      }

      setResult({ answer: data.answer, question: data.transcript || question, audioUrl });
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'सर्वर से संपर्क करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setBusy(false);
    }
  }

  // Text Verification Submit
  async function handleVerify(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    setResult(null);

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
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((e) => {
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
    const text = `🇮🇳 *भारत निर्वाचन आयोग : मतदाता मित्र (VoterMitra)*\n\n📌 *सवाल:* "${result.question}"\n\n🔍 *निष्कर्ष:* ${verdictText}\n${result.answer.summary}\n\n🔗 आधिकारिक रिपोर्ट देखें: ${url}`;
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

  const currentCategory = INQUIRY_CATEGORIES.find((c) => c.id === activeCategory) || INQUIRY_CATEGORIES[0];

  return (
    <div className="w-full space-y-6">
      {/* Search & Verification Box */}
      <div className="rounded-lg border border-slate-300 bg-white p-5 sm:p-7 shadow-xs relative">
        <div>
          {/* Header & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-[#C2410C] border border-amber-200">
                <span>🛡️</span> {lang === 'en-IN' ? 'Official Electoral Roll Verification' : 'आधिकारिक मतदाता सत्यापन प्रणाली'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0F2C59] mt-1.5 tracking-tight">
                {t.checkTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {lang === 'en-IN'
                  ? 'Search ANY elector by Name or EPIC ID across 15,308 verified records, or ask any statutory rule question.'
                  : '15,308 रिकॉर्ड्स में से किसी भी नागरिक का नाम/EPIC खोजें अथवा चुनावी प्रक्रिया व नियमों पर सवाल पूछें।'}
              </p>
            </div>
          </div>

          {/* Input & Voice Controls Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(question);
            }}
            className="mt-5 space-y-4"
          >
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  lang === 'en-IN'
                    ? 'Type any Name (e.g. Yuv Jindal), EPIC ID (e.g. IPS3346004), or election query…'
                    : 'कोई भी नाम (उदा. युव जिंदल), पहचान पत्र (उदा. IPS3346004) या सवाल लिखें…'
                }
                disabled={busy || isListening}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-2xs focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59] disabled:bg-slate-50 transition"
              />

              <div className="flex items-center gap-2 shrink-0">
                {/* Ask by Voice Button (Universal MediaRecorder + Gemini Multimodal Audio) */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  disabled={busy}
                  className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                    isListening
                      ? 'bg-red-600 border-red-700 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                  title={isListening ? t.btnStop : t.btnVoice}
                >
                  <span className="text-sm">{isListening ? '⏹️' : '🎙️'}</span>
                  <span>{isListening ? `${t.btnStop} (${recordingSeconds}s)` : t.btnVoice}</span>
                </button>

                {/* Submit Verify Button */}
                <button
                  type="submit"
                  disabled={busy || !question.trim() || isListening}
                  className="rounded-lg bg-[#0F2C59] hover:bg-[#0A1F3D] px-4 py-2.5 text-xs font-bold text-white shadow-2xs disabled:opacity-50 transition uppercase tracking-wider cursor-pointer"
                >
                  {busy ? '...' : t.btnCheck}
                </button>
              </div>
            </div>

            {/* Listening Live Banner with Waveform & Stop */}
            {isListening && (
              <div className="flex items-center justify-between rounded-lg bg-red-50 border-2 border-red-400 p-3 text-xs text-red-950 font-bold shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <span>🔴 {t.btnListening} ({recordingSeconds}s) : बोलिए... (Recording live audio)</span>
                  <div className="hidden sm:flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="rounded bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  {t.btnStop} &amp; {t.btnCheck} ✓
                </button>
              </div>
            )}

            {/* Categorized Interactive Inquiry Switcher (Real Dataset Exploration) */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>{lang === 'en-IN' ? 'Explore Delhi Roll Dataset & Statutory Rules:' : 'दिल्ली निर्वाचक नामावली एवं विधिक नियम अन्वेषण:'}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">
                  {lang === 'en-IN' ? '15,308 Records Live' : '15,308 मतदाता सक्रिय'}
                </span>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2">
                {INQUIRY_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#0A194E] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{lang === 'en-IN' ? cat.labelEn : cat.labelHi}</span>
                  </button>
                ))}
              </div>

              {/* Selected Category Hint & Query Chips */}
              <div className="mt-2.5">
                <p className="text-[11px] text-slate-500 mb-2 italic">
                  ℹ️ {lang === 'en-IN' ? currentCategory.hintEn : currentCategory.hintHi}
                </p>

                <div className="flex flex-wrap gap-2">
                  {currentCategory.queries.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQuestion(item.q);
                        handleVerify(item.q);
                      }}
                      className="rounded-full bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 px-3 py-1 text-xs text-slate-800 transition text-left cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="text-slate-400 font-mono text-[10px]">↗</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {/* Error Notice */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-300 p-3 text-xs text-red-900 font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification Result Section */}
      {result && (
        <div className="rounded-xl border-2 border-slate-200 bg-white p-5 sm:p-7 shadow-lg space-y-6">
          {/* Top Result Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                आधिकारिक ऑडिट परिणाम · OFFICIAL AUDIT VERDICT
              </span>
              <div className="mt-1">
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

            {/* Structured Elector Card View & Clean Markdown Typography */}
            <div className="mt-3 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
              <ElectorCardView text={result.answer.summary} lang={lang} />
            </div>
          </div>

          {/* Gnani Voice AI Audio Player */}
          {result.audioUrl && (
            <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="w-10 h-10 rounded-full bg-[#E65100] text-white flex items-center justify-center shadow hover:bg-[#FF671F] transition text-base cursor-pointer"
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

          {/* Official Digital Gazette Verification Certificate (NIC / ECI Standard) */}
          {result.answer.blockchain && (
            <div className="rounded-lg bg-slate-50 border-2 border-slate-300 p-4 sm:p-5 text-slate-900 text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                  <span className="font-bold text-[#0F2C59] tracking-wide text-xs">
                    📜 {lang === 'en-IN' ? 'Digital Electoral Gazette Roll Seal' : 'आधिकारिक डिजिटल निर्वाचक नामावली राजपत्र प्रमाण'}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  Polygon Amoy PoS: Sealed ✓
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'en-IN'
                  ? 'This elector record is cryptographically anchored to the Master Merkle Root on Polygon Proof of Stake, ensuring tamper-evident statutory integrity under Sections 22 and 23 of the Representation of the People Act, 1950.'
                  : 'यह मतदाता रिकॉर्ड जनप्रतिनिधित्व अधिनियम 1950 की धारा 22 एवं 23 के तहत मर्कल ट्री द्वारा पॉलीगॉन प्रूफ ऑफ स्टेक पर गणितीय रूप से सीलबंद एवं सुरक्षित है।'}
              </p>

              <div className="grid sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-white p-2.5 rounded border border-slate-300">
                  <span className="text-slate-500 block text-[9px] font-sans uppercase tracking-wider font-semibold">Master Merkle Root Hash</span>
                  <span className="text-slate-900 truncate block font-bold text-[10px]">
                    {result.answer.blockchain.merkleRoot}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-300">
                  <span className="text-slate-500 block text-[9px] font-sans uppercase tracking-wider font-semibold">Smart Contract Registry</span>
                  <span className="text-slate-900 truncate block font-bold text-[10px]">
                    {result.answer.blockchain.contractAddress}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 text-slate-600 border-t border-slate-200">
                <span>
                  Anchor Block: <strong className="text-slate-900">#{result.answer.blockchain.blockNumber}</strong> (Polygon PoS)
                </span>
                {result.answer.blockchain.explorerUrl && (
                  <a
                    href={result.answer.blockchain.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0F2C59] hover:underline font-bold"
                  >
                    {lang === 'en-IN' ? 'Verify On-Chain on Polygonscan ↗' : 'पॉलीगॉनस्कैन पर ऑन-चेन सत्यापन देखें ↗'}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Social Share & Copy Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <span>💬</span> {t.shareWhatsApp}
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold transition border border-slate-300 cursor-pointer"
              >
                <span>🔗</span> {copied ? t.copied : t.copyLink}
              </button>
            </div>

            <div className="text-[11px] text-slate-500 italic">
              {lang === 'en-IN' ? 'ECI Statutory Roll Verification Protocol' : 'भारत निर्वाचन आयोग विधिक नामावली सत्यापन प्रोटोकॉल'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
