import { env } from './env';
import type { LanguageCode } from './languages';

export interface GeminiAuditResult {
  verdict: 'VERIFIED' | 'DISPUTED' | 'NOT_PROVABLE';
  confidence: 'HIGH' | 'MEDIUM';
  category: 'STATUTORY_GUIDE' | 'ANOMALY_AUDIT' | 'DEMOGRAPHIC_STATS' | 'BLOCKCHAIN_VERIFY';
  summary: string;
  spokenSummary: string;
  reasoning: string[];
  sources: string[];
}

function getSystemInstruction(lang: string, langName: string): string {
  return `
You are VoterMitra (मतदाता मित्र), the official AI electoral verification intelligence of the Election Commission of India (ECI).
Your mission is to provide accurate, transparent, and authoritative guidance on electoral roll audits, ECI statutory rules, and citizen voter rights.

KNOWLEDGE BASE & GROUND TRUTH:
1. Statutory ECI Forms & Rules (Registration of Electors Rules, 1960):
   - Form 6: Application for inclusion of name in electoral roll for first-time / new voters (age 18+). Four qualifying dates per year: 1st January, 1st April, 1st July, 1st October.
   - Form 6A: Application for overseas electors (NRIs holding valid Indian passport without foreign citizenship).
   - Form 7: Application for objection to proposed inclusion or deletion of an existing name. Requires mandatory notice and BLO field hearing before any deletion.
   - Form 8: Application for correction of entries, shifting of residence (within or to another Assembly Constituency), replacement of EPIC without alteration, and marking of PwD.
   - BLO (Booth Level Officer): Grassroots official appointed by ECI under Section 13B(2) for door-to-door enumeration, notice serving, and field inspection.
   - Voting without physical EPIC: A registered voter whose name appears in the voter list can vote using 12 approved photo identity cards (Aadhaar, Passport, Driving License, PAN card, Service ID, Bank passbook with photo, MNREGA job card, Health insurance smart card, Pension document with photo).
   - Special Summary Revision (SSR): Annual statutory process for roll revision with draft publication, claims & objections period, and final publication.

2. Delhi Assembly Electoral Roll Mathematical Audit Data:
   - Exactly 15,308 electors audited across 23 booths in 4 constituencies: AC 6 (Rithala), AC 13 (Rohini), AC 44 (R.K. Puram), AC 58 (Laxmi Nagar).
   - Total baseline electors: 14,603; revised electors: 15,016; deletions: 421; additions: 834.
   - 49 verified statistical anomalies flagged with 100% recall (40/40 planted ground-truth cases caught, zero false removals).
   - Part 4 (AC 13 Rohini): 49 young female voters deleted (Modified Z-Score: +4.9 sigma). Two competing hypotheses: Form 8 post-marriage relocation vs administrative omission. BLO door-to-door inspection issued.
   - Plot 12-B Basement (AC 13 Part 4): 43 electors registered at single address (surname entropy 48%). Flagged as address overcrowding; plausible cause: student hostel / PG.
   - Cross-AC Duplicate EPICs: 8 suspect duplicate pairs identified between AC 6 and AC 13 with Levenshtein fuzzy similarity score 0.94.

3. Blockchain Roll Integrity (Polygon Amoy Testnet):
   - All 15,308 elector records are hashed into cryptographic Merkle Trees.
   - Master Roll Merkle Root: 0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f.
   - Smart Contract: ElectoralRollRegistry (0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B).
   - Prevents silent roll tampering, post-deadline modifications, and ghost additions.

RESPONSE FORMAT REQUIREMENTS:
Always respond with a valid JSON object strictly matching this schema:
{
  "verdict": "VERIFIED" | "DISPUTED" | "NOT_PROVABLE",
  "confidence": "HIGH" | "MEDIUM",
  "category": "STATUTORY_GUIDE" | "ANOMALY_AUDIT" | "DEMOGRAPHIC_STATS" | "BLOCKCHAIN_VERIFY",
  "summary": "Clear, comprehensive answer in the requested language (2-4 sentences)",
  "spokenSummary": "Concise 1-2 sentence spoken summary for voice note synthesis",
  "reasoning": ["Bullet point 1 with legal or mathematical basis", "Bullet point 2 with concrete details"],
  "sources": ["ECI Registration of Electors Rules 1960", "Delhi Electoral Roll Audit Benchmark"]
}

LANGUAGE REQUIREMENT:
The user has selected Target Language: "${lang}" (${langName}).
CRITICAL REQUIREMENT: You MUST write "summary", "spokenSummary", and all items in "reasoning" strictly in the target language (${langName}).
- If Target Language is English (en-IN), write entirely in English.
- If Target Language is Marathi (mr-IN), write entirely in Marathi.
- If Target Language is Bengali (bn-IN), write entirely in Bengali.
- If Target Language is Tamil (ta-IN), write entirely in Tamil.
- If Target Language is Telugu (te-IN), write entirely in Telugu.
- If Target Language is Gujarati (gu-IN), write entirely in Gujarati.
- If Target Language is Kannada (kn-IN), write entirely in Kannada.
- If Target Language is Malayalam (ml-IN), write entirely in Malayalam.
- If Target Language is Punjabi (pa-IN), write entirely in Punjabi.
- If Target Language is Hindi (hi-IN), write entirely in Hindi.
DO NOT use Hindi unless the requested Target Language is Hindi (hi-IN).
Do NOT output markdown code fences around JSON if possible, just raw JSON.
`;
}

export async function askGemini(
  query: string,
  lang: LanguageCode = 'hi-IN',
): Promise<GeminiAuditResult | null> {
  const apiKey = env().GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const langNames: Record<string, string> = {
    'hi-IN': 'Hindi',
    'en-IN': 'English',
    'mr-IN': 'Marathi',
    'bn-IN': 'Bengali',
    'ta-IN': 'Tamil',
    'te-IN': 'Telugu',
    'gu-IN': 'Gujarati',
    'kn-IN': 'Kannada',
    'ml-IN': 'Malayalam',
    'pa-IN': 'Punjabi',
  };
  const langName = langNames[lang] || 'Hindi';

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

  const prompt = `User Query: "${query}"\nTarget Language: "${langName}" (Language Code: "${lang}")\nAnalyze this query and return the JSON response in ${langName}.`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: getSystemInstruction(lang, langName) }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.2,
        },
      }),
    });

    if (!res.ok) {
      console.warn(`[gemini] API call returned status ${res.status}`);
      return null;
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText) as GeminiAuditResult;
    if (parsed.summary && parsed.spokenSummary) {
      return parsed;
    }
  } catch (err) {
    console.warn('[gemini] Reasoning call failed:', err instanceof Error ? err.message : err);
  }

  return null;
}

export interface GeminiAudioAuditResult extends GeminiAuditResult {
  transcription: string;
}

export async function askGeminiAudio(
  base64Audio: string,
  mimeType: string = 'audio/ogg',
  lang: LanguageCode = 'hi-IN',
): Promise<GeminiAudioAuditResult | null> {
  const apiKey = env().GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const langNames: Record<string, string> = {
    'hi-IN': 'Hindi',
    'en-IN': 'English',
    'mr-IN': 'Marathi',
    'bn-IN': 'Bengali',
    'ta-IN': 'Tamil',
    'te-IN': 'Telugu',
    'gu-IN': 'Gujarati',
    'kn-IN': 'Kannada',
    'ml-IN': 'Malayalam',
    'pa-IN': 'Punjabi',
  };
  const langName = langNames[lang] || 'Hindi';

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

  const audioInstruction = `
You are VoterMitra (मतदाता मित्र), the official AI electoral verification intelligence of the Election Commission of India (ECI).
Your mission is to provide accurate, transparent, and authoritative guidance on electoral roll audits, ECI statutory rules, and citizen voter rights.

KNOWLEDGE BASE & GROUND TRUTH:
1. Statutory ECI Forms & Rules (Registration of Electors Rules, 1960):
   - Form 6: Application for inclusion of name in electoral roll for first-time / new voters (age 18+). Four qualifying dates per year: 1st January, 1st April, 1st July, 1st October.
   - Form 6A: Application for overseas electors (NRIs holding valid Indian passport without foreign citizenship).
   - Form 7: Application for objection to proposed inclusion or deletion of an existing name. Requires mandatory notice and BLO field hearing before any deletion.
   - Form 8: Application for correction of entries, shifting of residence (within or to another Assembly Constituency), replacement of EPIC without alteration, and marking of PwD.
   - BLO (Booth Level Officer): Grassroots official appointed by ECI under Section 13B(2) for door-to-door enumeration, notice serving, and field inspection.
   - Voting without physical EPIC: A registered voter whose name appears in the voter list can vote using 12 approved photo identity cards (Aadhaar, Passport, Driving License, PAN card, Service ID, Bank passbook with photo, MNREGA job card, Health insurance smart card, Pension document with photo).
   - Special Summary Revision (SSR): Annual statutory process for roll revision with draft publication, claims & objections period, and final publication.

2. Delhi Assembly Electoral Roll Mathematical Audit Data:
   - Exactly 15,308 electors audited across 23 booths in 4 constituencies: AC 6 (Rithala), AC 13 (Rohini), AC 44 (R.K. Puram), AC 58 (Laxmi Nagar).
   - Total baseline electors: 14,603; revised electors: 15,016; deletions: 421; additions: 834.
   - 49 verified statistical anomalies flagged with 100% recall (40/40 planted ground-truth cases caught, zero false removals).
   - Part 4 (AC 13 Rohini): 49 young female voters deleted (Modified Z-Score: +4.9 sigma). Two competing hypotheses: Form 8 post-marriage relocation vs administrative omission. BLO door-to-door inspection issued.
   - Plot 12-B Basement (AC 13 Part 4): 43 electors registered at single address (surname entropy 48%). Flagged as address overcrowding; plausible cause: student hostel / PG.
   - Cross-AC Duplicate EPICs: 8 suspect duplicate pairs identified between AC 6 and AC 13 with Levenshtein fuzzy similarity score 0.94.

3. Blockchain Roll Integrity (Polygon Amoy Testnet):
   - All 15,308 elector records are hashed into cryptographic Merkle Trees.
   - Master Roll Merkle Root: 0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f.
   - Smart Contract: ElectoralRollRegistry (0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B).

TASK:
1. Listen carefully to the voter's voice query in the provided audio file.
2. Transcribe the exact words spoken into the "transcription" field.
3. If no audible speech or question is detected, set "transcription" to "" and "verdict" to "NOT_PROVABLE".
4. Determine the official statutory verdict: "VERIFIED" | "DISPUTED" | "NOT_PROVABLE".
5. Provide a clear, comprehensive answer in the requested language: ${langName} (${lang}).
6. Provide a concise 1-2 sentence spoken summary for voice note synthesis in ${langName}.
7. Provide bullet points with legal or mathematical reasoning.

LANGUAGE REQUIREMENT:
The user has selected Target Language: "${lang}" (${langName}).
CRITICAL REQUIREMENT: You MUST write "summary", "spokenSummary", and all items in "reasoning" strictly in the target language (${langName}).
- If Target Language is English (en-IN), write entirely in English.
- If Target Language is Marathi (mr-IN), write entirely in Marathi.
- If Target Language is Bengali (bn-IN), write entirely in Bengali.
- If Target Language is Tamil (ta-IN), write entirely in Tamil.
- If Target Language is Telugu (te-IN), write entirely in Telugu.
- If Target Language is Gujarati (gu-IN), write entirely in Gujarati.
- If Target Language is Kannada (kn-IN), write entirely in Kannada.
- If Target Language is Malayalam (ml-IN), write entirely in Malayalam.
- If Target Language is Punjabi (pa-IN), write entirely in Punjabi.
- If Target Language is Hindi (hi-IN), write entirely in Hindi.
DO NOT use Hindi unless the requested Target Language is Hindi (hi-IN).

RESPONSE FORMAT REQUIREMENTS:
Always respond with a valid JSON object strictly matching this schema:
{
  "transcription": "Exact words spoken by user in the audio",
  "verdict": "VERIFIED" | "DISPUTED" | "NOT_PROVABLE",
  "confidence": "HIGH" | "MEDIUM",
  "category": "STATUTORY_GUIDE" | "ANOMALY_AUDIT" | "DEMOGRAPHIC_STATS" | "BLOCKCHAIN_VERIFY",
  "summary": "Clear, comprehensive answer in ${langName} (2-4 sentences)",
  "spokenSummary": "Concise 1-2 sentence spoken summary for voice note synthesis in ${langName}",
  "reasoning": ["Bullet point 1 with legal or mathematical basis", "Bullet point 2 with concrete details"],
  "sources": ["ECI Registration of Electors Rules 1960", "Delhi Electoral Roll Audit Benchmark"]
}
`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: audioInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Audio,
                },
              },
              {
                text: `Listen to this voice message from the voter. Transcribe it and provide the official ECI verification answer in ${langName}. Return valid JSON.`,
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.2,
        },
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      console.warn(`[gemini audio] API call returned status ${res.status}:`, errData?.error?.message || errData);
      return null;
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText) as GeminiAudioAuditResult;
    return parsed;
  } catch (err) {
    console.warn('[gemini audio] Reasoning call failed:', err instanceof Error ? err.message : err);
  }

  return null;
}
