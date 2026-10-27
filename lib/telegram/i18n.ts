export const BOT_LANGUAGES = ['hi-IN', 'en-IN', 'mr-IN'] as const;
export type BotLanguage = (typeof BOT_LANGUAGES)[number];

export const isBotLanguage = (value: string): value is BotLanguage =>
  (BOT_LANGUAGES as readonly string[]).includes(value as BotLanguage);

export function fromTelegramCode(code?: string): BotLanguage {
  if (!code) return 'hi-IN';
  const c = code.toLowerCase().trim();
  if (c.startsWith('mr')) return 'mr-IN';
  if (c.startsWith('en')) return 'en-IN';
  if (c.startsWith('hi')) return 'hi-IN';
  return 'hi-IN';
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

export const strings: Record<BotLanguage, LanguageStrings> = {
  'hi-IN': {
    label: 'हिंदी',
    verdicts: {
      VERIFIED: 'डेटा से प्रमाणित · Verified',
      DISPUTED: 'डेटा से विवादित · Disputed',
      NOT_PROVABLE: 'सार्वजनिक डेटा से सिद्ध नहीं · Not Provable',
      INFO: 'सूचना · Info',
    },
    confidenceLevels: {
      HIGH: 'उच्च (High)',
      MEDIUM: 'मध्यम (Medium)',
      LOW: 'निम्न (Low)',
    },
    youAsked: 'आपका सवाल',
    confidence: 'भरोसे का स्तर',
    basis: 'आधार और साक्ष्य',
    disclaimer:
      'यह निष्कर्ष केवल कृत्रिम परीक्षण डेटा के सांख्यिकीय विश्लेषण पर आधारित है। यह किसी गड़बड़ी या दुर्भावना का निष्कर्ष नहीं है।',
    notUnderstood: 'आवाज़ स्पष्ट नहीं समझ आई। कृपया फिर से प्रयास करें या लिखकर पूछें।',
  },
  'en-IN': {
    label: 'English',
    verdicts: {
      VERIFIED: 'Supported by the data · Verified',
      DISPUTED: 'Disputed by the data · Disputed',
      NOT_PROVABLE: 'Cannot be proven from public data · Not Provable',
      INFO: 'Information · Info',
    },
    confidenceLevels: {
      HIGH: 'High',
      MEDIUM: 'Medium',
      LOW: 'Low',
    },
    youAsked: 'You asked',
    confidence: 'Confidence',
    basis: 'Reasoning and evidence',
    disclaimer:
      'This finding is based strictly on statistical patterns in synthetic test data. It is not a finding of wrongdoing.',
    notUnderstood: 'Could not understand the audio clearly. Please try again or type your question.',
  },
  'mr-IN': {
    label: 'मराठी',
    verdicts: {
      VERIFIED: 'माहितीनुसार सत्यापित · Verified',
      DISPUTED: 'माहितीनुसार विवादित · Disputed',
      NOT_PROVABLE: 'सार्वजनिक माहितीवरून सिद्ध करता येत नाही · Not Provable',
      INFO: 'माहिती · Info',
    },
    confidenceLevels: {
      HIGH: 'उच्च (High)',
      MEDIUM: 'मध्यम (Medium)',
      LOW: 'कमी (Low)',
    },
    youAsked: 'तुमचा प्रश्न',
    confidence: 'विश्वास पातळी',
    basis: 'आधार आणि कारणे',
    disclaimer:
      'हे उत्तर केवळ चाचणी डेटाच्या सांख्यिकीय तपासणीवर आधारित आहे. कोणताही गैरप्रकार सूचित करत नाही.',
    notUnderstood: 'आवाज स्पष्ट समजला नाही. कृपया पुन्हा प्रयत्न करा किंवा टाईप करून विचारा.',
  },
};
