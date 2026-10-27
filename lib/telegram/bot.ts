import 'server-only';
import { Bot, InputFile, InlineKeyboard } from 'grammy';
import { env } from '../env';
import { answerQuestion } from '../assistant';
import { fromTelegramCode, strings, type BotLanguage } from './i18n';
import { transcribe, synthesize } from '../gnani';
import { VOICE_MAP, SUPPORTED_LANGUAGES, type LanguageCode } from '../languages';

let botInstance: Bot | null = null;
const userLanguageMap = new Map<number, BotLanguage>();

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

export function getTelegramBot(): Bot | null {
  const token = env().TELEGRAM_BOT_TOKEN;
  if (!token) return null;

  if (botInstance) return botInstance;

  const bot = new Bot(token);

  // Command /start
  bot.command('start', async (ctx) => {
    const welcome =
      `🇮🇳 *भारत निर्वाचन आयोग | ELECTION COMMISSION OF INDIA*\n` +
      `*मतदाता मित्र (VoterMitra) — Electoral Roll Verification Bot*\n\n` +
      `नमस्कार ${ctx.from?.first_name || ''}! मैं **VoterMitra** हूँ — निर्वाचन नामावली सत्यापन एवं विसंगति जांच बॉट।\n\n` +
      `🌐 *कृपया अपनी पसंदीदा भाषा चुनें / Please choose your language:*`;

    await ctx.reply(welcome, {
      parse_mode: 'Markdown',
      reply_markup: getLanguageKeyboard(),
    });
  });

  // Command /language
  bot.command(['language', 'lang'], async (ctx) => {
    await ctx.reply(
      `🌐 *भाषा चयन (Choose Language)*\n\nनीचे दिए गए बटनों में से अपनी भाषा चुनें:`,
      {
        parse_mode: 'Markdown',
        reply_markup: getLanguageKeyboard(),
      }
    );
  });

  // Callback query for language selection
  bot.callbackQuery(/^lang:(.+)$/, async (ctx) => {
    const chosenLang = ctx.match[1] as BotLanguage;
    const userId = ctx.from?.id;

    if (userId) {
      userLanguageMap.set(userId, chosenLang);
    }

    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === chosenLang);
    const voiceName = VOICE_MAP[chosenLang as LanguageCode] || 'Nalini';

    await ctx.answerCallbackQuery({
      text: `✓ Language set to ${langObj?.englishName || chosenLang}`,
    });

    const confirmText =
      `✅ *भाषा सफलतापूर्वक चुनी गई: ${langObj?.label} (${langObj?.englishName})*\n` +
      `🎙️ *Gnani AI Voice:* ${voiceName} (timbre-v2.5)\n\n` +
      `अब आप सीधे सवाल पूछ सकते हैं:\n` +
      `📌 उदा: *"क्या पार्ट 4 में 49 महिलाओं के नाम कटे?"*\n` +
      `📌 उदा: *"Plot 12-B में कितने वोटर हैं?"*\n\n` +
      `मैं आपको प्रमाणित आंकड़ों और **ऑडियो वॉइस संदेश** में जवाब दूंगा!`;

    await ctx.reply(confirmText, { parse_mode: 'Markdown' });

    // Send a welcome voice greeting
    try {
      const greeting = `Welcome to VoterMitra. Language selected: ${langObj?.englishName || chosenLang}.`;
      const ttsResult = await synthesize(greeting, {
        language: chosenLang,
        voice: voiceName,
        format: 'ogg',
      });
      if (ttsResult?.audio) {
        await ctx.replyWithVoice(new InputFile(ttsResult.audio, `welcome_${chosenLang}.ogg`), {
          caption: `🎙️ ${langObj?.label} Voice Note (${voiceName} · Gnani AI)`,
        });
      }
    } catch {
      // Non-fatal
    }
  });

  // Text message handler
  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text.trim();
    if (text.startsWith('/')) return;

    const userId = ctx.from?.id;
    const lang = (userId && userLanguageMap.get(userId)) || fromTelegramCode(ctx.from?.language_code);
    const voiceName = VOICE_MAP[lang as LanguageCode] || 'Nalini';
    const s = strings[lang] || strings['hi-IN'];

    try {
      await ctx.replyWithChatAction('typing');
      const answer = await answerQuestion(text, lang, {
        source: 'TELEGRAM_TEXT',
        telegramUserId: userId,
      });

      const verdictStr = answer.verdict ? s.verdicts[answer.verdict] : 'Information';
      const confStr = answer.confidence ? s.confidenceLevels[answer.confidence] : '—';
      const baseUrl = env().PUBLIC_BASE_URL || 'https://voter-mitra-hack.vercel.app';
      const shareUrl = answer.auditId ? `\n\n🔗 *आधिकारिक सत्यापन पोर्टल:* ${baseUrl}/c/${answer.auditId}` : '';

      const replyText =
        `🔍 *${verdictStr}*\n` +
        `📊 *${s.confidence}:* ${confStr}\n\n` +
        `${answer.summary}\n\n` +
        `*${s.basis}:*\n` +
        answer.reasoning.map((r) => `• ${r}`).join('\n') +
        shareUrl +
        `\n\n🌐 _भाषा बदलने हेतु /language भेजें_`;

      // Also synthesize Gnani AI Voice response
      let ttsBuffer: Buffer | null = null;
      try {
        const spokenText = `${answer.spokenSummary}. ${answer.reasoning.slice(0, 2).join('. ')}`;
        const ttsResult = await synthesize(spokenText, {
          language: lang,
          voice: voiceName,
          format: 'ogg',
        });
        ttsBuffer = ttsResult.audio;
      } catch (ttsErr) {
        console.warn('[telegram] Voice synthesis skipped:', ttsErr);
      }

      await ctx.reply(replyText, { parse_mode: 'Markdown' });

      if (ttsBuffer) {
        await ctx.replyWithVoice(new InputFile(ttsBuffer, `response_${lang}.ogg`), {
          caption: `🎙️ आधिकारिक Gnani AI स्वर प्रतिक्रिया (${voiceName} · ${lang})`,
        });
      }
    } catch (err) {
      console.error('[telegram] text handler error:', err);
      await ctx.reply(s.notUnderstood);
    }
  });

  // Voice message handler
  bot.on('message:voice', async (ctx) => {
    const userId = ctx.from?.id;
    const lang = (userId && userLanguageMap.get(userId)) || fromTelegramCode(ctx.from?.language_code);
    const s = strings[lang] || strings['hi-IN'];

    try {
      await ctx.replyWithChatAction('record_voice');
      const file = await ctx.getFile();
      const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error('Failed to download voice file from Telegram');
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);

      // Attempt Gnani STT
      const sttResult = await transcribe(audioBuffer, {
        language: lang,
        mimeType: 'audio/ogg',
        filename: 'voice.ogg',
      });

      const questionText = sttResult.transcript.trim();

      if (!questionText) {
        await ctx.reply(
          `🎙️ **आवाज़ संदेश प्राप्त हुआ (Voice Note Received)**\n\nखाता सुरक्षा नीति के तहत सीधे वॉयस ट्रांसक्रिप्शन सक्रिय हो रहा है। कृपया अपना प्रश्न लिखकर भेजें (उदा: *"क्या पार्ट 4 में 49 महिलाओं के नाम कटे?"*)।\n\nमैं आपको त्वरित टेक्स्ट व **Gnani AI ऑडियो** में उत्तर दूंगा!`
        );
        return;
      }

      // Query Reasoning Engine
      const answer = await answerQuestion(questionText, lang, {
        source: 'TELEGRAM_VOICE',
        telegramUserId: userId,
        transcribedText: questionText,
      });

      const spokenText = `${answer.spokenSummary}. ${answer.reasoning.join('. ')}`;
      let ttsBuffer: Buffer | null = null;
      try {
        const ttsResult = await synthesize(spokenText, {
          language: lang,
          voice: VOICE_MAP[lang as LanguageCode] || 'Nalini',
          format: 'ogg',
        });
        ttsBuffer = ttsResult.audio;
      } catch (ttsErr) {
        console.warn('[telegram] TTS generation failed:', ttsErr);
      }

      const verdictStr = answer.verdict ? s.verdicts[answer.verdict] : 'Information';
      const baseUrl = env().PUBLIC_BASE_URL || 'https://voter-mitra-hack.vercel.app';
      const shareUrl = answer.auditId ? `\n🔗 ${baseUrl}/c/${answer.auditId}` : '';

      const caption =
        `🗣️ *${s.youAsked}:* "${questionText}"\n` +
        `🔍 *${verdictStr}*\n` +
        `${answer.summary}${shareUrl}`;

      if (ttsBuffer) {
        await ctx.replyWithVoice(new InputFile(ttsBuffer, 'verdict.ogg'), {
          caption,
          parse_mode: 'Markdown',
        });
      } else {
        await ctx.reply(caption, { parse_mode: 'Markdown' });
      }
    } catch (err) {
      console.error('[telegram] voice handler error:', err);
      await ctx.reply(s.notUnderstood);
    }
  });

  botInstance = bot;
  return botInstance;
}
