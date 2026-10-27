import 'server-only';
import { Bot, InputFile } from 'grammy';
import { env } from '../env';
import { answerQuestion } from '../assistant';
import { fromTelegramCode, strings } from './i18n';
import { transcribe, synthesize } from '../gnani';

let botInstance: Bot | null = null;

export function getTelegramBot(): Bot | null {
  const token = env().TELEGRAM_BOT_TOKEN;
  if (!token) return null;

  if (botInstance) return botInstance;

  const bot = new Bot(token);

  // Command /start
  bot.command('start', async (ctx) => {
    const lang = fromTelegramCode(ctx.from?.language_code);
    const welcome =
      lang === 'hi-IN'
        ? `🇮🇳 **भारत निर्वाचन आयोग — मतदाता मित्र (VoterMitra)**\n\nनमस्कार! मैं **VoterMitra** हूँ। आप मुझसे मतदाता सूची (Electoral Roll), विलोपन (Deletions), या किसी भी वायरल दावे के बारे में पूछ सकते हैं!\n\nउदा: *"क्या पार्ट 4 में 49 महिलाओं के नाम कटे?"*\n\nमैं आपको आधिकारिक आंकड़ों और **ऑडियो वॉइस संदेश** के साथ उत्तर दूंगा!`
        : `🇮🇳 **ELECTION COMMISSION OF INDIA — VoterMitra**\n\nWelcome! I am **VoterMitra**, an explainable electoral roll verification assistant.\n\nAsk any question or viral claim regarding draft revisions, voter deletions, or address overcrowding.\n\ne.g.: *"Were 49 women deleted in Part 4?"*\n\nI will answer with official audit statistics and voice responses!`;

    await ctx.reply(welcome, { parse_mode: 'Markdown' });
  });

  // Text message handler
  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text.trim();
    if (text.startsWith('/')) return;

    const lang = fromTelegramCode(ctx.from?.language_code);
    const userId = ctx.from?.id;
    const s = strings[lang];

    try {
      await ctx.replyWithChatAction('typing');
      const answer = await answerQuestion(text, lang, {
        source: 'TELEGRAM_TEXT',
        telegramUserId: userId,
      });

      const verdictStr = answer.verdict ? s.verdicts[answer.verdict] : 'Information';
      const confStr = answer.confidence ? s.confidenceLevels[answer.confidence] : '—';
      const baseUrl = env().PUBLIC_BASE_URL || 'https://votermitra-hack.vercel.app';
      const shareUrl = answer.auditId ? `\n\n🔗 *आधिकारिक सत्यापन पोर्टल:* ${baseUrl}/c/${answer.auditId}` : '';

      const replyText =
        `🔍 *${verdictStr}*\n` +
        `📊 *${s.confidence}:* ${confStr}\n\n` +
        `${answer.summary}\n\n` +
        `*${s.basis}:*\n` +
        answer.reasoning.map((r) => `• ${r}`).join('\n') +
        shareUrl;

      // Also synthesize Gnani AI Voice response
      let ttsBuffer: Buffer | null = null;
      try {
        const spokenText = `${answer.spokenSummary}. ${answer.reasoning.slice(0, 2).join('. ')}`;
        const ttsResult = await synthesize(spokenText, {
          language: lang,
          format: 'ogg',
        });
        ttsBuffer = ttsResult.audio;
      } catch (ttsErr) {
        console.warn('[telegram] Voice synthesis skipped:', ttsErr);
      }

      await ctx.reply(replyText, { parse_mode: 'Markdown' });

      if (ttsBuffer) {
        await ctx.replyWithVoice(new InputFile(ttsBuffer, 'response.ogg'), {
          caption: `🎙️ आधिकारिक Gnani AI स्वर प्रतिक्रिया (${lang})`,
        });
      }
    } catch (err) {
      console.error('[telegram] text handler error:', err);
      await ctx.reply(s.notUnderstood);
    }
  });

  // Voice message handler
  bot.on('message:voice', async (ctx) => {
    const lang = fromTelegramCode(ctx.from?.language_code);
    const userId = ctx.from?.id;
    const s = strings[lang];

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
          format: 'ogg',
        });
        ttsBuffer = ttsResult.audio;
      } catch (ttsErr) {
        console.warn('[telegram] TTS generation failed:', ttsErr);
      }

      const verdictStr = answer.verdict ? s.verdicts[answer.verdict] : 'Information';
      const baseUrl = env().PUBLIC_BASE_URL || 'https://votermitra-hack.vercel.app';
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
