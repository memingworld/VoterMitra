import 'server-only';
import { Bot, InputFile, InlineKeyboard } from 'grammy';
import { env } from '../env';
import { answerQuestion } from '../assistant';
import { fromTelegramCode, type BotLanguage } from './i18n';
import { getLanguageDict, type TelegramLangDict } from './i18n_dict';
import { transcribe, synthesize } from '../gnani';
import { VOICE_MAP, SUPPORTED_LANGUAGES, type LanguageCode } from '../languages';
import { REGISTRY_CONTRACT, MASTER_MERKLE_ROOT, EXPLORER_BASE } from '../blockchain/merkle';

let botInstance: Bot | null = null;
const userLanguageMap = new Map<number, LanguageCode>();

function getUserLang(userId?: number, tgCode?: string): LanguageCode {
  if (userId && userLanguageMap.has(userId)) {
    return userLanguageMap.get(userId)!;
  }
  if (tgCode) {
    const code = tgCode.toLowerCase().trim();
    const matched = SUPPORTED_LANGUAGES.find((l) => code.startsWith(l.code.split('-')[0]));
    if (matched) return matched.code;
  }
  return 'hi-IN';
}

function getLanguageKeyboard(): InlineKeyboard {
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

function getHelpKeyboard(lang: LanguageCode = 'hi-IN'): InlineKeyboard {
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

export function getTelegramBot(): Bot | null {
  const token = env().TELEGRAM_BOT_TOKEN;
  if (!token) return null;

  if (botInstance) return botInstance;

  const bot = new Bot(token);

  // Register Native Command Menu
  bot.api
    .setMyCommands([
      { command: 'start', description: '🇮🇳 Start bot & choose language (प्रारंभ एवं भाषा)' },
      { command: 'help', description: 'ℹ️ Complete help dashboard (सहायता मेनू)' },
      { command: 'verify', description: '🔍 Verify roll claim (दावा या प्रश्न जांचें)' },
      { command: 'language', description: '🌐 Change language (10 Indian Languages)' },
      { command: 'forms', description: '📋 ECI Forms Guide (फॉर्म 6, 7, 8, 6A)' },
      { command: 'blockchain', description: '⛓️ On-chain Polygon roll proof (ब्लॉकचेन प्रमाण)' },
      { command: 'stats', description: '📊 Assembly roll audit statistics (ऑडिट आंकड़े)' },
      { command: 'portal', description: '🏛️ Official web portal link (वेब पोर्टल)' },
    ])
    .catch((err) => {
      console.warn('[telegram webhook] setMyCommands failed:', err);
    });

  // Command /start
  bot.command('start', async (ctx) => {
    const lang = getUserLang(ctx.from?.id, ctx.from?.language_code);
    const dict = getLanguageDict(lang);

    await ctx.reply(dict.startWelcome(ctx.from?.first_name), {
      parse_mode: 'Markdown',
      reply_markup: getLanguageKeyboard(),
    });
  });

  // Command /help
  bot.command('help', async (ctx) => {
    const lang = getUserLang(ctx.from?.id, ctx.from?.language_code);
    const dict = getLanguageDict(lang);

    await ctx.reply(dict.helpMenu, {
      parse_mode: 'Markdown',
      reply_markup: getHelpKeyboard(lang),
    });
  });

  // Command /forms
  bot.command('forms', async (ctx) => {
    const lang = getUserLang(ctx.from?.id, ctx.from?.language_code);
    const dict = getLanguageDict(lang);
    await ctx.reply(dict.formsGuide, { parse_mode: 'Markdown' });
  });

  // Command /blockchain
  bot.command('blockchain', async (ctx) => {
    const lang = getUserLang(ctx.from?.id, ctx.from?.language_code);
    const dict = getLanguageDict(lang);
    await ctx.reply(dict.blockchainSeal, { parse_mode: 'Markdown' });
  });

  // Command /stats
  bot.command('stats', async (ctx) => {
    const lang = getUserLang(ctx.from?.id, ctx.from?.language_code);
    const dict = getLanguageDict(lang);
    await ctx.reply(dict.statsGuide, { parse_mode: 'Markdown' });
  });

  // Command /portal
  bot.command('portal', async (ctx) => {
    const lang = getUserLang(ctx.from?.id, ctx.from?.language_code);
    const dict = getLanguageDict(lang);
    await ctx.reply(dict.portalPrompt, { parse_mode: 'Markdown' });
  });

  // Command /language
  bot.command(['language', 'lang'], async (ctx) => {
    const lang = getUserLang(ctx.from?.id, ctx.from?.language_code);
    const dict = getLanguageDict(lang);

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

  // Command /verify
  bot.command('verify', async (ctx) => {
    const lang = getUserLang(ctx.from?.id, ctx.from?.language_code);
    const dict = getLanguageDict(lang);
    await ctx.reply(dict.verifyPrompt, { parse_mode: 'Markdown' });
  });

  // Language callback query
  bot.callbackQuery(/^lang:(.+)$/, async (ctx) => {
    const chosenLang = ctx.match[1] as LanguageCode;
    const userId = ctx.from?.id;

    if (userId) {
      userLanguageMap.set(userId, chosenLang);
    }

    const dict = getLanguageDict(chosenLang);
    const voiceName = VOICE_MAP[chosenLang] || 'Nalini';

    await ctx.answerCallbackQuery({
      text: `✓ Language: ${dict.name}`,
    });

    await ctx.reply(dict.langConfirmation(dict.name, voiceName), { parse_mode: 'Markdown' });

    // Voice note greeting in the chosen language
    try {
      await ctx.replyWithChatAction('record_voice');
      const ttsResult = await synthesize(dict.greetingVoiceNote, {
        language: chosenLang,
        voice: voiceName,
        format: 'ogg',
      });
      if (ttsResult.audio) {
        await ctx.replyWithVoice(new InputFile(ttsResult.audio, `welcome_${chosenLang}.ogg`), {
          caption: `🎙️ ${dict.name} (${voiceName} · Gnani AI)`,
        });
      }
    } catch (e) {
      console.warn('[telegram webhook] greeting voice note error:', e);
    }
  });

  // Action callbacks
  bot.callbackQuery(/^action:(.+)$/, async (ctx) => {
    const action = ctx.match[1];
    await ctx.answerCallbackQuery();

    const lang = getUserLang(ctx.from?.id, ctx.from?.language_code);
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

  // Text message handler
  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text.trim();
    if (text.startsWith('/')) return;

    const userId = ctx.from?.id;
    const lang = getUserLang(userId, ctx.from?.language_code);
    const dict = getLanguageDict(lang);
    const voiceName = VOICE_MAP[lang] || 'Nalini';

    try {
      await ctx.replyWithChatAction('typing');
      const answer = await answerQuestion(text, lang, {
        source: 'TELEGRAM_TEXT',
        telegramUserId: userId,
      });

      const verdictStr =
        dict.queryLabels.verdicts[answer.verdict as keyof typeof dict.queryLabels.verdicts] ||
        dict.queryLabels.verdicts.GUIDANCE;
      const confStr =
        answer.confidence === 'MEDIUM' ? dict.queryLabels.confidence.MEDIUM : dict.queryLabels.confidence.HIGH;
      const baseUrl = env().PUBLIC_BASE_URL || 'https://voter-mitra-hack.vercel.app';
      const shareUrl = answer.auditId ? `\n\n🔗 *${dict.queryLabels.portalLink}* ${baseUrl}/c/${answer.auditId}` : '';
      const bcProof = answer.blockchain
        ? `\n\n⛓️ *${dict.queryLabels.blockchainSeal}* \`${answer.blockchain.electorOrQueryHash.slice(0, 16)}...\` · Block #${answer.blockchain.blockNumber}`
        : '';

      const replyText =
        `🔍 *${verdictStr}*\n` +
        `📊 *${confStr}*\n\n` +
        `${answer.summary}\n\n` +
        `*${dict.queryLabels.evidenceHeader}*\n` +
        answer.reasoning.map((r) => `• ${r}`).join('\n') +
        bcProof +
        shareUrl +
        `\n\n🌐 _${dict.queryLabels.footerHint}_`;

      // Synthesize Gnani AI Voice response in the target language
      let ttsBuffer: Buffer | null = null;
      try {
        const spokenText = `${answer.spokenSummary || answer.summary}`;
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
          caption: `🎙️ ${dict.name} (${voiceName} · Gnani AI)`,
        });
      }
    } catch (err) {
      console.error('[telegram] text handler error:', err);
      await ctx.reply(dict.fallbacks.general.summary);
    }
  });

  // Voice message handler
  bot.on('message:voice', async (ctx) => {
    const userId = ctx.from?.id;
    const lang = getUserLang(userId, ctx.from?.language_code);
    const dict = getLanguageDict(lang);

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
        await ctx.reply(dict.voiceReceived, { parse_mode: 'Markdown' });
        return;
      }

      const answer = await answerQuestion(questionText, lang, {
        source: 'TELEGRAM_VOICE',
        telegramUserId: userId,
        transcribedText: questionText,
      });

      const spokenText = `${answer.spokenSummary || answer.summary}`;
      let ttsBuffer: Buffer | null = null;
      try {
        const ttsResult = await synthesize(spokenText, {
          language: lang,
          voice: VOICE_MAP[lang] || 'Nalini',
          format: 'ogg',
        });
        ttsBuffer = ttsResult.audio;
      } catch (ttsErr) {
        console.warn('[telegram] TTS generation failed:', ttsErr);
      }

      const verdictStr =
        dict.queryLabels.verdicts[answer.verdict as keyof typeof dict.queryLabels.verdicts] ||
        dict.queryLabels.verdicts.GUIDANCE;
      const baseUrl = env().PUBLIC_BASE_URL || 'https://voter-mitra-hack.vercel.app';
      const shareUrl = answer.auditId ? `\n🔗 ${baseUrl}/c/${answer.auditId}` : '';

      const caption =
        `🗣️ *${dict.englishName}:* "${questionText}"\n` +
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
      await ctx.reply(dict.voiceReceived, { parse_mode: 'Markdown' });
    }
  });

  botInstance = bot;
  return botInstance;
}
