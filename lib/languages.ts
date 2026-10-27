export const SUPPORTED_LANGUAGES = [
  { code: 'hi-IN', label: 'हिन्दी', englishName: 'Hindi', voice: 'Nalini' },
  { code: 'en-IN', label: 'English', englishName: 'English', voice: 'Nalini' },
  { code: 'mr-IN', label: 'मराठी', englishName: 'Marathi', voice: 'Zahira' },
  { code: 'bn-IN', label: 'বাংলা', englishName: 'Bengali', voice: 'Kirra' },
  { code: 'ta-IN', label: 'தமிழ்', englishName: 'Tamil', voice: 'Asmita' },
  { code: 'te-IN', label: 'తెలుగు', englishName: 'Telugu', voice: 'Suhana' },
  { code: 'gu-IN', label: 'ગુજરાતી', englishName: 'Gujarati', voice: 'Falak' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ', englishName: 'Kannada', voice: 'Saanvi' },
  { code: 'ml-IN', label: 'മലയാളം', englishName: 'Malayalam', voice: 'Reshma' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', voice: 'Mehuli' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const VOICE_MAP: Record<LanguageCode, string> = {
  'hi-IN': 'Nalini',
  'en-IN': 'Nalini',
  'ta-IN': 'Asmita',
  'te-IN': 'Suhana',
  'bn-IN': 'Kirra',
  'gu-IN': 'Falak',
  'kn-IN': 'Saanvi',
  'ml-IN': 'Reshma',
  'mr-IN': 'Zahira',
  'pa-IN': 'Mehuli',
};

export interface LangUI {
  portalTitle: string;
  portalSub: string;
  checkTitle: string;
  checkSub: string;
  inputPlaceholder: string;
  btnCheck: string;
  btnChecking: string;
  btnVoice: string;
  btnListening: string;
  btnStop: string;
  verdicts: {
    VERIFIED: string;
    DISPUTED: string;
    NOT_PROVABLE: string;
  };
  confidence: {
    HIGH: string;
    MEDIUM: string;
    LOW: string;
  };
  examples: string[];
  audioLabel: string;
  shareWhatsApp: string;
  copyLink: string;
  copied: string;
}

export const I18N_DICTIONARY: Record<LanguageCode, LangUI> = {
  'hi-IN': {
    portalTitle: 'भारत निर्वाचन आयोग',
    portalSub: 'मतदाता मित्र — राष्ट्रीय मतदाता सूची सत्यापन एवं विसंगति जांच पोर्टल',
    checkTitle: 'मतदाता सूची से संबंधित दावा या प्रश्न जांचें',
    checkSub: 'मतदाता विलोपन, पता संकेंद्रण, डुप्लीकेट वोटर आईडी या सांख्यिकीय असंतुलन की तत्काल पुष्टि करें।',
    inputPlaceholder: 'उदा. क्या पार्ट 4 में 49 महिलाओं के नाम कटे? या प्लॉट 12-B में कितने वोटर हैं?',
    btnCheck: 'सत्यापन करें',
    btnChecking: 'डेटाबेस जांच जारी…',
    btnVoice: 'बोलकर पूछें',
    btnListening: 'सुन रहे हैं… बोलिए',
    btnStop: 'रोकें',
    verdicts: {
      VERIFIED: 'आधिकारिक रिकॉर्ड से प्रमाणित (Verified)',
      DISPUTED: 'आधिकारिक रिकॉर्ड से खंडित / विवादित (Disputed)',
      NOT_PROVABLE: 'सार्वजनिक रिकॉर्ड से अप्रमाणित (Not Provable)',
    },
    confidence: {
      HIGH: 'उच्च विश्वसनीयता (High Confidence)',
      MEDIUM: 'मध्यम विश्वसनीयता (Medium Confidence)',
      LOW: 'निम्न विश्वसनीयता (Low Confidence)',
    },
    examples: [
      'क्या पार्ट 4 में 49 महिलाओं के नाम कटे?',
      'प्लॉट 12-B में कितने मतदाता दर्ज हैं?',
      'पार्ट 8 में युवा मतदाताओं की स्थिति क्या है?',
    ],
    audioLabel: 'आधिकारिक ज्ञानी AI स्वर प्रतिक्रिया (Gnani Vachana Audio):',
    shareWhatsApp: 'व्हाट्सएप पर साझा करें',
    copyLink: 'लिंक कॉपी करें',
    copied: 'कॉपी हो गया ✓',
  },
  'en-IN': {
    portalTitle: 'ELECTION COMMISSION OF INDIA',
    portalSub: 'VoterMitra — National Electoral Roll Audit & Citizen Verification Portal',
    checkTitle: 'Verify Electoral Roll Claims & Queries',
    checkSub: 'Instant statistical audit against 15,308 verified electors across Delhi revision rolls.',
    inputPlaceholder: 'e.g. Were 49 women electors deleted in Part 4? Or how many voters at Plot 12-B?',
    btnCheck: 'Verify Claim',
    btnChecking: 'Auditing records…',
    btnVoice: 'Ask by Voice',
    btnListening: 'Listening… speak now',
    btnStop: 'Stop',
    verdicts: {
      VERIFIED: 'Confirmed by Official Roll Data (Verified)',
      DISPUTED: 'Disputed by Official Roll Data (Disputed)',
      NOT_PROVABLE: 'Inconclusive from Public Roll Data (Not Provable)',
    },
    confidence: {
      HIGH: 'High Confidence (100% Match)',
      MEDIUM: 'Moderate Confidence',
      LOW: 'Low Statistical Confidence',
    },
    examples: [
      'Were 49 women electors deleted in Part 4?',
      'How many electors are registered at Plot 12-B?',
      'Check duplicate EPIC entries in Part 8',
    ],
    audioLabel: 'Official Gnani Voice AI Audio Response (timbre-v2.5):',
    shareWhatsApp: 'Share on WhatsApp',
    copyLink: 'Copy Link',
    copied: 'Copied ✓',
  },
  'mr-IN': {
    portalTitle: 'भारतीय निवडणूक आयोग',
    portalSub: 'मतदार मित्र — राष्ट्रीय मतदार यादी पडताळणी व विसंगती निवारण पोर्टल',
    checkTitle: 'मतदार यादीबाबतचा व्हायरल दावा तपासा',
    checkSub: 'मतदार वगळणी, पत्ता गर्दी किंवा दुबार मतदार ओळखपत्राची अधिकृत माहिती मिळवा.',
    inputPlaceholder: 'उदा. भाग 4 मधून 49 महिलांची नावे वगळली का? किंवा प्लॉट 12-B मध्ये किती मतदार आहेत?',
    btnCheck: 'पडताळणी करा',
    btnChecking: 'तपासणी सुरू आहे…',
    btnVoice: 'बोलून विचारा',
    btnListening: 'ऐकत आहे… बोला',
    btnStop: 'थांबवा',
    verdicts: {
      VERIFIED: 'अधिकृत नोंदीनुसार सत्यापित (Verified)',
      DISPUTED: 'अधिकृत नोंदीनुसार विवादित (Disputed)',
      NOT_PROVABLE: 'सार्वजनिक नोंदीवरून सिद्ध नाही (Not Provable)',
    },
    confidence: {
      HIGH: 'उच्च विश्वासार्हता (High)',
      MEDIUM: 'मध्यम विश्वासार्हता (Medium)',
      LOW: 'कमी विश्वासार्हता (Low)',
    },
    examples: [
      'भाग 4 मधून 49 महिलांची नावे वगळली का?',
      'प्लॉट 12-B मध्ये किती मतदार नोंदणीकृत आहेत?',
      'भाग 8 मधील दुबार नाव तपासणी',
    ],
    audioLabel: 'अधिकृत ज्ञानी AI आवाज प्रतिसाद:',
    shareWhatsApp: 'WhatsApp वर शेअर करा',
    copyLink: 'लिंक कॉपी करा',
    copied: 'कॉपी झाले ✓',
  },
  'bn-IN': {
    portalTitle: 'ভারতের নির্বাচন কমিশন',
    portalSub: 'ভোটারমিত্র — জাতীয় ভোটার তালিকা যাচাইকরণ ও অসঙ্গতি পোর্টাল',
    checkTitle: 'ভোটার তালিকা সংক্রান্ত দাবি বা প্রশ্ন যাচাই করুন',
    checkSub: 'ভোটার অপসরণ, ঠিকানা একত্রীকরণ ও ডুপ্লিকেট ভোটার কার্ডের সত্যতা জানুন।',
    inputPlaceholder: 'যেমন: পার্ট 4 থেকে কি 49 জন মহিলার নাম বাদ পড়েছে?',
    btnCheck: 'যাচাই করুন',
    btnChecking: 'যাচাই চলছে…',
    btnVoice: 'ভয়েসে জিজ্ঞাসা করুন',
    btnListening: 'শুনছি… বলুন',
    btnStop: 'থামুন',
    verdicts: {
      VERIFIED: 'সরকারি নথি অনুযায়ী প্রমাণিত (Verified)',
      DISPUTED: 'সরকারি তথ্যানুযায়ী বিতর্কিত (Disputed)',
      NOT_PROVABLE: 'সার্বजनिक তথ্যে অপ্রমাণিত (Not Provable)',
    },
    confidence: {
      HIGH: 'উচ্চ নির্ভরযোগ্যতা (High)',
      MEDIUM: 'মাঝারি নির্ভরযোগ্যতা (Medium)',
      LOW: 'নিম্ন নির্ভরযোগ্যতা (Low)',
    },
    examples: [
      'পার্ট 4 থেকে কি 49 জন মহিলার নাম বাদ পড়েছে?',
      'প্লট 12-B তে কতজন ভোটার নিবন্ধিত?',
      'পার্ট 8 এ ডুপ্লিকেট ভোটার অনুসন্ধান',
    ],
    audioLabel: 'অফিসিয়াল জ্ঞানি ভয়েস প্রতিক্রিয়া:',
    shareWhatsApp: 'হোয়াটসঅ্যাপে শেয়ার করুন',
    copyLink: 'লিঙ্ক কপি করুন',
    copied: 'কপি হয়েছে ✓',
  },
  'ta-IN': {
    portalTitle: 'இந்திய தேர்தல் ஆணையம்',
    portalSub: 'வாக்காளர் மித்ரா — தேசிய வாக்காளர் பட்டியல் சரிபார்ப்பு தளம்',
    checkTitle: 'வாக்காளர் பட்டியல் புகார்கள் மற்றும் தகவல்களை சரிபார்க்கவும்',
    checkSub: 'வாக்காளர் நீக்கம் மற்றும் முகவரி முறைகேடுகளை உடனடியாக சரிபார்க்கவும்.',
    inputPlaceholder: 'எ.கா. பகுதி 4 இல் 49 பெண் வாக்காளர்கள் நீக்கப்பட்டனரா?',
    btnCheck: 'சரிபார்க்கவும்',
    btnChecking: 'ஆராய்ச்சி நடக்கிறது…',
    btnVoice: 'பேசி கேட்கவும்',
    btnListening: 'கேட்கிறது… பேசுங்கள்',
    btnStop: 'நிறுத்து',
    verdicts: {
      VERIFIED: 'அதிகாரப்பூர்வ தரவுகளால் சரிபார்க்கப்பட்டது (Verified)',
      DISPUTED: 'அதிகாரப்பூர்வ தகவல்களால் மறுக்கப்பட்டது (Disputed)',
      NOT_PROVABLE: 'பொது தரவுகளில் நிரூபிக்கப்படவில்லை (Not Provable)',
    },
    confidence: {
      HIGH: 'உயர் நம்பகத்தன்மை (High)',
      MEDIUM: 'நடுத்தர நம்பகத்தன்மை (Medium)',
      LOW: 'குறைந்த நம்பகத்தன்மை (Low)',
    },
    examples: [
      'பகுதி 4 இல் 49 பெண் வாக்காளர்கள் நீக்கப்பட்டனரா?',
      'பிளாட் 12-B இல் எத்தனை வாக்காளர்கள் உள்ளனர்?',
    ],
    audioLabel: 'அதிகாரப்பூர்வ ஞானி AI குரல் பதில்:',
    shareWhatsApp: 'வாட்ஸ்அப்பில் பகிரவும்',
    copyLink: 'இணைப்பை நகலெடுக்கவும்',
    copied: 'நகலெடுக்கப்பட்டது ✓',
  },
  'te-IN': {
    portalTitle: 'భారత ఎన్నికల సంఘం',
    portalSub: 'ఓటర్ మిత్ర — జాతీయ ఓటర్ల జాబితా ధృవీకరణ పోర్టల్',
    checkTitle: 'ఓటర్ల జాబితా క్లెయిమ్‌లను తనిఖీ చేయండి',
    checkSub: 'ఓటర్ల తొలగింపు మరియు చిరునామా రద్దీపై అధికారిక డేటా సమాచారం.',
    inputPlaceholder: 'ఉదా. పార్ట్ 4 లో 49 మంది మహిళా ఓటర్లు తొలగించబడ్డారా?',
    btnCheck: 'ధృవీకరించండి',
    btnChecking: 'తనిఖీ చేస్తోంది…',
    btnVoice: 'వాయిస్ ద్వారా అడగండి',
    btnListening: 'వింటోంది… మాట్లాడండి',
    btnStop: 'ఆపండి',
    verdicts: {
      VERIFIED: 'అధికారిక రికార్డుల ద్వారా ధృవీకరించబడింది (Verified)',
      DISPUTED: 'అధికారిక రికార్డులతో వివాదాస్పదం (Disputed)',
      NOT_PROVABLE: 'పబ్లిక్ డేటా ద్వారా నిరూపించబడలేదు (Not Provable)',
    },
    confidence: {
      HIGH: 'అధిక విశ్వసనీయత (High)',
      MEDIUM: 'మధ్యస్థ విశ్వసనీయత (Medium)',
      LOW: 'తక్కువ విశ్వసనీయత (Low)',
    },
    examples: [
      'పార్ట్ 4 లో 49 మంది మహిళా ఓటర్లు తొలగించబడ్డారా?',
      'ప్లాట్ 12-B లో ఎంతమంది ఓటర్లు నమోదయ్యారు?',
    ],
    audioLabel: 'అధికారిక జ్ఞాని AI వాయిస్ సమాధానం:',
    shareWhatsApp: 'వాట్సాప్‌లో షేర్ చేయండి',
    copyLink: 'లింక్ కాపీ చేయండి',
    copied: 'కాపీ చేయబడింది ✓',
  },
  'gu-IN': {
    portalTitle: 'ભારતનું ચૂંટણી પંચ',
    portalSub: 'મતદાર મિત્ર — રાષ્ટ્રીય મતદાર યાદી ચકાસણી પોર્ટલ',
    checkTitle: 'મતદાર યાદી વિષયક દાવાઓ અને પ્રશ્નોની ચકાસણી કરો',
    checkSub: 'મતદાર કમી અને સરનામાં ગીચતા અંગે તાત્કાલિક ચોક્કસ માહિતી મેળવો.',
    inputPlaceholder: 'દા.ત. ભાગ 4 માં 49 મહિલા મતદારો કમી થયા છે?',
    btnCheck: 'ચકાસો',
    btnChecking: 'તપાસ ચાલુ છે…',
    btnVoice: 'બોલીને પૂછો',
    btnListening: 'સાંભળી રહ્યા છીએ… બોલો',
    btnStop: 'અટકાવો',
    verdicts: {
      VERIFIED: 'સત્તાવાર રેકોર્ડ દ્વારા પ્રમાણિત (Verified)',
      DISPUTED: 'સત્તાવાર રેકોર્ડ મુજબ વિવાદિત (Disputed)',
      NOT_PROVABLE: 'જાહેર ડેટાથી સાબિત નથી (Not Provable)',
    },
    confidence: {
      HIGH: 'ઉચ્ચ વિશ્વસનીયતા (High)',
      MEDIUM: 'મધ્યમ વિશ્વસનીયતા (Medium)',
      LOW: 'ઓછી વિશ્વસનીયતા (Low)',
    },
    examples: ['ભાગ 4 માં 49 મહિલા મતદારો કમી થયા છે?', 'પ્લોટ 12-B માં કેટલા મતદારો છે?'],
    audioLabel: 'સત્તાવાર જ્ઞાની AI ઓડિયો જવાબ:',
    shareWhatsApp: 'WhatsApp પર શેર કરો',
    copyLink: 'લિંક કોપી કરો',
    copied: 'કોપી થયું ✓',
  },
  'kn-IN': {
    portalTitle: 'ಭಾರತೀಯ ಚುನಾವಣಾ ಆಯೋಗ',
    portalSub: 'ಮತದಾರ ಮಿತ್ರ — ರಾಷ್ಟ್ರೀಯ ಮತದಾರರ ಪಟ್ಟಿ ಪರಿಶೀಲನಾ ಪೋರ್ಟಲ್',
    checkTitle: 'ಮತದಾರರ ಪಟ್ಟಿ ದೂರುಗಳು ಮತ್ತು ಪ್ರಶ್ನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    checkSub: 'ಮತದಾರರ ಹೆಸರು ತೆಗೆದುಹಾಕುವಿಕೆ ಮತ್ತು ವಿಳಾಸದ ಸಮಸ್ಯೆಗಳ ಅಧಿಕೃತ ಮಾಹಿತಿ.',
    inputPlaceholder: 'ಉದಾ: ಭಾಗ 4 ರಲ್ಲಿ 49 ಮಹಿಳಾ ಮತದಾರರನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆಯೇ?',
    btnCheck: 'ಪರಿಶೀಲಿಸಿ',
    btnChecking: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…',
    btnVoice: 'ಧ್ವನಿ ಮೂಲಕ ಕೇಳಿ',
    btnListening: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ… ಮಾತನಾಡಿ',
    btnStop: 'ನಿಲ್ಲಿಸಿ',
    verdicts: {
      VERIFIED: 'ಅಧಿಕೃತ ದಾಖಲೆಯಂತೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ (Verified)',
      DISPUTED: 'ಅಧಿಕೃತ ದಾಖಲೆಗೆ ವಿರುದ್ಧವಾಗಿದೆ (Disputed)',
      NOT_PROVABLE: 'ಸಾರ್ವಜನಿಕ ದಾಖಲೆಯಿಂದ ಸಾಬೀತಾಗಿಲ್ಲ (Not Provable)',
    },
    confidence: {
      HIGH: 'ಹೆಚ್ಚಿನ ವಿಶ್ವಾಸಾರ್ಹತೆ (High)',
      MEDIUM: 'ಮಧ್ಯಮ ವಿಶ್ವಾಸಾರ್ಹತೆ (Medium)',
      LOW: 'ಕಡಿಮೆ ವಿಶ್ವಾಸಾರ್ಹತೆ (Low)',
    },
    examples: ['ಭಾಗ 4 ರಲ್ಲಿ 49 ಮಹಿಳಾ ಮತದಾರರನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆಯೇ?', 'ಪ್ಲಾಟ್ 12-B ಯಲ್ಲಿ ಎಷ್ಟು ಮತದಾರರಿದ್ದಾರೆ?'],
    audioLabel: 'ಅಧಿಕೃತ ಜ್ಞಾನಿ AI ಧ್ವನಿ ಪ್ರತಿಕ್ರಿಯೆ:',
    shareWhatsApp: 'WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ',
    copyLink: 'ಲಿಂಕ್ ನಕಲಿಸಿ',
    copied: 'ನಕಲಿಸಲಾಗಿದೆ ✓',
  },
  'ml-IN': {
    portalTitle: 'ഇന്ത്യൻ തിരഞ്ഞെടുപ്പ് കമ്മീഷൻ',
    portalSub: 'വോട്ടർ മിത്ര — വോട്ടർ പട്ടിക പരിശോധനാ പോർട്ടൽ',
    checkTitle: 'വോട്ടർ പട്ടികയിലെ അവകാശവാദങ്ങൾ പരിശോധിക്കുക',
    checkSub: 'വോട്ടർമാരെ ഒഴിവാക്കൽ സംബന്ധിച്ച ചോദ്യങ്ങൾക്ക് ഔദ്യോഗിക വിവരങ്ങൾ.',
    inputPlaceholder: 'ഉദാ: പാർട്ട് 4 ൽ 49 സ്ത്രീ വോട്ടർമാരെ ഒഴിവാക്കിയോ?',
    btnCheck: 'പരിശോധിക്കുക',
    btnChecking: 'പരിശോധിക്കുന്നു…',
    btnVoice: 'ശബ്ദത്തിൽ ചോദിക്കുക',
    btnListening: 'കേൾക്കുന്നു… സംസാരിക്കൂ',
    btnStop: 'നിർത്തുക',
    verdicts: {
      VERIFIED: 'ഔദ്യോഗിക രേഖകൾ പ്രകാരം സ്ഥിരീകരിച്ചു (Verified)',
      DISPUTED: 'ഔദ്യോഗിക രേഖകൾക്ക് വിരുദ്ധമാണ് (Disputed)',
      NOT_PROVABLE: 'പരസ്യ രേഖകളാൽ തെളിയിക്കാനാവില്ല (Not Provable)',
    },
    confidence: {
      HIGH: 'ഉയർന്ന വിശ്വാസ്യത (High)',
      MEDIUM: 'ഇടത്തരം വിശ്വാസ്യത (Medium)',
      LOW: 'കുറഞ്ഞ വിശ്വാസ്യത (Low)',
    },
    examples: ['പാർട്ട് 4 ൽ 49 സ്ത്രീ വോട്ടർമാരെ ഒഴിവാക്കിയോ?', 'പ്ലോട്ട് 12-B യിൽ എത്ര വോട്ടർമാരുണ്ട്?'],
    audioLabel: 'ഔദ്യോഗിക ജ്ഞാനി AI ശബ്ദ മറുപടി:',
    shareWhatsApp: 'വാട്സാപ്പിൽ പങ്കിടുക',
    copyLink: 'ലിങ്ക് പകർത്തുക',
    copied: 'പകർത്തി ✓',
  },
  'pa-IN': {
    portalTitle: 'ਭਾਰਤ ਚੋਣ ਕਮਿਸ਼ਨ',
    portalSub: 'ਵੋਟਰ ਮਿੱਤਰ — ਰਾਸ਼ਟਰੀ ਵੋਟਰ ਸੂਚੀ ਪੜਤਾਲ ਅਤੇ ਤਸਦੀਕ ਪੋਰਟਲ',
    checkTitle: 'ਵੋਟਰ ਸੂਚੀ ਸਬੰਧੀ ਦਾਅਵਿਆਂ ਦੀ ਪੜਤਾਲ ਕਰੋ',
    checkSub: 'ਵੋਟਰ ਕਟੌਤੀ, ਪਤਾ ਇਕੱਠ ਅਤੇ ਜਾਅਲੀ ਵੋਟਰ ਆਈਡੀ ਦੀ ਅਧਿਕਾਰਤ ਜਾਂਚ।',
    inputPlaceholder: 'ਜਿਵੇਂ: ਕੀ ਭਾਗ 4 ਵਿੱਚ 49 ਮਹਿਲਾ ਵੋਟਰਾਂ ਦੇ ਨਾਮ ਕੱਟੇ ਗਏ?',
    btnCheck: 'ਪੜਤਾਲ ਕਰੋ',
    btnChecking: 'ਜਾਂਚ ਜਾਰੀ ਹੈ…',
    btnVoice: 'ਬੋਲ ਕੇ ਪੁੱਛੋ',
    btnListening: 'ਸੁਣ ਰਹੇ ਹਾਂ… ਬੋਲੋ',
    btnStop: 'ਰੋਕੋ',
    verdicts: {
      VERIFIED: 'ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਅਨੁਸਾਰ ਪ੍ਰਮਾਣਿਤ (Verified)',
      DISPUTED: 'ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਅਨੁਸਾਰ ਵਿਵਾਦਤ (Disputed)',
      NOT_PROVABLE: 'ਸਰਵਜਨਕ ਰਿਕਾਰਡ ਤੋਂ ਅਪ੍ਰਮਾਣਿਤ (Not Provable)',
    },
    confidence: {
      HIGH: 'ਉੱਚ ਭਰੋਸੇਯੋਗਤਾ (High)',
      MEDIUM: 'ਦਰਮਿਆਨੀ ਭਰੋਸੇਯੋਗਤਾ (Medium)',
      LOW: 'ਘੱਟ ਭਰੋਸੇਯੋਗਤਾ (Low)',
    },
    examples: ['ਕੀ ਭਾਗ 4 ਵਿੱਚ 49 ਮਹਿਲਾ ਵੋਟਰਾਂ ਦੇ ਨਾਮ ਕੱਟੇ ਗਏ?', 'ਪਲਾਟ 12-B ਵਿੱਚ ਕਿੰਨੇ ਵੋਟਰ ਦਰਜ ਹਨ?'],
    audioLabel: 'ਸਰਕਾਰੀ ਗਿਆਨੀ AI ਆਵਾਜ਼ ਜਵਾਬ:',
    shareWhatsApp: 'ਵਟਸਐਪ ਤੇ ਸਾਂਝਾ ਕਰੋ',
    copyLink: 'ਲਿੰਕ ਕਾਪੀ ਕਰੋ',
    copied: 'ਕਾਪੀ ਹੋ ਗਿਆ ✓',
  },
};
