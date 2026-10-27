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

const SYSTEM_INSTRUCTION = `
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
Write "summary", "spokenSummary", and "reasoning" in the user's requested language.
Do NOT output markdown code fences around JSON if possible, just raw JSON.
`;

export async function askGemini(
  query: string,
  lang: LanguageCode = 'hi-IN',
): Promise<GeminiAuditResult | null> {
  const apiKey = env().GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `User Query: "${query}"\nTarget Language Code: "${lang}"\nAnalyze this query and return the JSON response.`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
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
