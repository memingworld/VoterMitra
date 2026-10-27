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
        ? `👋 नमस्कार! मैं **VoterMitra** (मतदाता मित्र) हूँ।\n\nआप मुझसे मतदाता सूची से जुड़ा कोई भी सवाल या वायरल दावा पूछ सकते हैं — लिखकर या सीधे **वॉयस नोट (वॉइस मैसेज)** भेजकर!\n\nउदा: "क्या पार्ट 4 में 15000 नाम कटे?"`
        : `👋 Welcome! I am **VoterMitra**.\n\nAsk any question or viral claim about the electoral roll — type it or send a **voice message** directly!\n\ne.g.: "Were 15,000 names removed in Part 4?"`;

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
      const baseUrl = env().PUBLIC_BASE_URL || 'https://votermitra.vercel.app';
      const shareUrl = answer.auditId ? `\n\n🔗 ${baseUrl}/c/${answer.auditId}` : '';

      const replyText =
        `🔍 *${verdictStr}*\n` +
        `📊 *${s.confidence}:* ${confStr}\n\n` +
        `${answer.summary}\n\n` +
        `*${s.basis}:*\n` +
        answer.reasoning.map((r) => `• ${r}`).join('\n') +
        shareUrl;

      await ctx.reply(replyText, { parse_mode: 'Markdown' });
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

      // Download voice file directly (Telegram sends native audio/ogg; codecs=opus)
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error('Failed to download voice file from Telegram');
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);

      // 1. Gnani STT
      const sttResult = await transcribe(audioBuffer, {
        language: lang,
        mimeType: 'audio/ogg',
        filename: 'voice.ogg',
      });

      const questionText = sttResult.transcript;
      if (!questionText || questionText.trim().length === 0) {
        await ctx.reply(s.notUnderstood);
        return;
      }

      // 2. Query Reasoning Engine
      const answer = await answerQuestion(questionText, lang, {
        source: 'TELEGRAM_VOICE',
        telegramUserId: userId,
        transcribedText: questionText,
      });

      // 3. Gnani TTS Voice Synthesis (Request native OGG/Opus for instant voice bubble)
      const spokenText = `${answer.spokenSummary}. ${answer.reasoning.join('. ')}`;
      let ttsBuffer: Buffer | null = null;
      try {
        const ttsResult = await synthesize(spokenText, {
          language: lang,
          format: 'ogg',
        });
        ttsBuffer = ttsResult.audio;
      } catch (ttsErr) {
        console.warn('[telegram] TTS generation failed, falling back to text:', ttsErr);
      }

      const verdictStr = answer.verdict ? s.verdicts[answer.verdict] : 'Information';
      const baseUrl = env().PUBLIC_BASE_URL || 'https://votermitra.vercel.app';
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
