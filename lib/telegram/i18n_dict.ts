/**
 * Complete Multilingual Translation Dictionary for VoterMitra Telegram Bot (TypeScript)
 * Supports 10 Scheduled Indian Languages:
 * hi-IN, en-IN, mr-IN, bn-IN, ta-IN, te-IN, gu-IN, kn-IN, ml-IN, pa-IN
 */

import { type LanguageCode } from '../languages';

export interface TelegramLangDict {
  name: string;
  englishName: string;
  startWelcome: (name?: string) => string;
  helpMenu: string;
  helpButtons: {
    verify: string;
    lang: string;
    forms: string;
    blockchain: string;
    stats: string;
    portal: string;
  };
  formsGuide: string;
  blockchainSeal: string;
  statsGuide: string;
  verifyPrompt: string;
  portalPrompt: string;
  langConfirmation: (label: string, voice: string) => string;
  greetingVoiceNote: string;
  queryLabels: {
    verdicts: {
      VERIFIED: string;
      DISPUTED: string;
      GUIDANCE: string;
    };
    confidence: {
      HIGH: string;
      MEDIUM: string;
    };
    evidenceHeader: string;
    blockchainSeal: string;
    portalLink: string;
    footerHint: string;
  };
  fallbacks: {
    plot: {
      verdict: string;
      summary: string;
      spokenSummary: string;
      reasoning: string[];
    };
    part4: {
      verdict: string;
      summary: string;
      spokenSummary: string;
      reasoning: string[];
    };
    general: {
      verdict: string;
      summary: string;
      spokenSummary: string;
      reasoning: string[];
    };
  };
  voiceReceived: string;
  actionPrompts: {
    verify: string;
    lang: string;
  };
}

// Import or re-export from JS representation
import { BOT_I18N as JS_BOT_I18N } from '../../scripts/telegram_i18n.mjs';

export const BOT_I18N = JS_BOT_I18N as unknown as Record<LanguageCode, TelegramLangDict>;

export function getLanguageDict(langCode: LanguageCode | string): TelegramLangDict {
  const code = (langCode as LanguageCode) in BOT_I18N ? (langCode as LanguageCode) : 'hi-IN';
  return BOT_I18N[code] || BOT_I18N['hi-IN'];
}
