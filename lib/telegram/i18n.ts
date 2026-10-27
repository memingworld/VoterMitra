import { SUPPORTED_LANGUAGES, I18N_DICTIONARY, type LanguageCode } from '../languages';

export const BOT_LANGUAGES = SUPPORTED_LANGUAGES.map((l) => l.code);
export type BotLanguage = LanguageCode;

export const isBotLanguage = (value: string): value is BotLanguage =>
  BOT_LANGUAGES.includes(value as BotLanguage);

export function fromTelegramCode(code?: string): BotLanguage {
  if (!code) return 'hi-IN';
  const c = code.toLowerCase().trim();
  const match = SUPPORTED_LANGUAGES.find((l) => c.startsWith(l.code.split('-')[0]));
  return match ? match.code : 'hi-IN';
}

export interface LanguageStrings {
  label: string;
  verdicts: Record<string, string>;
  confidenceLevels: Record<string, string>;
  youAsked: string;
  confidence: string;
  basis: string;
  disclaimer: string;
  notUnderstood: string;
}

export const strings: Record<BotLanguage, LanguageStrings> = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => {
    const dict = I18N_DICTIONARY[l.code];
    return [
      l.code,
      {
        label: l.label,
        verdicts: dict.verdicts,
        confidenceLevels: {
          HIGH: dict.confidence.HIGH,
          MEDIUM: dict.confidence.MEDIUM,
          LOW: dict.confidence.LOW,
        },
        youAsked: l.code === 'hi-IN' ? 'आपका सवाल' : l.code === 'mr-IN' ? 'तुमचा प्रश्न' : 'Your Question',
        confidence: l.code === 'hi-IN' ? 'विश्वसनीयता स्तर' : 'Confidence Level',
        basis: l.code === 'hi-IN' ? 'सांख्यिकीय आधार एवं साक्ष्य' : 'Audit Evidence & Basis',
        disclaimer:
          'यह निष्कर्ष निर्वाचन नामावली के सांख्यिकीय ऑडिट पर आधारित है। This finding is based on mathematical audit of electoral revision rolls.',
        notUnderstood:
          'प्रश्न स्पष्ट नहीं हुआ। कृपया लिखकर या पुनः बोलकर पूछें। (Please type your query or try speaking again).',
      },
    ];
  }),
) as unknown as Record<BotLanguage, LanguageStrings>;
