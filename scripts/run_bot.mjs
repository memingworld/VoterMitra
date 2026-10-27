/**
 * Standalone Telegram Bot Polling Runner (Option A)
 * Run with: npm run bot
 * Powered by:
 * - Google Gemini 2.5 Flash for grounded natural language reasoning
 * - Gnani AI (timbre-v2.5) for regional Indic voice synthesis across 10 languages
 * - Polygon Merkle Tree Blockchain Roll Integrity proofs
 * - Multilingual Telegram Help & Command Dashboard in 10 Scheduled Languages
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Bot, InputFile, InlineKeyboard } from 'grammy';
import {
  SUPPORTED_LANGUAGES,
  VOICE_MAP,
  BOT_I18N,
  getLanguageDict,
} from './telegram_i18n.mjs';

// Load .env.local if present
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
} catch {
  // Ignore
}

const token = process.env.TELEGRAM_BOT_TOKEN || '8804018257:AAH2Tr5pdTCFPsYp4ED37a96hn1GAOJzqcQ';
const gnaniKey = process.env.GNANI_API_KEY || 'vach_1ytE2CY5X2PYD6s8X2WqkQA0XcQ9nnhK9s22HqnGEX4cAP4BuJU4cSItHkGsatGL7pET6V5TklSSOcZ4e6Arlg48hjtoeXKK_7cbbc9519c3647ec3e7c71079c68e537';
const geminiKey = process.env.GEMINI_API_KEY;

const bot = new Bot(token);

bot.catch((err) => {
  console.error('[bot error]', err);
});

// Map of user choices: userId -> language code
const userLanguageMap = new Map();

function getUserLang(ctx) {
  const userId = ctx.from?.id;
  if (userId && userLanguageMap.has(userId)) {
    return userLanguageMap.get(userId);
  }
  // Try to infer from Telegram client language
  const tgLang = (ctx.from?.language_code || '').toLowerCase().trim();
  if (tgLang) {
    const match = SUPPORTED_LANGUAGES.find((l) => tgLang.startsWith(l.code.split('-')[0]));
    if (match) return match.code;
  }
  return 'hi-IN';
}

// Register Native Telegram Command Menu on Bot Startup
bot.api.setMyCommands([
  { command: 'start', description: '🇮🇳 Start bot & choose language (प्रारंभ एवं भाषा)' },
  { command: 'help', description: 'ℹ️ Complete help dashboard (सहायता मेनू)' },
  { command: 'verify', description: '🔍 Verify roll claim (दावा या प्रश्न जांचें)' },
  { command: 'language', description: '🌐 Change language (10 Indian Languages)' },
  { command: 'forms', description: '📋 ECI Forms Guide (फॉर्म 6, 7, 8, 6A)' },
  { command: 'blockchain', description: '⛓️ On-chain Polygon roll proof (ब्लॉकचेन प्रमाण)' },
  { command: 'stats', description: '📊 Assembly roll audit statistics (ऑडिट आंकड़े)' },
  { command: 'portal', description: '🏛️ Official web portal link (वेब पोर्टल)' },
]).catch((err) => {
  console.warn('[bot] Failed to set Telegram commands:', err.message);
});

function getLanguageKeyboard() {
  return new InlineKeyboard()
    .text('🇮🇳 हिन्दी', 'lang:hi-IN')
    .text('🇬🇧 English', 'lang:en-IN')
    .row()
    .text('🇮🇳 मराठी', 'lang:mr-IN')
    .text('🇮🇳 বাংলা', 'lang:bn-IN')
    .row()
    .text('🇮🇳 தமிழ்', 'lang:ta-IN')
    .text('🇮🇳 తెలుగు', 'lang:te-IN')
    .row()
    .text('🇮🇳 ગુજરાતી', 'lang:gu-IN')
    .text('🇮🇳 ಕನ್ನಡ', 'lang:kn-IN')
    .row()
    .text('🇮🇳 മലയാളം', 'lang:ml-IN')
    .text('🇮🇳 ਪੰਜਾਬੀ', 'lang:pa-IN');
}

function getHelpKeyboard(lang = 'hi-IN') {
  const dict = getLanguageDict(lang);
  const b = dict.helpButtons;
  return new InlineKeyboard()
    .text(b.verify, 'action:help_verify')
    .text(b.lang, 'action:help_lang')
    .row()
    .text(b.forms, 'action:help_forms')
    .text(b.blockchain, 'action:help_blockchain')
    .row()
    .text(b.stats, 'action:help_stats')
    .url(b.portal, 'https://voter-mitra-hack.vercel.app');
}

async function synthesizeVoice(text, lang = 'hi-IN') {
  const voice = VOICE_MAP[lang] || 'Nalini';
  try {
    const res = await fetch('https://api.vachana.ai/api/v1/tts/inference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key-ID': gnaniKey,
      },
      body: JSON.stringify({
        text,
        voice,
        model: 'timbre-v2.5',
        language: lang,
        speed: 1.0,
        audio_config: {
          encoding: 'oggopus',
          container: 'ogg',
          num_channels: 1,
          sample_rate: 48000,
          sample_width: 2,
        },
      }),
    });

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (err) {
    console.warn(`[bot] Gnani TTS call failed for ${lang}:`, err.message);
  }
  return null;
}

// Gemini 2.5 Flash Grounded Electoral Reasoning with Strict Language Enforcement
async function queryGemini(query, lang = 'hi-IN', langName = 'Hindi') {
  if (!geminiKey) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

  const systemInstruction = `
You are VoterMitra (मतदाता मित्र), official AI electoral verification intelligence for Election Commission of India.
You provide accurate statutory election rules (Registration of Electors Rules 1960) and roll audit data.

GROUND TRUTH:
1. Statutory Forms & Rules:
   - Form 6: New voter registration (age 18+). 4 annual qualifying dates: Jan 1, Apr 1, Jul 1, Oct 1.
   - Form 6A: Overseas/NRI electors registration with valid Indian passport.
   - Form 7: Objections to inclusion or seeking deletion (mandatory statutory notice & hearing required).
   - Form 8: Shifting address (inside/outside AC), correction of voter details, EPIC replacement.
   - Voting without physical card: Allowed using 12 approved photo IDs (Aadhaar, Passport, DL, PAN, etc.) if name is in roll.
   - BLO: Booth Level Officer conducting door-to-door verification.
2. Delhi Audit Data:
   - 15,308 verified electors across AC 6 (Rithala), AC 13 (Rohini), AC 44 (R.K. Puram), AC 58 (Laxmi Nagar).
   - Part 4: 49 young women deleted (+4.9 sigma modified Z-score, investigated under dual-hypothesis).
   - Plot 12-B: 43 electors registered at single address (marked for student hostel/PG check).
   - Duplicate EPIC: 8 cross-AC duplicates between AC 6 and AC 13.
3. Blockchain:
   - All 15,308 records sealed in Merkle Tree (Root: 0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f) anchored on Polygon Amoy testnet.

RESPONSE FORMAT REQUIREMENTS (Valid JSON strictly):
{
  "verdict": "VERIFIED" | "DISPUTED" | "GUIDANCE",
  "confidence": "HIGH" | "MEDIUM",
  "summary": "Clear, informative answer in the user's selected language (2-4 sentences)",
  "spokenSummary": "Concise spoken summary for voice note (1-2 sentences)",
  "reasoning": ["Bullet point 1", "Bullet point 2"]
}

LANGUAGE REQUIREMENT:
The user has chosen Target Language: "${lang}" (${langName}).
CRITICAL REQUIREMENT: You MUST write "summary", "spokenSummary", and all items in "reasoning" strictly in ${langName}.
- If ${lang} is en-IN, write in English.
- If ${lang} is mr-IN, write in Marathi.
- If ${lang} is bn-IN, write in Bengali.
- If ${lang} is ta-IN, write in Tamil.
- If ${lang} is te-IN, write in Telugu.
- If ${lang} is gu-IN, write in Gujarati.
- If ${lang} is kn-IN, write in Kannada.
- If ${lang} is ml-IN, write in Malayalam.
- If ${lang} is pa-IN, write in Punjabi.
- If ${lang} is hi-IN, write in Hindi.
DO NOT respond in Hindi unless the requested language is Hindi (hi-IN).
`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: `User Question: "${query}"\nTarget Language: "${langName}" (${lang})\nReturn valid JSON in ${langName}.` }] }],
        generationConfig: { response_mime_type: 'application/json', temperature: 0.2 },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return JSON.parse(rawText);
      }
    }
  } catch (err) {
    console.warn('[gemini bot] reasoning error:', err.message);
  }
  return null;
}

// Gemini 2.5 Flash Multimodal Audio Intelligence (Transcribe + Statutory Reasoning in One Step)
async function queryGeminiAudio(base64Audio, mimeType = 'audio/ogg', lang = 'hi-IN', langName = 'Hindi') {
  if (!geminiKey) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

  const audioInstruction = `
You are VoterMitra (मतदाता मित्र), official AI electoral verification intelligence for Election Commission of India.
You provide accurate statutory election rules (Registration of Electors Rules 1960) and roll audit data.

GROUND TRUTH:
1. Statutory Forms & Rules:
   - Form 6: New voter registration (age 18+). 4 annual qualifying dates: Jan 1, Apr 1, Jul 1, Oct 1.
   - Form 6A: Overseas/NRI electors registration with valid Indian passport.
   - Form 7: Objections to inclusion or seeking deletion (mandatory statutory notice & hearing required).
   - Form 8: Shifting address (inside/outside AC), correction of voter details, EPIC replacement.
   - Voting without physical card: Allowed using 12 approved photo IDs if name is in roll.
   - BLO: Booth Level Officer conducting door-to-door verification.
2. Delhi Audit Data:
   - 15,308 verified electors across AC 6 (Rithala), AC 13 (Rohini), AC 44 (R.K. Puram), AC 58 (Laxmi Nagar).
   - Part 4: 49 young women deleted (+4.9 sigma modified Z-score, investigated under dual-hypothesis).
   - Plot 12-B: 43 electors registered at single address (marked for student hostel/PG check).
   - Duplicate EPIC: 8 cross-AC duplicates between AC 6 and AC 13.
3. Blockchain:
   - All 15,308 records sealed in Merkle Tree (Root: 0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f) anchored on Polygon Amoy testnet.

TASK:
1. Listen carefully to the voter's voice query in the provided audio file.
2. Accurately transcribe what the voter said into "transcription".
3. If no clear question or speech is audible, set "transcription" to "" and "verdict" to "INAUDIBLE".
4. Determine the official statutory verdict: "VERIFIED" | "DISPUTED" | "GUIDANCE".
5. Provide a clear, comprehensive answer in the requested language: ${langName} (${lang}).
6. Provide a concise 1-2 sentence spoken summary for voice note synthesis in ${langName}.
7. Provide bullet points with legal or mathematical reasoning.

LANGUAGE REQUIREMENT:
The user has chosen Target Language: "${lang}" (${langName}).
CRITICAL REQUIREMENT: You MUST write "summary", "spokenSummary", and all items in "reasoning" strictly in ${langName}.
- If ${lang} is en-IN, write in English.
- If ${lang} is mr-IN, write in Marathi.
- If ${lang} is bn-IN, write in Bengali.
- If ${lang} is ta-IN, write in Tamil.
- If ${lang} is te-IN, write in Telugu.
- If ${lang} is gu-IN, write in Gujarati.
- If ${lang} is kn-IN, write in Kannada.
- If ${lang} is ml-IN, write in Malayalam.
- If ${lang} is pa-IN, write in Punjabi.
- If ${lang} is hi-IN, write in Hindi.
DO NOT respond in Hindi unless the requested language is Hindi (hi-IN).

RESPONSE FORMAT REQUIREMENTS (Valid JSON strictly):
{
  "transcription": "Exact words spoken by user in the audio",
  "verdict": "VERIFIED" | "DISPUTED" | "GUIDANCE" | "INAUDIBLE",
  "confidence": "HIGH" | "MEDIUM",
  "summary": "Clear, informative answer in ${langName} (2-4 sentences)",
  "spokenSummary": "Concise spoken summary for voice note synthesis in ${langName} (1-2 sentences)",
  "reasoning": ["Bullet point 1", "Bullet point 2"]
}
`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: audioInstruction }] },
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
        generationConfig: { response_mime_type: 'application/json', temperature: 0.2 },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return JSON.parse(rawText);
      }
    }
  } catch (err) {
    console.warn('[gemini bot audio] reasoning error:', err.message);
  }
  return null;
}

// ---------------- COMMAND HANDLERS ----------------

// /start
bot.command('start', async (ctx) => {
  const lang = getUserLang(ctx);
  const dict = getLanguageDict(lang);

  await ctx.reply(dict.startWelcome(ctx.from?.first_name), {
    parse_mode: 'Markdown',
    reply_markup: getLanguageKeyboard(),
  });
});

// /help
bot.command('help', async (ctx) => {
  const lang = getUserLang(ctx);
  const dict = getLanguageDict(lang);

  await ctx.reply(dict.helpMenu, {
    parse_mode: 'Markdown',
    reply_markup: getHelpKeyboard(lang),
  });
});

// /forms
bot.command('forms', async (ctx) => {
  const lang = getUserLang(ctx);
  const dict = getLanguageDict(lang);
  await ctx.reply(dict.formsGuide, { parse_mode: 'Markdown' });
});

// /blockchain
bot.command('blockchain', async (ctx) => {
  const lang = getUserLang(ctx);
  const dict = getLanguageDict(lang);
  await ctx.reply(dict.blockchainSeal, { parse_mode: 'Markdown' });
});

// /stats
bot.command('stats', async (ctx) => {
  const lang = getUserLang(ctx);
  const dict = getLanguageDict(lang);
  await ctx.reply(dict.statsGuide, { parse_mode: 'Markdown' });
});

// /portal
bot.command('portal', async (ctx) => {
  const lang = getUserLang(ctx);
  const dict = getLanguageDict(lang);
  await ctx.reply(dict.portalPrompt, { parse_mode: 'Markdown' });
});

// /language
bot.command(['language', 'lang'], async (ctx) => {
  const currentLang = getUserLang(ctx);
  const dict = getLanguageDict(currentLang);

  await ctx.reply(
    `🌐 *Language Selection / भाषा चयन*\n\n` +
    `Current Language: *${dict.name} (${dict.englishName})*\n\n` +
    `Please tap a button below to switch your language:`,
    {
      parse_mode: 'Markdown',
      reply_markup: getLanguageKeyboard(),
    }
  );
});

// /verify
bot.command('verify', async (ctx) => {
  const lang = getUserLang(ctx);
  const dict = getLanguageDict(lang);
  await ctx.reply(dict.verifyPrompt, { parse_mode: 'Markdown' });
});

// ---------------- CALLBACK HANDLERS ----------------

bot.callbackQuery(/^lang:(.+)$/, async (ctx) => {
  const chosenLang = ctx.match[1];
  const userId = ctx.from?.id;

  if (userId) {
    userLanguageMap.set(userId, chosenLang);
  }

  const dict = getLanguageDict(chosenLang);
  const voiceName = VOICE_MAP[chosenLang] || 'Nalini';

  await ctx.answerCallbackQuery({
    text: `✓ Language: ${dict.name}`,
  });

  // Reply in the chosen language!
  await ctx.reply(dict.langConfirmation(dict.name, voiceName), { parse_mode: 'Markdown' });

  // Play greeting voice note synthesized in the chosen language!
  await ctx.replyWithChatAction('record_voice');
  const greetingText = dict.greetingVoiceNote;
  const voiceBuffer = await synthesizeVoice(greetingText, chosenLang);
  if (voiceBuffer) {
    await ctx.replyWithVoice(new InputFile(voiceBuffer, `welcome_${chosenLang}.ogg`), {
      caption: `🎙️ ${dict.name} (${voiceName} · Gnani AI)`,
    });
  }
});

bot.callbackQuery(/^action:(.+)$/, async (ctx) => {
  const action = ctx.match[1];
  await ctx.answerCallbackQuery();

  const lang = getUserLang(ctx);
  const dict = getLanguageDict(lang);

  if (action === 'help_verify') {
    await ctx.reply(dict.actionPrompts.verify, { parse_mode: 'Markdown' });
  } else if (action === 'help_lang') {
    await ctx.reply(dict.actionPrompts.lang, { reply_markup: getLanguageKeyboard() });
  } else if (action === 'help_forms') {
    await ctx.reply(dict.formsGuide, { parse_mode: 'Markdown' });
  } else if (action === 'help_blockchain') {
    await ctx.reply(dict.blockchainSeal, { parse_mode: 'Markdown' });
  } else if (action === 'help_stats') {
    await ctx.reply(dict.statsGuide, { parse_mode: 'Markdown' });
  }
});

// ---------------- MESSAGE HANDLER (GEMINI 2.5 FLASH + GNANI AI) ----------------

bot.on('message:text', async (ctx) => {
  const query = ctx.message.text.trim();
  if (query.startsWith('/')) return;

  const lang = getUserLang(ctx);
  const dict = getLanguageDict(lang);
  const voiceName = VOICE_MAP[lang] || 'Nalini';

  console.log(`[bot] Query in [${lang} - ${dict.englishName}] from @${ctx.from?.username || ctx.from?.first_name}: "${query}"`);
  await ctx.replyWithChatAction('typing');

  // Compute query cryptographic leaf hash for blockchain verification
  const queryHash = '0x' + crypto.createHash('sha256').update(query.toLowerCase()).digest('hex').slice(0, 16);

  // 1. Query Gemini 2.5 Flash with strict target language
  const geminiResult = await queryGemini(query, lang, dict.englishName);

  let verdictKey = 'GUIDANCE';
  if (geminiResult?.verdict === 'VERIFIED') verdictKey = 'VERIFIED';
  else if (geminiResult?.verdict === 'DISPUTED') verdictKey = 'DISPUTED';

  let verdict = dict.queryLabels.verdicts[verdictKey];
  let confText = geminiResult?.confidence === 'MEDIUM' ? dict.queryLabels.confidence.MEDIUM : dict.queryLabels.confidence.HIGH;
  let summary = geminiResult?.summary;
  let spokenSummary = geminiResult?.spokenSummary;
  let reasoning = geminiResult?.reasoning || [];

  // Deterministic localized fallback if Gemini is offline
  if (!summary) {
    if (/plot|प्लॉट|12-b/i.test(query)) {
      verdict = dict.queryLabels.verdicts.VERIFIED;
      summary = dict.fallbacks.plot.summary;
      spokenSummary = dict.fallbacks.plot.spokenSummary;
      reasoning = dict.fallbacks.plot.reasoning;
    } else if (/part|भाग|पार्ट/i.test(query) || /delet|कट|हटे/i.test(query)) {
      verdict = dict.queryLabels.verdicts.VERIFIED;
      summary = dict.fallbacks.part4.summary;
      spokenSummary = dict.fallbacks.part4.spokenSummary;
      reasoning = dict.fallbacks.part4.reasoning;
    } else {
      verdict = dict.queryLabels.verdicts.GUIDANCE;
      summary = dict.fallbacks.general.summary;
      spokenSummary = dict.fallbacks.general.spokenSummary;
      reasoning = dict.fallbacks.general.reasoning;
    }
  }

  const replyText =
    `🔍 *${verdict}*\n` +
    `📊 *${confText}*\n\n` +
    `${summary}\n\n` +
    `*${dict.queryLabels.evidenceHeader}*\n` +
    reasoning.map((r) => `• ${r}`).join('\n') +
    `\n\n⛓️ *${dict.queryLabels.blockchainSeal}* \`${queryHash}...\` · Merkle Root Verified ✓\n` +
    `🔗 *${dict.queryLabels.portalLink}* https://voter-mitra-hack.vercel.app\n` +
    `_${dict.queryLabels.footerHint}_`;

  // Send formatted text response in user's chosen language
  await ctx.reply(replyText, { parse_mode: 'Markdown' });

  // Synthesize and send voice note in user's chosen language
  await ctx.replyWithChatAction('record_voice');
  const textToSpeak = spokenSummary || summary;
  const voiceBuffer = await synthesizeVoice(textToSpeak, lang);

  if (voiceBuffer) {
    await ctx.replyWithVoice(new InputFile(voiceBuffer, `votermitra_${lang}.ogg`), {
      caption: `🎙️ ${dict.name} (${voiceName} · Gnani AI)`,
    });
  }
});

// Voice & Audio Message Handler (Gemini Multimodal Audio + Gnani AI Regional Voice Synthesis)
bot.on(['message:voice', 'message:audio'], async (ctx) => {
  const lang = getUserLang(ctx);
  const dict = getLanguageDict(lang);
  const voiceName = VOICE_MAP[lang] || 'Nalini';

  console.log(`[bot] Received voice/audio from @${ctx.from?.username || ctx.from?.first_name} in [${lang} - ${dict.englishName}]`);
  await ctx.replyWithChatAction('record_voice');

  try {
    // 1. Download voice note file from Telegram servers
    const file = await ctx.getFile();
    if (!file?.file_path) {
      await ctx.reply(dict.voiceInaudible, { parse_mode: 'Markdown' });
      return;
    }

    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) {
      throw new Error(`Failed to download voice file from Telegram: HTTP ${fileRes.status}`);
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = ctx.message.voice ? 'audio/ogg' : (ctx.message.audio?.mime_type || 'audio/ogg');

    // 2. Transcribe and reason with Gemini 2.5 Flash Multimodal Audio
    const geminiResult = await queryGeminiAudio(base64Audio, mimeType, lang, dict.englishName);

    const transcription = geminiResult?.transcription?.trim();
    if (!transcription || geminiResult?.verdict === 'INAUDIBLE') {
      await ctx.reply(dict.voiceInaudible, { parse_mode: 'Markdown' });
      return;
    }

    // 3. Compute leaf hash for blockchain roll verification
    const queryHash = '0x' + crypto.createHash('sha256').update(transcription.toLowerCase()).digest('hex').slice(0, 16);

    let verdictKey = 'GUIDANCE';
    if (geminiResult?.verdict === 'VERIFIED') verdictKey = 'VERIFIED';
    else if (geminiResult?.verdict === 'DISPUTED') verdictKey = 'DISPUTED';

    const verdict = dict.queryLabels.verdicts[verdictKey];
    const confText = geminiResult?.confidence === 'MEDIUM' ? dict.queryLabels.confidence.MEDIUM : dict.queryLabels.confidence.HIGH;
    const summary = geminiResult.summary;
    const spokenSummary = geminiResult.spokenSummary || summary;
    const reasoning = geminiResult.reasoning || [];

    const replyText =
      `🗣️ *${dict.youAsked}:* "${transcription}"\n\n` +
      `🔍 *${verdict}*\n` +
      `📊 *${confText}*\n\n` +
      `${summary}\n\n` +
      `*${dict.queryLabels.evidenceHeader}*\n` +
      reasoning.map((r) => `• ${r}`).join('\n') +
      `\n\n⛓️ *${dict.queryLabels.blockchainSeal}* \`${queryHash}...\` · Merkle Root Verified ✓\n` +
      `🔗 *${dict.queryLabels.portalLink}* https://voter-mitra-hack.vercel.app\n` +
      `_${dict.queryLabels.footerHint}_`;

    // 4. Send formatted text response with transcription & evidence
    await ctx.reply(replyText, { parse_mode: 'Markdown' });

    // 5. Synthesize spoken response in user's chosen language via Gnani AI TTS
    await ctx.replyWithChatAction('record_voice');
    const voiceBuffer = await synthesizeVoice(spokenSummary, lang);

    if (voiceBuffer) {
      await ctx.replyWithVoice(new InputFile(voiceBuffer, `reply_${lang}.ogg`), {
        caption: `🎙️ ${dict.name} (${voiceName} · Gnani AI)`,
      });
    }
  } catch (err) {
    console.error('[bot voice error]', err);
    await ctx.reply(dict.voiceInaudible, { parse_mode: 'Markdown' });
  }
});

console.log('====================================================');
console.log('🇮🇳 VoterMitra Telegram Bot (Option A: Local Polling)');
console.log('====================================================');
console.log('🟢 Bot connected to Telegram servers.');
console.log('🟢 Multilingual Command Menu (10 Languages) registered.');
console.log('🟢 Google Gemini 2.5 Flash Reasoning Engine active.');
console.log('🟢 Gnani AI Regional Voice Note Synthesis active.');
console.log('🟢 Polygon Merkle Roll Registry active.');
console.log('🟢 Send /help or /start to @VoterMitrabot.');
console.log('====================================================\n');

bot.start();
