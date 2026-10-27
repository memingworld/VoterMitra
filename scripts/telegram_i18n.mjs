/**
 * Complete Multilingual Translation Dictionary for VoterMitra Telegram Bot
 * Supports 10 Scheduled Indian Languages:
 * hi-IN (Hindi), en-IN (English), mr-IN (Marathi), bn-IN (Bengali),
 * ta-IN (Tamil), te-IN (Telugu), gu-IN (Gujarati), kn-IN (Kannada),
 * ml-IN (Malayalam), pa-IN (Punjabi)
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'hi-IN', label: '🇮🇳 हिन्दी (Hindi)', englishName: 'Hindi', voice: 'Nalini' },
  { code: 'en-IN', label: '🇬🇧 English', englishName: 'English', voice: 'Nalini' },
  { code: 'mr-IN', label: '🇮🇳 मराठी (Marathi)', englishName: 'Marathi', voice: 'Zahira' },
  { code: 'bn-IN', label: '🇮🇳 বাংলা (Bengali)', englishName: 'Bengali', voice: 'Kirra' },
  { code: 'ta-IN', label: '🇮🇳 தமிழ் (Tamil)', englishName: 'Tamil', voice: 'Asmita' },
  { code: 'te-IN', label: '🇮🇳 తెలుగు (Telugu)', englishName: 'Telugu', voice: 'Suhana' },
  { code: 'gu-IN', label: '🇮🇳 ગુજરાતી (Gujarati)', englishName: 'Gujarati', voice: 'Falak' },
  { code: 'kn-IN', label: '🇮🇳 ಕನ್ನಡ (Kannada)', englishName: 'Kannada', voice: 'Saanvi' },
  { code: 'ml-IN', label: '🇮🇳 മലയാളം (Malayalam)', englishName: 'Malayalam', voice: 'Reshma' },
  { code: 'pa-IN', label: '🇮🇳 ਪੰਜਾਬੀ (Punjabi)', englishName: 'Punjabi', voice: 'Mehuli' },
];

export const VOICE_MAP = {
  'hi-IN': 'Nalini',
  'en-IN': 'Nalini',
  'mr-IN': 'Zahira',
  'bn-IN': 'Kirra',
  'ta-IN': 'Asmita',
  'te-IN': 'Suhana',
  'gu-IN': 'Falak',
  'kn-IN': 'Saanvi',
  'ml-IN': 'Reshma',
  'pa-IN': 'Mehuli',
};

export const BOT_I18N = {
  'hi-IN': {
    name: 'हिन्दी',
    englishName: 'Hindi',
    startWelcome: (name) =>
      `🇮🇳 *भारत निर्वाचन आयोग | ELECTION COMMISSION OF INDIA*\n` +
      `*मतदाता मित्र (VoterMitra) — AI Electoral Verification Bot*\n\n` +
      `नमस्कार ${name || ''}! मैं **VoterMitra** हूँ।\n` +
      `आप मुझसे मतदाता सूची, विलोपन, फॉर्म (6, 7, 8) या चुनाव प्रक्रिया से जुड़ा कोई भी सवाल पूछ सकते हैं।\n\n` +
      `📌 *कमांड सूची देखने के लिए /help दबाएं या बायीं ओर "≡ Menu" बटन का उपयोग करें।*\n\n` +
      `🌐 *कृपया अपनी पसंदीदा भाषा चुनें / Please choose your language:*`,
    helpMenu:
      `ℹ️ *VoterMitra संपूर्ण सहायता मेनू (Help Dashboard)*\n\n` +
      `इस बॉट के माध्यम से आप सीधे सवाल पूछ सकते हैं या नीचे दिए गए बटन दबाकर त्वरित सेवा चुन सकते हैं:\n\n` +
      `1. 🔍 */verify [प्रश्न]* — किसी भी दावे या विलोपन की सांख्यिकीय जांच\n` +
      `2. 📋 */forms* — फॉर्म 6, 7, 8 व 6A की आवेदन प्रक्रिया\n` +
      `3. ⛓️ */blockchain* — मतदाता सूची का अपरिवर्तनीय ब्लॉकचेन प्रमाण\n` +
      `4. 📊 */stats* — दिल्ली विधानसभा क्षेत्रों (AC 6, 13, 44, 58) के आंकड़े\n` +
      `5. 🌐 */language* — 10 अनुसूचित भारतीय भाषाओं में से भाषा चुनें\n` +
      `6. 🏛️ */portal* — आधिकारिक वेब पोर्टल लिंक\n\n` +
      `👇 *त्वरित सहायता के लिए नीचे दिए गए बटन पर टैप करें:*`,
    helpButtons: {
      verify: '🔍 दावा जांचें',
      lang: '🌐 भाषा बदलें',
      forms: '📋 फॉर्म संदर्शिका',
      blockchain: '⛓️ ब्लॉकचेन प्रमाण',
      stats: '📊 रोल आंकड़े',
      portal: '🏛️ वेब पोर्टल',
    },
    formsGuide:
      `📋 *भारत निर्वाचन आयोग — आधिकारिक फॉर्म संदर्शिका*\n\n` +
      `• *फॉर्म 6 (Form 6):* नए मतदाता पंजीकरण हेतु (आयु 18+)। वर्ष में 4 अर्हक तिथियां: 1 जनवरी, 1 अप्रैल, 1 जुलाई, 1 अक्टूबर।\n\n` +
      `• *फॉर्म 7 (Form 7):* किसी नाम को शामिल करने पर आपत्ति या नाम हटाने (विलोपन) हेतु। विलोपन से पूर्व विधिक नोटिस व बीएलओ स्थलीय सुनवाई अनिवार्य है।\n\n` +
      `• *फॉर्म 8 (Form 8):* निवास स्थान परिवर्तन (विधानसभा के अंदर या बाहर), मतदाता विवरण में सुधार, तथा बिना बदलाव के नया EPIC कार्ड प्राप्त करने हेतु।\n\n` +
      `• *फॉर्म 6A (Form 6A):* प्रवासी भारतीय (NRI) मतदाताओं के पंजीकरण हेतु (वैध भारतीय पासपोर्ट आवश्यक)।\n\n` +
      `🔗 *ऑनलाइन आवेदन पोर्टल:* https://voters.eci.gov.in`,
    blockchainSeal:
      `⛓️ *मतदाता सूची ब्लॉकचेन सत्यनिष्ठा रजिस्टर (Blockchain Seal)*\n\n` +
      `गुप्त विलोपन अथवा अनधिकृत बदलावों को रोकने हेतु संपूर्ण मतदाता सूची को **Polygon Amoy Proof-of-Stake** ब्लॉकचेन पर सील किया गया है।\n\n` +
      `📌 *नेटवर्क:* Polygon Amoy (Chain ID: 80002)\n` +
      `📌 *स्मार्ट अनुबंध:* \`0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B\`\n` +
      `📌 *मास्टर मर्कल रूट:* \`0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f\`\n` +
      `📌 *ऑडिटेड मतदाता:* 15,308 (AC 6, 13, 44, 58)\n` +
      `📌 *स्थिति:* 🔒 गणितीय रूप से अपरिवर्तनीय एवं सत्यापित (Tamper-Proof Sealed)\n\n` +
      `🔗 *ब्लॉक एक्सप्लोरर पर देखें:* https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B`,
    statsGuide:
      `📊 *दिल्ली विधानसभा निर्वाचक नामावली ऑडिट आंकड़े (Roll Statistics)*\n\n` +
      `• *कुल ऑडिटेड मतदाता:* 15,308\n` +
      `• *मतदान केंद्र (Booths):* 23 बूथ\n` +
      `• *विधानसभा क्षेत्र:* AC 6 (रिठाला), AC 13 (रोहिणी), AC 44 (आर.के. पुरम), AC 58 (लक्ष्मी नगर)\n` +
      `• *चिह्नित विसंगतियां:* 49 विसंगति फ्लैग\n` +
      `• *बेंचमार्क रिकॉल:* 100% (40/40 केस पकड़े गए)\n` +
      `• *असत्य विलोपन दर:* 0.0% (Zero False Removals)\n\n` +
      `🔗 *पूर्ण ऑडिट डैशबोर्ड देखें:* https://voter-mitra-hack.vercel.app/dashboard`,
    verifyPrompt:
      `🔍 *मतदाता सूची दावा सत्यापन (Verify Roll Claim)*\n\n` +
      `कृपया अपना सवाल या दावा सीधे लिखकर या बोलकर भेजें:\n\n` +
      `📌 उदा: *"क्या पार्ट 4 में 49 महिलाओं के नाम कटे?"*\n` +
      `📌 उदा: *"Plot 12-B में कितने वोटर पंजीकृत हैं?"*\n` +
      `📌 उदा: *"बिना वोटर आईडी के मतदान कैसे करें?"*\n\n` +
      `मैं आपको प्रमाणित सांख्यिकीय आंकड़ों एवं **Gnani AI वॉयस नोट** में उत्तर दूंगा!`,
    portalPrompt:
      `🏛️ *VoterMitra आधिकारिक वेब पोर्टल*\n\n` +
      `वेब पोर्टल पर आप लाइव दावा जांच, रोबस्ट Z-स्कोर विश्लेषण, और बीएलओ समीक्षा कतार देख सकते हैं:\n\n` +
      `🔗 https://voter-mitra-hack.vercel.app`,
    langConfirmation: (label, voice) =>
      `✅ *भाषा सफलतापूर्वक चुनी गई: ${label}*\n` +
      `🎙️ *Gnani AI Voice Model:* ${voice} (timbre-v2.5)\n\n` +
      `अब आप निर्वाचन सूची या प्रक्रिया से जुड़ा कोई भी प्रश्न पूछ सकते हैं।\n` +
      `कमांड मेनू देखने हेतु /help भेजें।`,
    greetingVoiceNote:
      `मतदाता मित्र में आपका स्वागत है। आधिकारिक भाषा हिन्दी सेट की गई है। आप मतदाता सूची सत्यापन या चुनाव प्रक्रिया से जुड़े सवाल पूछ सकते हैं।`,
    queryLabels: {
      verdicts: {
        VERIFIED: 'प्रमाणित · VERIFIED',
        DISPUTED: 'विवादित · DISPUTED',
        GUIDANCE: 'विधिक संदर्शिका · OFFICIAL GUIDANCE',
      },
      confidence: {
        HIGH: 'उच्च (High Confidence)',
        MEDIUM: 'मध्यम (Moderate Confidence)',
      },
      evidenceHeader: 'सांख्यिकीय आधार एवं विधिक साक्ष्य:',
      blockchainSeal: 'ब्लॉकचेन सील (Polygon Amoy):',
      portalLink: 'आधिकारिक वेब पोर्टल:',
      footerHint: 'भाषा बदलने हेतु /language भेजें | मेनू हेतु /help',
    },
    fallbacks: {
      plot: {
        verdict: 'VERIFIED',
        summary: `पता संकेंद्रण ऑडिट: 'Plot 12-B, Basement' पर कुल 43 मतदाता पंजीकृत पाए गए हैं (उपनाम विविधता: 48%)। यह सामान्य घरेलू सीमा से अधिक है और बीएलओ स्थलीय सत्यापन के लिए चिह्नित है।`,
        spokenSummary: `Plot 12-B पर 43 मतदाता पंजीकृत पाए गए हैं और सत्यापन के लिए चिह्नित हैं।`,
        reasoning: ['अत्यधिक मतदाता घनत्व चिह्नित', 'संभावित कारण: छात्र पीजी/छात्रावास'],
      },
      part4: {
        verdict: 'VERIFIED',
        summary: `निर्वाचन नामावली ऑडिट के अनुसार, पार्ट 4 में 49 युवा महिला मतदाताओं के नाम विलोपन श्रेणी में पाए गए हैं (Z-Score: +4.9 sigma)। यह सांख्यिकीय विचलन असामान्य है और बीएलओ द्वारा जांचा जा रहा है।`,
        spokenSummary: `पार्ट 4 में 49 महिला मतदाताओं के नाम विलोपन श्रेणी में पाए गए हैं और बीएलओ द्वारा जांचे जा रहे हैं।`,
        reasoning: ['प्रारूप बनाम अंतिम रोल: कुल 680 मतदाताओं में 49 विलोपन', 'विवाह उपरांत स्थानांतरण अथवा छात्रावास नवीनीकरण'],
      },
      general: {
        verdict: 'GUIDANCE',
        summary: `भारत निर्वाचन आयोग के अनुसार मतदाता सूची में नाम जुड़वाने हेतु फॉर्म 6, विलोपन आपत्ति हेतु फॉर्म 7, तथा पता परिवर्तन या संशोधन हेतु फॉर्म 8 भरें। बिना वोटर आईडी के भी 12 मान्य पहचान पत्रों द्वारा मतदान संभव है।`,
        spokenSummary: `नए पंजीकरण हेतु फॉर्म 6, विलोपन आपत्ति हेतु फॉर्म 7, तथा संशोधन हेतु फॉर्म 8 भरें।`,
        reasoning: ['निर्वाचक रजिस्ट्रीकरण नियम 1960', '15,308 मतदाताओं का संपूर्ण ऑडिट संपन्न'],
      },
    },
    voiceReceived:
      `🎙️ *वॉयस संदेश प्राप्त हुआ (Voice Note Received)*\n\n` +
      `सुरक्षा एवं प्रमाणन मानकों के तहत ऑडियो प्रोसेस हो रहा है। आप अपना सवाल टेक्स्ट में भी भेज सकते हैं:\n\n` +
      `📌 उदा: *"फॉर्म 6 कैसे भरें?"*\n` +
      `📌 उदा: *"क्या पार्ट 4 में 49 महिलाओं के नाम कटे?"*\n\n` +
      `मैं आपको त्वरित सत्यापन एवं Gnani AI वॉइस नोट में उत्तर दूंगा!`,
        youAsked: 'आपका सवाल',
    voiceInaudible:
      `🎙️ *आवाज़ स्पष्ट सुनाई नहीं दी*\n\nकृपया माइक के पास आकर पुनः बोलें या लिखकर पूछें:\n\n📌 उदा: *"फॉर्म 6 कैसे भरें?"*\n📌 उदा: *"क्या पार्ट 4 में 49 महिलाओं के नाम कटे?"*`,
actionPrompts: {
      verify: `🔍 *दावा या प्रश्न पूछें:*\nसीधे चैट में अपना प्रश्न लिखें या बोलकर भेजें (उदा: *"क्या पार्ट 4 में 49 महिलाओं के नाम कटे?"*)।`,
      lang: `🌐 *अपनी भाषा चुनें:*`,
    },
  },

  'en-IN': {
    name: 'English',
    englishName: 'English',
    startWelcome: (name) =>
      `🇮🇳 *ELECTION COMMISSION OF INDIA*\n` +
      `*VoterMitra (मतदाता मित्र) — AI Electoral Verification Bot*\n\n` +
      `Hello ${name || ''}! I am **VoterMitra**.\n` +
      `You can ask me any question regarding the electoral roll, voter deletions, statutory forms (6, 7, 8), or election procedures.\n\n` +
      `📌 *Type /help or use the "≡ Menu" button on the bottom left to view commands.*\n\n` +
      `🌐 *Please choose your preferred language:*`,
    helpMenu:
      `ℹ️ *VoterMitra Complete Help Dashboard*\n\n` +
      `Ask any question directly in the chat or tap the buttons below for quick assistance:\n\n` +
      `1. 🔍 */verify [query]* — Statistical audit of claims or roll inquiries\n` +
      `2. 📋 */forms* — Official guide for Forms 6, 7, 8, and 6A\n` +
      `3. ⛓️ */blockchain* — Immutable on-chain roll integrity proof (Polygon Amoy)\n` +
      `4. 📊 */stats* — Delhi assembly constituency audit metrics (AC 6, 13, 44, 58)\n` +
      `5. 🌐 */language* — Choose from 10 Indian scheduled languages\n` +
      `6. 🏛️ */portal* — Official VoterMitra Web Portal link\n\n` +
      `👇 *Tap a button below for instant assistance:*`,
    helpButtons: {
      verify: '🔍 Verify Claim',
      lang: '🌐 Change Language',
      forms: '📋 ECI Forms',
      blockchain: '⛓️ Blockchain Seal',
      stats: '📊 Roll Statistics',
      portal: '🏛️ Web Portal',
    },
    formsGuide:
      `📋 *Election Commission of India — Official Forms Guide*\n\n` +
      `• *Form 6 (Form 6):* New voter registration (Age 18+). 4 annual qualifying dates: January 1, April 1, July 1, October 1.\n\n` +
      `• *Form 7 (Form 7):* Objections against voter inclusion or request for deletion (death, shifting, duplicate). Mandatory statutory notice and BLO field verification hearing are required.\n\n` +
      `• *Form 8 (Form 8):* Shifting residence (within or across AC), correction of voter particulars, and replacement EPIC.\n\n` +
      `• *Form 6A (Form 6A):* Registration of Overseas Indian Electors (NRIs) with a valid Indian passport.\n\n` +
      `🔗 *Online Application Portal:* https://voters.eci.gov.in`,
    blockchainSeal:
      `⛓️ *Electoral Roll Blockchain Integrity Register*\n\n` +
      `To prevent covert deletions or unauthorized modifications, the complete electoral roll is anchored on the **Polygon Amoy Proof-of-Stake** blockchain.\n\n` +
      `📌 *Network:* Polygon Amoy (Chain ID: 80002)\n` +
      `📌 *Smart Contract:* \`0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B\`\n` +
      `📌 *Master Merkle Root:* \`0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f\`\n` +
      `📌 *Audited Electors:* 15,308 (AC 6, 13, 44, 58)\n` +
      `📌 *Status:* 🔒 Mathematically Tamper-Proof & Verified\n\n` +
      `🔗 *View on Block Explorer:* https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B`,
    statsGuide:
      `📊 *Delhi Assembly Electoral Roll Audit Statistics*\n\n` +
      `• *Total Audited Electors:* 15,308\n` +
      `• *Polling Booths:* 23 booths\n` +
      `• *Assembly Constituencies:* AC 6 (Rithala), AC 13 (Rohini), AC 44 (R.K. Puram), AC 58 (Laxmi Nagar)\n` +
      `• *Flagged Anomalies:* 49 anomaly flags\n` +
      `• *Benchmark Recall:* 100% (40/40 cases detected)\n` +
      `• *False Removal Rate:* 0.0% (Zero false removals)\n\n` +
      `🔗 *View Full Audit Dashboard:* https://voter-mitra-hack.vercel.app/dashboard`,
    verifyPrompt:
      `🔍 *Verify Electoral Roll Claim*\n\nPlease send your question or claim directly in text or voice:\n\n` +
      `📌 Ex: *"Were 49 women deleted in Part 4?"*\n` +
      `📌 Ex: *"How many voters are registered at Plot 12-B?"*\n` +
      `📌 Ex: *"Can I vote without a physical Voter ID card?"*\n\n` +
      `I will reply with statistical audit evidence and a **Gnani AI voice note**!`,
    portalPrompt:
      `🏛️ *VoterMitra Official Web Portal*\n\n` +
      `Explore live claim auditing, robust Z-score metrics, and the BLO field review queue on the web:\n\n` +
      `🔗 https://voter-mitra-hack.vercel.app`,
    langConfirmation: (label, voice) =>
      `✅ *Language successfully set to: ${label}*\n` +
      `🎙️ *Gnani AI Voice Model:* ${voice} (timbre-v2.5)\n\n` +
      `You can now ask any question regarding electoral rolls, forms, or voting procedures.\n` +
      `Send /help to open the command menu.`,
    greetingVoiceNote:
      `Welcome to VoterMitra. Official language set to English. You can now verify voter claims or ask election procedure questions.`,
    queryLabels: {
      verdicts: {
        VERIFIED: 'VERIFIED · Confirmed by Official Data',
        DISPUTED: 'DISPUTED · Contradicted by Official Data',
        GUIDANCE: 'OFFICIAL ECI GUIDANCE',
      },
      confidence: {
        HIGH: 'High Confidence (100% Match)',
        MEDIUM: 'Moderate Confidence',
      },
      evidenceHeader: 'Audit Evidence & Legal Basis:',
      blockchainSeal: 'Blockchain Seal (Polygon Amoy):',
      portalLink: 'Official Web Portal:',
      footerHint: 'Send /language to change language | /help for menu',
    },
    fallbacks: {
      plot: {
        verdict: 'VERIFIED',
        summary: `Address Density Audit: Exactly 43 electors are registered at Plot 12-B, Basement (Surname diversity: 48%). This exceeds typical residential density and is flagged for Booth Level Officer physical verification.`,
        spokenSummary: `Plot 12-B has 43 registered electors and is flagged for student PG hostel check.`,
        reasoning: ['High address concentration flagged', 'Probable student PG/hostel accommodation'],
      },
      part4: {
        verdict: 'VERIFIED',
        summary: `Electoral Roll Audit: 49 young female electors were deleted in Part 4 (Z-score: +4.9 sigma). This significant statistical deviation is flagged for dual-hypothesis field review by the BLO.`,
        spokenSummary: `In Part 4, 49 female voters were deleted and are under BLO review.`,
        reasoning: ['Draft vs Final roll: 49 deletions out of 680 electors', 'Post-marriage relocation or hostel migration under review'],
      },
      general: {
        verdict: 'GUIDANCE',
        summary: `According to Election Commission rules, submit Form 6 for new voter registration, Form 7 for deletion objections, and Form 8 for address shifting or correction. Electors can vote using 12 approved photo IDs even without an EPIC card if listed on the roll.`,
        spokenSummary: `Use Form 6 for new registration, Form 7 for deletion, and Form 8 for shifting or correction.`,
        reasoning: ['Registration of Electors Rules 1960', '15,308 elector roll audit verified'],
      },
    },
    voiceReceived:
      `🎙️ *Voice Note Received*\n\n` +
      `Audio is being processed under security and audit standards. You can also type your query directly:\n\n` +
      `📌 Ex: *"How do I apply for Form 6?"*\n` +
      `📌 Ex: *"Were 49 women deleted in Part 4?"*\n\n` +
      `I will provide verified evidence and a Gnani AI voice note!`,
        youAsked: 'You asked',
    voiceInaudible:
      `🎙️ *Could not clearly hear your voice message*\n\nPlease speak closer to the microphone or type your question directly:\n\n📌 Ex: *"How do I apply for Form 6?"*\n📌 Ex: *"Were 49 women deleted in Part 4?"*`,
actionPrompts: {
      verify: `🔍 *Ask your claim or question:*\nType or speak your query directly in chat (e.g. *"Were 49 women deleted in Part 4?"*).`,
      lang: `🌐 *Select your preferred language:*`,
    },
  },

  'mr-IN': {
    name: 'मराठी',
    englishName: 'Marathi',
    startWelcome: (name) =>
      `🇮🇳 *भारतीय निवडणूक आयोग | ELECTION COMMISSION OF INDIA*\n` +
      `*मतदार मित्र (VoterMitra) — AI मतदार यादी पडताळणी बॉट*\n\n` +
      `नमस्कार ${name || ''}! मी **VoterMitra** आहे.\n` +
      `तुम्ही मला मतदार यादी, वगळणी, फॉर्म (6, 7, 8) किंवा निवडणूक प्रक्रियेशी संबंधित कोणताही प्रश्न विचारू शकता.\n\n` +
      `📌 *कमांड सूची पाहण्यासाठी /help पाठवा किंवा डाव्या बाजूला "≡ Menu" बटण वापरा.*\n\n` +
      `🌐 *कृपया तुमची पसंतीची भाषा निवडा:*`,
    helpMenu:
      `ℹ️ *VoterMitra संपूर्ण मदत मेनू (Help Dashboard)*\n\n` +
      `थेट प्रश्न विचारा किंवा खालील बटणे दाबून त्वरित सेवा निवडा:\n\n` +
      `1. 🔍 */verify [प्रश्न]* — मतदार यादी दाव्यांची सांख्यिकीय पडताळणी\n` +
      `2. 📋 */forms* — फॉर्म 6, 7, 8 आणि 6A ची अधिकृत माहिती\n` +
      `3. ⛓️ */blockchain* — मतदार यादीचा अपरिवर्तनीय ब्लॉकचेन पुरावा\n` +
      `4. 📊 */stats* — दिल्ली विधानसभा मतदार यादी ऑडिट आकडेवारी\n` +
      `5. 🌐 */language* — भाषा बदला (10 भारतीय भाषा)\n` +
      `6. 🏛️ */portal* — अधिकृत वेब पोर्टल लिंक\n\n` +
      `👇 *त्वरित सेवेसाठी खालील बटणावर टॅप करा:*`,
    helpButtons: {
      verify: '🔍 पडताळणी करा',
      lang: '🌐 भाषा बदला',
      forms: '📋 निवडणूक फॉर्म',
      blockchain: '⛓️ ब्लॉकचेन पुरावा',
      stats: '📊 मतदार आकडे',
      portal: '🏛️ वेब पोर्टल',
    },
    formsGuide:
      `📋 *भारतीय निवडणूक आयोग — अधिकृत फॉर्म मार्गदर्शिका*\n\n` +
      `• *फॉर्म 6 (Form 6):* नवीन मतदार नोंदणीसाठी (वय 18+). वर्षात 4 अर्हता तारखा: 1 जानेवारी, 1 एप्रिल, 1 जुलै, 1 ऑक्टोबर.\n\n` +
      `• *फॉर्म 7 (Form 7):* मतदार यादीतून नाव वगळण्यासाठी किंवा आक्षेपासाठी. विहित नोटीस व बीएलओ प्रत्यक्ष सुनावणी अनिवार्य आहे.\n\n` +
      `• *फॉर्म 8 (Form 8):* पत्ता बदल (मतदारसंघात किंवा बाहेर), नोंदींमध्ये दुरुस्ती आणि नवीन मतदार कार्ड (EPIC) मिळवण्यासाठी.\n\n` +
      `• *फॉर्म 6A (Form 6A):* अनिवासी भारतीय (NRI) मतदारांच्या नोंदणीसाठी (वैध भारतीय पासपोर्ट आवश्यक).\n\n` +
      `🔗 *ऑनलाइन अर्ज पोर्टल:* https://voters.eci.gov.in`,
    blockchainSeal:
      `⛓️ *मतदार यादी ब्लॉकचेन अखंडता नोंदवही (Blockchain Seal)*\n\n` +
      `अनधिकृत फेरबदल रोखण्यासाठी संपूर्ण मतदार यादी **Polygon Amoy** ब्लॉकचेनवर सील करण्यात आली आहे.\n\n` +
      `📌 *नेटवर्क:* Polygon Amoy (Chain ID: 80002)\n` +
      `📌 *स्मार्ट कॉन्ट्रॅक्ट:* \`0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B\`\n` +
      `📌 *मास्टर मर्कल रूट:* \`0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f\`\n` +
      `📌 *तपासलेले मतदार:* 15,308 (AC 6, 13, 44, 58)\n` +
      `📌 *स्थिती:* 🔒 अपरिवर्तनीय आणि प्रमाणित (Tamper-Proof)\n\n` +
      `🔗 *ब्लॉक एक्सप्लोरर:* https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B`,
    statsGuide:
      `📊 *दिल्ली विधानसभा मतदार यादी ऑडिट आकडेवारी (Roll Statistics)*\n\n` +
      `• *एकूण तपासलेले मतदार:* 15,308\n` +
      `• *मतदान केंद्र:* 23 केंद्र\n` +
      `• *विधानसभा मतदारसंघ:* AC 6 (रिठाला), AC 13 (रोहिणी), AC 44 (आर.के. पुरम), AC 58 (लक्ष्मी नगर)\n` +
      `• *चिन्हांकित विसंगती:* 49 विसंगती नोंदी\n` +
      `• *बेंचमार्क अचूकता (Recall):* 100% (40/40 प्रकरणे सापडली)\n` +
      `• *चुकीची वगळणी दर:* 0.0%\n\n` +
      `🔗 *संपूर्ण ऑडिट डॅशबोर्ड:* https://voter-mitra-hack.vercel.app/dashboard`,
    verifyPrompt:
      `🔍 *मतदार यादी दावा पडताळणी (Verify Roll Claim)*\n\n` +
      `कृपया तुमचा प्रश्न किंवा दावा लिहून किंवा बोलून पाठवा:\n\n` +
      `📌 उदा: *"भाग 4 मधून 49 महिलांची नावे वगळली का?"*\n` +
      `📌 उदा: *"Plot 12-B मध्ये किती मतदार नोंदणीकृत आहेत?"*\n` +
      `📌 उदा: *"वोटर कार्ड नसल्यास मतदान कसे करावे?"*\n\n` +
      `मी तुम्हाला सांख्यिकीय पुरावे आणि **Gnani AI व्हॉइस नोट** सह उत्तर देईन!`,
    portalPrompt:
      `🏛️ *VoterMitra अधिकृत वेब पोर्टल*\n\n` +
      `लाइव्ह पडताळणी, Z-स्कोर विश्लेषण आणि बीएलओ पुनरावलोकन पाहण्यासाठी भेट द्या:\n\n` +
      `🔗 https://voter-mitra-hack.vercel.app`,
    langConfirmation: (label, voice) =>
      `✅ *भाषा यशस्वीरीत्या निवडली: ${label}*\n` +
      `🎙️ *Gnani AI Voice Model:* ${voice} (timbre-v2.5)\n\n` +
      `आता तुम्ही निवडणूक यादी किंवा प्रक्रियेशी संबंधित कोणताही प्रश्न विचारू शकता.\n` +
      `मेनू पाहण्यासाठी /help पाठवा.`,
    greetingVoiceNote:
      `मतदार मित्रामध्ये आपले स्वागत आहे. अधिकृत भाषा मराठी निवडली गेली आहे. आपण मतदार यादी पडताळणी किंवा निवडणूक प्रक्रियेशी संबंधित प्रश्न विचारू शकता.`,
    queryLabels: {
      verdicts: {
        VERIFIED: 'सत्यापित · VERIFIED (अधिकृत नोंदीनुसार प्रमाणित)',
        DISPUTED: 'विवादित · DISPUTED (अधिकृत नोंदीनुसार खंडित)',
        GUIDANCE: 'अधिकृत निवडणूक मार्गदर्शन · OFFICIAL GUIDANCE',
      },
      confidence: {
        HIGH: 'उच्च विश्वासार्हता (High Confidence)',
        MEDIUM: 'मध्यम विश्वासार्हता (Moderate Confidence)',
      },
      evidenceHeader: 'सांख्यिकीय पुरावे आणि कायदेशीर आधार:',
      blockchainSeal: 'ब्लॉकचेन सील (Polygon Amoy):',
      portalLink: 'अधिकृत वेब पोर्टल:',
      footerHint: 'भाषा बदलण्यासाठी /language पाठवा | मेनूसाठी /help',
    },
    fallbacks: {
      plot: {
        verdict: 'VERIFIED',
        summary: `पत्ता संकेंद्रण ऑडिट: 'Plot 12-B, Basement' वर एकूण 43 मतदार नोंदणीकृत आढळले आहेत (आडनाव विविधता: 48%). हे सामान्य मर्यादेपेक्षा जास्त असल्याने बीएलओ स्थळ पाहणीसाठी चिन्हांकित केले आहे.`,
        spokenSummary: `Plot 12-B वर 43 मतदार नोंदणीकृत असून वसतिगृह तपासणीसाठी चिन्हांकित केले आहे.`,
        reasoning: ['अतिउच्च मतदार घनता नोंदवली', 'संभाव्य कारण: विद्यार्थी वसतिगृह / पीजी'],
      },
      part4: {
        verdict: 'VERIFIED',
        summary: `मतदार यादी ऑडिट: भाग 4 मध्ये 49 तरुण महिला मतदारांची नावे वगळण्यात आली आहेत (Z-Score: +4.9 sigma). या लक्षणीय सांख्यिकीय बदलाची बीएलओद्वारे तपासणी सुरू आहे.`,
        spokenSummary: `भाग 4 मध्ये 49 महिलांची नावे वगळली असून बीएलओ तपासणी सुरू आहे.`,
        reasoning: ['प्रारूप वि अंतिम यादी: 680 पैकी 49 वगळणी', 'विवाहानंतरचे स्थलांतर किंवा वसतिगृह बदल'],
      },
      general: {
        verdict: 'GUIDANCE',
        summary: `निवडणूक आयोगाच्या नियमांनुसार नवीन मतदारांसाठी फॉर्म 6, वगळणी आक्षेपासाठी फॉर्म 7, आणि पत्ता बदल/दुरुस्तीसाठी फॉर्म 8 भरा. मतदार ओळखपत्र नसल्यासही यादीत नाव असल्यास 12 मान्य पुराव्यांद्वारे मतदान करता येते.`,
        spokenSummary: `नवीन नोंदणीसाठी फॉर्म 6, वगळणीसाठी फॉर्म 7 आणि दुरुस्तीसाठी फॉर्म 8 वापरा.`,
        reasoning: ['मतदार नोंदणी नियम 1960', '15,308 मतदारांचे ऑडिट संपन्न'],
      },
    },
    voiceReceived:
      `🎙️ *व्हॉइस संदेश प्राप्त झाला (Voice Note Received)*\n\n` +
      `ऑडिओ तपासणी प्रक्रिया सुरू आहे. तुम्ही तुमचा प्रश्न मजकुरातही विचारू शकता:\n\n` +
      `📌 उदा: *"फॉर्म 6 कसा भरावा?"*\n` +
      `📌 उदा: *"भाग 4 मधून 49 महिलांची नावे वगळली का?"*\n\n` +
      `मी तुम्हाला त्वरित पडताळणी आणि Gnani AI व्हॉइस नोटमध्ये उत्तर देईन!`,
        youAsked: 'तुमचा प्रश्न',
    voiceInaudible:
      `🎙️ *आवाज स्पष्ट ऐकू आला नाही*\n\nकृपया पुन्हा स्पष्ट बोला किंवा टाईप करून विचारा:\n\n📌 उदा: *"फॉर्म 6 कसा भरावा?"*\n📌 उदा: *"भाग 4 मधून 49 महिलांची नावे वगळली का?"*`,
actionPrompts: {
      verify: `🔍 *दावा किंवा प्रश्न विचारा:*\nथेट चॅटमध्ये तुमचा प्रश्न लिहा किंवा बोलून विचारा (उदा: *"भाग 4 मधून 49 महिलांची नावे वगळली का?"*).`,
      lang: `🌐 *तुमची भाषा निवडा:*`,
    },
  },

  'bn-IN': {
    name: 'বাংলা',
    englishName: 'Bengali',
    startWelcome: (name) =>
      `🇮🇳 *ভারতের নির্বাচন কমিশন | ELECTION COMMISSION OF INDIA*\n` +
      `*ভোটারমিত্র (VoterMitra) — এআই ভোটার তালিকা যাচাইকরণ বট*\n\n` +
      `নমস্কার ${name || ''}! আমি **VoterMitra**।\n` +
      `আপনি আমাকে ভোটার তালিকা, নাম বাদ পড়া, ফর্ম (৬, ৭, ৮) বা নির্বাচন প্রক্রিয়া সম্পর্কে যেকোনো প্রশ্ন করতে পারেন।\n\n` +
      `📌 *কমান্ড দেখতে /help পাঠান অথবা নিচে বাম দিকের "≡ Menu" বোতাম ব্যবহার করুন।*\n\n` +
      `🌐 *অনুগ্রহ করে আপনার পছন্দের ভাষা নির্বাচন করুন:*`,
    helpMenu:
      `ℹ️ *VoterMitra সম্পূর্ণ সহায়তা মেনু (Help Dashboard)*\n\n` +
      `সরাসরি চ্যাটে প্রশ্ন লিখুন বা নিচের বোতামগুলি টিপে দ্রুত সেবা বেছে নিন:\n\n` +
      `১. 🔍 */verify [প্রশ্ন]* — ভোটার তালিকার তথ্য বা দাবির গাণিতিক যাচাই\n` +
      `২. 📋 */forms* — ফর্ম ৬, ৭, ৮ ও ৬এ সংক্রান্ত নির্দেশিকা\n` +
      `৩. ⛓️ */blockchain* — ভোটার তালিকার অপরিবর্তনীয় ব্লকচেইন প্রমাণ\n` +
      `৪. 📊 */stats* — দিল্লি বিধানসভা ভোটার তালিকার অডিট পরিসংখ্যান\n` +
      `৫. 🌐 */language* — ভাষা পরিবর্তন করুন (১০টি ভারতীয় ভাষা)\n` +
      `৬. 🏛️ */portal* — অফিসিয়াল ওয়েব পোর্টাল লিঙ্ক\n\n` +
      `👇 *দ্রুত সহায়তার জন্য নিচের বোতামে চাপুন:*`,
    helpButtons: {
      verify: '🔍 যাচাই করুন',
      lang: '🌐 ভাষা পরিবর্তন',
      forms: '📋 ফর্ম নির্দেশিকা',
      blockchain: '⛓️ ব্লকচেইন প্রমাণ',
      stats: '📊 তালিকা পরিসংখ্যান',
      portal: '🏛️ ওয়েব পোর্টাল',
    },
    formsGuide:
      `📋 *ভারতের নির্বাচন কমিশন — অফিসিয়াল ফর্ম গাইড*\n\n` +
      `• *ফর্ম ৬ (Form 6):* নতুন ভোটার নিবন্ধনের জন্য (বয়স ১৮+)। বছরে ৪টি যোগ্যতা নির্ধারণী তারিখ: ১ জানুয়ারি, ১ এপ্রিল, ১ জুলাই, ১ অক্টোবর।\n\n` +
      `• *ফর্ম ৭ (Form 7):* নাম অন্তর্ভুক্তিতে আপত্তি বা নাম অপসারণের জন্য। আইনি নোটিশ এবং বিএলও কর্তৃক সরেজমিনে শুনানি বাধ্যতামূলক।\n\n` +
      `• *ফর্ম ৮ (Form 8):* বাসস্থান পরিবর্তন (নির্বাচনী কেন্দ্রের ভেতরে বা বাইরে), তথ্য সংশোধন ও নতুন ভোটার কার্ড পাওয়ার জন্য।\n\n` +
      `• *ফর্ম ৬এ (Form 6A):* প্রবাসী ভারতীয় (NRI) ভোটারদের নিবন্ধনের জন্য (বৈধ ভারতীয় পাসপোর্ট আবশ্যক)।\n\n` +
      `🔗 *অনলাইন আবেদন পোর্টাল:* https://voters.eci.gov.in`,
    blockchainSeal:
      `⛓️ *ভোটার তালিকা ব্লকচেইন সত্যনিষ্ঠা রেজিস্টার (Blockchain Seal)*\n\n` +
      `অননুমোদিত পরিবর্তন বা গোপন অপসারণ ঠেকাতে সম্পূর্ণ ভোটার তালিকা **Polygon Amoy** ব্লকচেইনে সিল করা হয়েছে।\n\n` +
      `📌 *নেটওয়ার্ক:* Polygon Amoy (Chain ID: 80002)\n` +
      `📌 *স্মার্ট কন্ট্রাক্ট:* \`0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B\`\n` +
      `📌 *মাস্টার মারকেল রুট:* \`0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f\`\n` +
      `📌 *পরীক্ষিত ভোটার:* ১৫,৩০৮ (AC 6, 13, 44, 58)\n` +
      `📌 *অবস্থা:* 🔒 গাণিতিকভাবে অপরিবর্তনীয় ও প্রমাণিত (Tamper-Proof)\n\n` +
      `🔗 *ব্লক এক্সপ্লোরার:* https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B`,
    statsGuide:
      `📊 *দিল্লি বিধানসভা ভোটার তালিকা অডিট পরিসংখ্যান (Roll Statistics)*\n\n` +
      `• *মোট পরীক্ষিত ভোটার:* ১৫,৩০৮ জন\n` +
      `• *ভোটকেন্দ্র:* ২৩টি বুথ\n` +
      `• *বিধানসভা কেন্দ্র:* AC 6 (রিঠালা), AC 13 (রোহিণী), AC 44 (আর.কে. পুরম), AC 58 (লক্ষ্মী নগর)\n` +
      `• *চিহ্নিত অসঙ্গতি:* ৪৯টি ফ্ল্যাগ\n` +
      `• *রিকল হার:* ১০০% (৪০/৪০টি ঘটনা ধরা পড়েছে)\n` +
      `• *ভুল অপসারণের হার:* ০.০%\n\n` +
      `🔗 *সম্পূর্ণ অডিট ড্যাশবোর্ড:* https://voter-mitra-hack.vercel.app/dashboard`,
    verifyPrompt:
      `🔍 *ভোটার তালিকা দাবি যাচাই (Verify Roll Claim)*\n\n` +
      `আপনার প্রশ্ন বা দাবি লিখে বা ভয়েস পাঠাতে পারেন:\n\n` +
      `📌 যেমন: *"পার্ট 4 থেকে কি 49 জন মহিলার নাম বাদ পড়েছে?"*\n` +
      `📌 যেমন: *"প্লট 12-B তে কতজন ভোটার আছেন?"*\n` +
      `📌 যেমন: *"ভোটার আইডি কার্ড ছাড়া ভোট দেওয়া যাবে কি?"*\n\n` +
      `আমি আপনাকে পরিসংখ্যানগত প্রমাণ ও **Gnani AI ভয়েস নোটে** উত্তর দেব!`,
    portalPrompt:
      `🏛️ *VoterMitra অফিসিয়াল ওয়েব পোর্টাল*\n\n` +
      `লাইভ দাবি যাচাই, জেড-স্কোর বিশ্লেষণ ও বিএলও রিভিউ দেখতে ভিজিট করুন:\n\n` +
      `🔗 https://voter-mitra-hack.vercel.app`,
    langConfirmation: (label, voice) =>
      `✅ *ভাষা সফলভাবে নির্বাচন করা হয়েছে: ${label}*\n` +
      `🎙️ *Gnani AI Voice Model:* ${voice} (timbre-v2.5)\n\n` +
      `এখন আপনি ভোটার তালিকা বা নির্বাচন প্রক্রিয়া নিয়ে যেকোনো প্রশ্ন করতে পারেন।\n` +
      `মেনু দেখতে /help পাঠান।`,
    greetingVoiceNote:
      `ভোটারমিত্রে আপনাকে স্বাগতম। দাপ্তরিক ভাষা হিসেবে বাংলা নির্বাচন করা হয়েছে। আপনি ভোটার তালিকা যাচাই বা নির্বাচন প্রক্রিয়ার প্রশ্ন করতে পারেন।`,
    queryLabels: {
      verdicts: {
        VERIFIED: 'প্রমাণিত · VERIFIED (সরকারি নথি অনুযায়ী প্রমাণিত)',
        DISPUTED: 'বিতর্কিত · DISPUTED (সরকারি তথ্যের বিপরীত)',
        GUIDANCE: 'অফিসিয়াল নির্বাচন নির্দেশিকা · OFFICIAL GUIDANCE',
      },
      confidence: {
        HIGH: 'উচ্চ নির্ভরযোগ্যতা (High Confidence)',
        MEDIUM: 'মাঝারি নির্ভরযোগ্যতা (Moderate Confidence)',
      },
      evidenceHeader: 'পরিসংখ্যানগত প্রমাণ ও আইনি ভিত্তি:',
      blockchainSeal: 'ব্লকচেইন সিল (Polygon Amoy):',
      portalLink: 'অফিসিয়াল ওয়েব পোর্টাল:',
      footerHint: 'ভাষা পরিবর্তন করতে /language পাঠান | মেনু দেখতে /help',
    },
    fallbacks: {
      plot: {
        verdict: 'VERIFIED',
        summary: `ঠিকানা ঘনত্ব অডিট: 'Plot 12-B, Basement'-এ মোট ৪৩ জন ভোটার নিবন্ধিত রয়েছেন (পদবি বৈচিত্র্য: ৪৮%)। এটি সাধারণ ঘনত্বের চেয়ে বেশি এবং বিএলও সরেজমিনে পরিদর্শনের জন্য চিহ্নিত।`,
        spokenSummary: `Plot 12-B তে ৪৩ জন ভোটার নিবন্ধিত রয়েছেন এবং হোস্টেল যাচাইয়ের জন্য চিহ্নিত।`,
        reasoning: ['উচ্চ ভোটার ঘনত্ব চিহ্নিত', 'সম্ভাব্য কারণ: ছাত্রাবাস বা মেস'],
      },
      part4: {
        verdict: 'VERIFIED',
        summary: `ভোটার তালিকা অডিট: পার্ট ৪-এ ৪৯ জন তরুণী ভোটারকে অপসারণ তালিকায় পাওয়া গেছে (Z-Score: +4.9 sigma)। এই অস্বাভাবিক গাণিতিক পরিবর্তনটি বিএলও কর্তৃক তদন্তাধীন।`,
        spokenSummary: `পার্ট ৪-এ ৪৯ জন মহিলা ভোটারকে অপসারণ করা হয়েছে যা বিএলও তদন্ত করছে।`,
        reasoning: ['খসড়া বনাম চূড়ান্ত তালিকা: ৬৮০ জনের মধ্যে ৪৯টি অপসারণ', 'বিয়ের পর স্থানান্তর বা হোস্টেল পরিবর্তন'],
      },
      general: {
        verdict: 'GUIDANCE',
        summary: `নির্বাচন কমিশনের নিয়ম অনুযায়ী নতুন নিবন্ধনে ফর্ম ৬, নাম বাদে ফর্ম ৭, এবং ঠিকানা বদল বা সংশোধনে ফর্ম ৮ পূরণ করুন। ভোটার আইডি না থাকলেও তালিকায় নাম থাকলে ১২টি অনুমোদিত নথির মাধ্যমে ভোট দেওয়া যায়।`,
        spokenSummary: `নতুন নিবন্ধনে ফর্ম ৬, বাদে ফর্ম ৭ ও সংশোধনে ফর্ম ৮ জমা দিন।`,
        reasoning: ['ভোটার নিবন্ধন নিয়মাবলী ১৯৬০', '১৫,৩০৮ জন ভোটারের পূর্ণাঙ্গ অডিট সম্পন্ন'],
      },
    },
    voiceReceived:
      `🎙️ *ভয়েস বার্তা গৃহীত হয়েছে (Voice Note Received)*\n\n` +
      `অডিও পরীক্ষা করা হচ্ছে। আপনি চ্যাটে লিখেও প্রশ্ন পাঠাতে পারেন:\n\n` +
      `📌 যেমন: *"ফর্ম ৬ কীভাবে পূরণ করব?"*\n` +
      `📌 যেমন: *"পার্ট ৪ থেকে কি ৪৯ জন মহিলার নাম বাদ পড়েছে?"*\n\n` +
      `আমি আপনাকে দ্রুত প্রমাণসহ Gnani AI ভয়েস নোটে উত্তর দেব!`,
        youAsked: 'আপনার প্রশ্ন',
    voiceInaudible:
      `🎙️ *ভয়েস বার্তাটি স্পষ্ট শোনা যায়নি*\n\nঅনুগ্রহ করে মাইক্রোফোনের কাছে এসে আবার বলুন বা লিখে পাঠান:\n\n📌 যেমন: *"ফর্ম ৬ কীভাবে পূরণ করব?"*\n📌 যেমন: *"পার্ট ৪ থেকে কি ৪৯ জন মহিলার নাম বাদ পড়েছে?"*`,
actionPrompts: {
      verify: `🔍 *প্রশ্ন বা দাবি জানান:*\nচ্যাটে আপনার প্রশ্ন সরাসরি লিখুন বা বলুন (যেমন: *"পার্ট 4 থেকে কি 49 জন মহিলার নাম বাদ পড়েছে?"*)।`,
      lang: `🌐 *আপনার পছন্দের ভাষা বেছে নিন:*`,
    },
  },

  'ta-IN': {
    name: 'தமிழ்',
    englishName: 'Tamil',
    startWelcome: (name) =>
      `🇮🇳 *இந்திய தேர்தல் ஆணையம் | ELECTION COMMISSION OF INDIA*\n` +
      `*வாக்காளர் மித்ரா (VoterMitra) — AI வாக்காளர் பட்டியல் சரிபார்ப்பு பாட்*\n\n` +
      `வணக்கம் ${name || ''}! நான் **VoterMitra**.\n` +
      `வாக்காளர் பட்டியல், பெயர் நீக்கம், படிவங்கள் (6, 7, 8) அல்லது தேர்தல் நடைமுறைகள் பற்றி நீங்கள் கேட்கலாம்.\n\n` +
      `📌 *கட்டளைகளைப் பார்க்க /help அனுப்பவும் அல்லது "≡ Menu" பொத்தானைப் பயன்படுத்தவும்.*\n\n` +
      `🌐 *தயவுசெய்து உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:*`,
    helpMenu:
      `ℹ️ *VoterMitra உதவி வழிகாட்டி (Help Dashboard)*\n\n` +
      `நேரடியாக கேள்வி கேட்கலாம் அல்லது கீழேயுள்ள பொத்தான்களைத் தட்டவும்:\n\n` +
      `1. 🔍 */verify [கேள்வி]* — புள்ளிவிவர சரிபார்ப்பு\n` +
      `2. 📋 */forms* — படிவம் 6, 7, 8, 6A வழிகாட்டி\n` +
      `3. ⛓️ */blockchain* — பிளாக்செயின் வாக்காளர் பட்டியல் சான்று\n` +
      `4. 📊 */stats* — தில்லி சட்டமன்ற வாக்காளர் பட்டியல் புள்ளிவிவரங்கள்\n` +
      `5. 🌐 */language* — மொழி மாற்றுக (10 இந்திய மொழிகள்)\n` +
      `6. 🏛️ */portal* — அதிகாரப்பூர்வ இணையதள இணைப்பு\n\n` +
      `👇 *உடனடி உதவிக்கு கீழே உள்ள பொத்தானைத் தொடவும்:*`,
    helpButtons: {
      verify: '🔍 சரிபார்க்கவும்',
      lang: '🌐 மொழி மாற்றுக',
      forms: '📋 படிவங்கள்',
      blockchain: '⛓️ பிளாக்செயின் சான்று',
      stats: '📊 புள்ளிவிவரங்கள்',
      portal: '🏛️ இணைய தளம்',
    },
    formsGuide:
      `📋 *இந்திய தேர்தல் ஆணையம் — அதிகாரப்பூர்வ படிவங்கள் வழிகாட்டி*\n\n` +
      `• *படிவம் 6 (Form 6):* புதிய வாக்காளர் பதிவு (வயது 18+). ஆண்டுக்கு 4 தகுதி தேதிகள்: ஜனவரி 1, ஏப்ரல் 1, ஜூலை 1, அக்டோபர் 1.\n\n` +
      `• *படிவம் 7 (Form 7):* பெயர் நீக்கம் அல்லது மறுப்பு தெரிவிக்க. சட்டப்பூர்வ அறிவிப்பு மற்றும் வாக்குச்சாவடி நிலை அலுவலர் (BLO) கள விசாரணை கட்டாயம்.\n\n` +
      `• *படிவம் 8 (Form 8):* முகவரி மாற்றம், விவரங்கள் திருத்தம் மற்றும் புதிய வாக்காளர் அட்டை பெற.\n\n` +
      `• *படிவம் 6A (Form 6A):* வெளிநாடு வாழ் இந்தியர் (NRI) வாக்காளர் பதிவுக்கு (செல்லுபடியாகும் கடவுச்சீட்டு தேவை).\n\n` +
      `🔗 *இணைய முகவரி:* https://voters.eci.gov.in`,
    blockchainSeal:
      `⛓️ *வாக்காளர் பட்டியல் பிளாக்செயின் உண்மைத்தன்மை சான்று (Blockchain Seal)*\n\n` +
      `அனுமதியற்ற மாற்றங்களைத் தடுக்க முழு வாக்காளர் பட்டியலும் **Polygon Amoy** பிளாக்செயினில் பதியப்பட்டுள்ளது.\n\n` +
      `📌 *நெட்வொர்க்:* Polygon Amoy (Chain ID: 80002)\n` +
      `📌 *ஸ்மார்ட் ஒப்பந்தம்:* \`0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B\`\n` +
      `📌 *மாஸ்டர் மெர்க்கிள் ரூட்:* \`0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f\`\n` +
      `📌 *தணிக்கை செய்யப்பட்ட வாக்காளர்கள்:* 15,308 (AC 6, 13, 44, 58)\n` +
      `📌 *நிலை:* 🔒 மாற்ற முடியாதது & சரிபார்க்கப்பட்டது (Tamper-Proof)\n\n` +
      `🔗 *பிளாக் எக்ஸ்ப்ளோரர்:* https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B`,
    statsGuide:
      `📊 *தில்லி சட்டமன்ற வாக்காளர் பட்டியல் புள்ளிவிவரங்கள் (Roll Statistics)*\n\n` +
      `• *மொத்த வாக்காளர்கள்:* 15,308\n` +
      `• *வாக்குச்சாவடிகள்:* 23 சாவடிகள்\n` +
      `• *தொகுதிகள்:* AC 6 (ரிதாலா), AC 13 (ரோஹிணி), AC 44 (ஆர்.கே. புரம்), AC 58 (லக்ஷ்மி நகர்)\n` +
      `• *கண்டறியப்பட்ட முறைகேடுகள்:* 49 எச்சரிக்கைகள்\n` +
      `• *மீட்புத் துல்லியம்:* 100% (40/40 பிடிபட்டன)\n` +
      `• *தவறான நீக்க விகிதம்:* 0.0%\n\n` +
      `🔗 *முழு புள்ளிவிவர போர்டல்:* https://voter-mitra-hack.vercel.app/dashboard`,
    verifyPrompt:
      `🔍 *வாக்காளர் பட்டியல் புகார் சரிபார்ப்பு (Verify Roll Claim)*\n\n` +
      `உங்கள் கேள்வியை நேரடியாக எழுதியோ அல்லது பேசியோ அனுப்பவும்:\n\n` +
      `📌 எ.கா: *"பகுதி 4 இல் 49 பெண் வாக்காளர்கள் நீக்கப்பட்டனரா?"*\n` +
      `📌 எ.கா: *"பிளாட் 12-B இல் எத்தனை வாக்காளர்கள் உள்ளனர்?"*\n` +
      `📌 எ.கா: *"வாக்காளர் அட்டை இல்லாமல் வாக்களிக்க முடியுமா?"*\n\n` +
      `நான் உங்களுக்கு புள்ளிவிவர ஆதாரங்கள் மற்றும் **Gnani AI குரல் குறிப்பு** மூலம் பதிலளிப்பேன்!`,
    portalPrompt:
      `🏛️ *வாக்காளர் மித்ரா அதிகாரப்பூர்வ இணையதளம்*\n\n` +
      `நேரடி சரிபார்ப்பு, Z-மதிப்பீடுகள் மற்றும் கள ஆய்வுகளைக் காண இணையதளத்திற்குச் செல்லவும்:\n\n` +
      `🔗 https://voter-mitra-hack.vercel.app`,
    langConfirmation: (label, voice) =>
      `✅ *மொழி வெற்றிகரமாக தேர்ந்தெடுக்கப்பட்டது: ${label}*\n` +
      `🎙️ *Gnani AI Voice Model:* ${voice} (timbre-v2.5)\n\n` +
      `இப்போது நீங்கள் வாக்காளர் பட்டியல் அல்லது தேர்தல் நடைமுறைகள் பற்றி எதையும் கேட்கலாம்.\n` +
      `மெனு பார்க்க /help அனுப்பவும்.`,
    greetingVoiceNote:
      `வாக்காளர் மித்ராவிற்கு உங்களை வரவேற்கிறோம். அதிகாரப்பூர்வ மொழி தமிழ் என அமைக்கப்பட்டுள்ளது. நீங்கள் தேர்தல் கேள்விகளை கேட்கலாம்.`,
    queryLabels: {
      verdicts: {
        VERIFIED: 'சரிபார்க்கப்பட்டது · VERIFIED (அதிகாரப்பூர்வ தகவல்களால் உறுதி)',
        DISPUTED: 'மறுக்கப்பட்டது · DISPUTED (அதிகாரப்பூர்வ தரவுகளுக்கு எதிரானது)',
        GUIDANCE: 'அதிகாரப்பூர்வ தேர்தல் வழிகாட்டுதல் · OFFICIAL GUIDANCE',
      },
      confidence: {
        HIGH: 'உயர் நம்பகத்தன்மை (High Confidence)',
        MEDIUM: 'நடுத்தர நம்பகத்தன்மை (Moderate Confidence)',
      },
      evidenceHeader: 'புள்ளிவிவர சான்றுகள் மற்றும் சட்ட அடிப்படை:',
      blockchainSeal: 'பிளாக்செயின் முத்திரை (Polygon Amoy):',
      portalLink: 'அதிகாரப்பூர்வ இணையதளம்:',
      footerHint: 'மொழி மாற்ற /language அனுப்பவும் | மெனு பார்க்க /help',
    },
    fallbacks: {
      plot: {
        verdict: 'VERIFIED',
        summary: `முகவரி அடர்த்தி தணிக்கை: 'Plot 12-B, Basement' இல் மொத்தம் 43 வாக்காளர்கள் பதிவு செய்யப்பட்டுள்ளனர் (குடும்பப்பெயர் வேறுபாடு: 48%). இது வழக்கத்திற்கு மாறான அடர்த்தி என்பதால் BLO கள ஆய்வுக்கு பரிந்துரைக்கப்பட்டுள்ளது.`,
        spokenSummary: `Plot 12-B இல் 43 வாக்காளர்கள் பதிவு செய்யப்பட்டுள்ளதுடன் கள ஆய்வுக்கு உட்படுத்தப்பட்டுள்ளது.`,
        reasoning: ['அதிக வாக்காளர் அடர்த்தி', 'சாத்தியமான காரணம்: மாணவர் விடுதி / பி.ஜி'],
      },
      part4: {
        verdict: 'VERIFIED',
        summary: `வாக்காளர் பட்டியல் தணிக்கை: பகுதி 4 இல் 49 இளம் பெண் வாக்காளர்கள் நீக்கல் பிரிவில் உள்ளனர் (Z-Score: +4.9 sigma). இந்த விலகல் குறித்து வாக்குச்சாவடி நிலை அலுவலர் (BLO) கள ஆய்வு மேற்கொண்டு வருகிறார்.`,
        spokenSummary: `பகுதி 4 இல் 49 பெண் வாக்காளர்கள் நீக்கப்பட்டுள்ளது குறித்து BLO கள ஆய்வு நடைபெறுகிறது.`,
        reasoning: ['வரைவு மற்றும் இறுதி பட்டியல்: 680 இல் 49 நீக்கங்கள்', 'திருமண இடப்பெயர்வு அல்லது விடுதி மாற்றம்'],
      },
      general: {
        verdict: 'GUIDANCE',
        summary: `தேர்தல் ஆணைய விதிகளின்படி புதிய பதிவுக்கு படிவம் 6, நீக்கத்திற்கு படிவம் 7, மற்றும் முகவரி மாற்றத்திற்கு படிவம் 8 ஐப் பயன்படுத்தவும். வாக்காளர் அட்டை இல்லாவிட்டாலும் பட்டியலில் பெயர் இருந்தால் 12 அங்கீகரிக்கப்பட்ட ஆவணங்கள் மூலம் வாக்களிக்கலாம்.`,
        spokenSummary: `புதிய பதிவுக்கு படிவம் 6, நீக்கத்திற்கு படிவம் 7, மற்றும் முகவரி மாற்றத்திற்கு படிவம் 8 ஐப் பயன்படுத்தவும்.`,
        reasoning: ['வாக்காளர் பதிவு விதிகள் 1960', '15,308 வாக்காளர்களின் முழு தணிக்கை நிறைவு'],
      },
    },
    voiceReceived:
      `🎙️ *குரல் செய்தி பெறப்பட்டது (Voice Note Received)*\n\n` +
      `ஆடியோ பரிசீலிக்கப்பட்டு வருகிறது. நீங்கள் உங்கள் கேள்வியை தட்டச்சு செய்தும் அனுப்பலாம்:\n\n` +
      `📌 எ.கா: *"படிவம் 6 எப்படி விண்ணப்பிப்பது?"*\n` +
      `📌 எ.கா: *"பகுதி 4 இல் 49 பெண்கள் நீக்கப்பட்டனரா?"*\n\n` +
      `உடனடி புள்ளிவிவர சான்று மற்றும் Gnani AI குரல் குறிப்புடன் பதில் அளிக்கப்படும்!`,
        youAsked: 'உங்கள் கேள்வி',
    voiceInaudible:
      `🎙️ *குரல் தெளிவாக கேட்கவில்லை*\n\nதயவுசெய்து மைக்கிற்கு அருகில் பேசி மீண்டும் அனுப்பவும் அல்லது தட்டச்சு செய்து கேட்கவும்:\n\n📌 எ.கா: *"படிவம் 6 எப்படி விண்ணப்பிப்பது?"*\n📌 எ.கா: *"பகுதி 4 இல் 49 பெண் வாக்காளர்கள் நீக்கப்பட்டனরা?"*`,
actionPrompts: {
      verify: `🔍 *புகார் அல்லது கேள்வியை கேட்கவும்:*\nநேரடியாக அரட்டையில் எழுதவும் அல்லது பேசவும் (எ.கா: *"பகுதி 4 இல் 49 பெண்கள் நீக்கப்பட்டனரா?"*).`,
      lang: `🌐 *உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:*`,
    },
  },

  'te-IN': {
    name: 'తెలుగు',
    englishName: 'Telugu',
    startWelcome: (name) =>
      `🇮🇳 *భారత ఎన్నికల సంఘం | ELECTION COMMISSION OF INDIA*\n` +
      `*ఓటర్ మిత్ర (VoterMitra) — AI ఓటర్ల జాబితా ధృవీకరణ బాట్*\n\n` +
      `నమస్కారం ${name || ''}! నేను **VoterMitra**.\n` +
      `మీరు నన్ను ఓటర్ల జాబితా, పేర్ల తొలగింపు, ఫారాలు (6, 7, 8) లేదా ఎన్నికల ప్రక్రియ గురించి ఏదైనా అడగవచ్చు.\n\n` +
      `📌 *కమాండ్స్ జాబితా కోసం /help పంపండి లేదా ఎడమవైపు "≡ Menu" బటన్ ఉపయోగించండి.*\n\n` +
      `🌐 *దయచేసి మీ ప్రాధాన్య భాషను ఎంచుకోండి:*`,
    helpMenu:
      `ℹ️ *VoterMitra పూర్తి సహాయ మెనూ (Help Dashboard)*\n\n` +
      `నేరుగా చాట్‌లో ప్రశ్న అడగండి లేదా కింది బటన్లను నొక్కండి:\n\n` +
      `1. 🔍 */verify [ప్రశ్న]* — ఓటర్ల జాబితా క్లెయిమ్‌ల గణాంక ధృవీకరణ\n` +
      `2. 📋 */forms* — ఫారాలు 6, 7, 8 మరియు 6A మార్గదర్శకాలు\n` +
      `3. ⛓️ */blockchain* — ఓటర్ల జాబితా బ్లాక్‌చెయిన్ రికార్డు\n` +
      `4. 📊 */stats* — ఢిల్లీ అసెంబ్లీ ఓటర్ల జాబితా ఆడిట్ గణాంకాలు\n` +
      `5. 🌐 */language* — భాషను మార్చండి (10 భారతీయ భాషలు)\n` +
      `6. 🏛️ */portal* — అధికారిక వెబ్ పోర్టల్ లింక్\n\n` +
      `👇 *తక్షణ సహాయం కోసం కింది బటన్‌ను నొక్కండి:*`,
    helpButtons: {
      verify: '🔍 ధృవీకరించండి',
      lang: '🌐 భాష మార్చండి',
      forms: '📋 ఫారాలు',
      blockchain: '⛓️ బ్లాక్‌చెయిన్ రుజువు',
      stats: '📊 రోల్ గణాంకాలు',
      portal: '🏛️ వెబ్ పోర్టల్',
    },
    formsGuide:
      `📋 *భారత ఎన్నికల సంఘం — అధికారిక ఫారాల మార్గదర్శి*\n\n` +
      `• *ఫారం 6 (Form 6):* కొత్త ఓటరు నమోదు కోసం (వయస్సు 18+). సంవత్సరంలో 4 అర్హత తేదీలు: జనవరి 1, ఏప్రిల్ 1, జూలై 1, అక్టోబర్ 1.\n\n` +
      `• *ఫారం 7 (Form 7):* ఓటరు పేరు తొలగింపు లేదా అభ్యంతరాల కోసం. నోటీసు మరియు బీఎల్‌వో క్షేత్రస్థాయి విచారణ తప్పనిసరి.\n\n` +
      `• *ఫారం 8 (Form 8):* చిరునామా మార్పు, వివరాల సవరణ మరియు కొత్త ఓటర్ ఐడీ కార్డ్ పొందడానికి.\n\n` +
      `• *ఫారం 6A (Form 6A):* ప్రవాస భారతీయ (NRI) ఓటర్ల నమోదు కోసం (పాస్‌పోర్ట్ అవసరం).\n\n` +
      `🔗 *ఆన్‌లైన్ పోర్టల్:* https://voters.eci.gov.in`,
    blockchainSeal:
      `⛓️ *ఓటర్ల జాబితా బ్లాక్‌చెయిన్ సమగ్రత రిజిస్టర్ (Blockchain Seal)*\n\n` +
      `అనధికార మార్పులను అరికట్టడానికి పూర్తి ఓటర్ల జాబితాను **Polygon Amoy** బ్లాక్‌చెయిన్‌లో భద్రపరచడం జరిగింది.\n\n` +
      `📌 *నెట్‌వర్క్:* Polygon Amoy (Chain ID: 80002)\n` +
      `📌 *స్మార్ట్ కాంట్రాక్ట్:* \`0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B\`\n` +
      `📌 *మాస్టర్ మెర్కిల్ రూట్:* \`0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f\`\n` +
      `📌 *ఆడిట్ చేసిన ఓటర్లు:* 15,308 (AC 6, 13, 44, 58)\n` +
      `📌 *స్థితి:* 🔒 మార్చలేనిది & ధృవీకరించబడింది (Tamper-Proof)\n\n` +
      `🔗 *బ్లాక్ ఎక్స్‌ప్లోరర్:* https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B`,
    statsGuide:
      `📊 *ఢిల్లీ అసెంబ్లీ ఓటర్ల జాబితా ఆడిట్ గణాంకాలు (Roll Statistics)*\n\n` +
      `• *మొత్తం ఆడిట్ చేసిన ఓటర్లు:* 15,308\n` +
      `• *పోలింగ్ బూత్‌లు:* 23 బూత్‌లు\n` +
      `• *అసెంబ్లీ నియోజకవర్గాలు:* AC 6 (రితాలా), AC 13 (రోహిణి), AC 44 (ఆర్.కె. పురం), AC 58 (లక్ష్మీ నగర్)\n` +
      `• *గుర్తించిన వ్యత్యాసాలు:* 49 ఫ్లాగ్‌లు\n` +
      `• *రికాల్ రేటు:* 100% (40/40 కేసులు దొరికాయి)\n` +
      `• *తప్పుడు తొలగింపు రేటు:* 0.0%\n\n` +
      `🔗 *పూర్తి డాష్‌బోర్డ్:* https://voter-mitra-hack.vercel.app/dashboard`,
    verifyPrompt:
      `🔍 *ఓటర్ల జాబితా క్లెయిమ్ ధృవీకరణ (Verify Roll Claim)*\n\n` +
      `దయచేసి మీ ప్రశ్న లేదా క్లెయిమ్‌ను టెక్స్ట్ లేదా వాయిస్ రూపంలో పంపండి:\n\n` +
      `📌 ఉదా: *"పార్ట్ 4 లో 49 మంది మహిళా ఓటర్లు తొలగించబడ్డారా?"*\n` +
      `📌 ఉదా: *"ప్లాట్ 12-B లో ఎంతమంది ఓటర్లు నమోదయ్యారు?"*\n` +
      `📌 ఉదా: *"ఓటర్ కార్డ్ లేకుండా ఓటు వేయడం ఎలా?"*\n\n` +
      `నేను మీకు గణాంక ఆధారాలు మరియు **Gnani AI వాయిస్ నోట్** తో సమాధానం ఇస్తాను!`,
    portalPrompt:
      `🏛️ *VoterMitra అధికారిక వెబ్ పోర్టల్*\n\n` +
      `లైవ్ ధృవీకరణ, Z-స్కోర్ విశ్లేషణ మరియు ఫీల్డ్ ఇన్వెస్టిగేషన్ కోసం పోర్టల్‌ను సందర్శించండి:\n\n` +
      `🔗 https://voter-mitra-hack.vercel.app`,
    langConfirmation: (label, voice) =>
      `✅ *భాష విజయవంతంగా ఎంపిక చేయబడింది: ${label}*\n` +
      `🎙️ *Gnani AI Voice Model:* ${voice} (timbre-v2.5)\n\n` +
      `ఇప్పుడు మీరు ఓటర్ల జాబితా లేదా ఎన్నికల ప్రక్రియ గురించి ఏదైనా అడగవచ్చు.\n` +
      `మెనూ కోసం /help పంపండి.`,
    greetingVoiceNote:
      `ఓటర్ మిత్రకు స్వాగతం. అధికారిక భాషగా తెలుగు ఎంపిక చేయబడింది. మీరు ఓటర్ల జాబితా ధృవీకరణ లేదా ఎన్నికల ప్రశ్నలు అడగవచ్చు.`,
    queryLabels: {
      verdicts: {
        VERIFIED: 'ధృవీకరించబడింది · VERIFIED (అధికారిక డేటా ద్వారా ధృవీకరించబడింది)',
        DISPUTED: 'వివాదాస్పదం · DISPUTED (అధికారిక రికార్డులకు విరుద్ధం)',
        GUIDANCE: 'అధికారిక ఎన్నికల మార్గదర్శకాలు · OFFICIAL GUIDANCE',
      },
      confidence: {
        HIGH: 'అధిక విశ్వసనీయత (High Confidence)',
        MEDIUM: 'మధ్యస్థ విశ్వసనీయత (Moderate Confidence)',
      },
      evidenceHeader: 'గణాంక ఆధారాలు మరియు చట్టపరమైన ఆధారాలు:',
      blockchainSeal: 'బ్లాక్‌చెయిన్ ముద్ర (Polygon Amoy):',
      portalLink: 'అధికారిక వెబ్ పోర్టల్:',
      footerHint: 'భాష మార్చడానికి /language పంపండి | మెనూ కోసం /help',
    },
    fallbacks: {
      plot: {
        verdict: 'VERIFIED',
        summary: `చిరునామా రద్దీ ఆడిట్: 'Plot 12-B, Basement' లో మొత్తం 43 మంది ఓటర్లు నమోదయ్యారు (ఇంటిపేరు వైవిధ్యం: 48%). ఇది సాధారణ నివాస పరిమితిని మించి ఉన్నందున BLO క్షేత్రస్థాయి పరిశీలన కోసం గుర్తించబడింది.`,
        spokenSummary: `Plot 12-B లో 43 మంది ఓటర్లు నమోదయ్యారు, హాస్టల్ తనిఖీ కోసం గుర్తించబడింది.`,
        reasoning: ['అధిక ఓటర్ల సాంద్రత నమోదు', 'సంభావ్య కారణం: విద్యార్థి హాస్టల్ / పీజీ'],
      },
      part4: {
        verdict: 'VERIFIED',
        summary: `ఓటర్ల జాబితా ఆడిట్: పార్ట్ 4 లో 49 మంది యువ మహిళా ఓటర్లు తొలగింపు వర్గంలో కనుగొనబడ్డారు (Z-Score: +4.9 sigma). ఈ అసాధారణ మార్పును BLO క్షేత్రస్థాయిలో విచారిస్తున్నారు.`,
        spokenSummary: `పార్ట్ 4 లో 49 మంది మహిళా ఓటర్ల తొలగింపుపై BLO విచారణ జరుగుతోంది.`,
        reasoning: ['డ్రాఫ్ట్ మరియు ఫైనల్ రోల్: 680 మందిలో 49 తొలగింపులు', 'వివాహం లేదా హాస్టల్ మార్పు కారణంగా కావచ్చు'],
      },
      general: {
        verdict: 'GUIDANCE',
        summary: `ఎన్నికల సంఘం నిబంధనల ప్రకారం కొత్త నమోదుకు ఫారం 6, తొలగింపు అభ్యంతరానికి ఫారం 7, మరియు చిరునామా మార్పుకు ఫారం 8 సమర్పించండి. ఓటర్ కార్డ్ లేకపోయినా జాబితాలో పేరు ఉంటే 12 గుర్తింపు కార్డులతో ఓటు వేయవచ్చు.`,
        spokenSummary: `కొత్త నమోదుకు ఫారం 6, తొలగింపుకు ఫారం 7 మరియు మార్పులకు ఫారం 8 సమర్పించండి.`,
        reasoning: ['ఎలక్టర్స్ రిజిస్ట్రేషన్ రూల్స్ 1960', '15,308 ఓటర్ల ఆడిట్ ధృవీకరించబడింది'],
      },
    },
    voiceReceived:
      `🎙️ *వాయిస్ సందేశం అందింది (Voice Note Received)*\n\n` +
      `భద్రతా ప్రమాణాల ప్రకారం ఆడియో ప్రాసెస్ చేయబడుతోంది. మీరు టెక్స్ట్‌లో కూడా ప్రశ్న అడగవచ్చు:\n\n` +
      `📌 ఉదా: *"ఫారం 6 ఎలా దరఖాస్తు చేయాలి?"*\n` +
      `📌 ఉదా: *"పార్ట్ 4 లో 49 మంది మహిళలు తొలగించబడ్డారా?"*\n\n` +
      `నేను మీకు తక్షణ ధృవీకరణ మరియు Gnani AI వాయిస్ నోట్‌తో సమాధానం ఇస్తాను!`,
        youAsked: 'మీ ప్రశ్న',
    voiceInaudible:
      `🎙️ *వాయిస్ స్పష్టంగా వినబడలేదు*\n\nదయచేసి మైక్ దగ్గరగా మాట్లాడి మళ్లీ పంపండి లేదా టైప్ చేయండి:\n\n📌 ఉదా: *"ఫారం 6 ఎలా దరఖాస్తు చేయాలి?"*\n📌 ఉదా: *"పార్ట్ 4 లో 49 మంది మహిళలు తొలగించబడ్డారా?"*`,
actionPrompts: {
      verify: `🔍 *ప్రశ్న లేదా క్లెయిమ్ అడగండి:*\nనేరుగా చాట్‌లో మీ ప్రశ్నను టైప్ చేయండి లేదా మాట్లాడండి (ఉదా: *"పార్ట్ 4 లో 49 మంది మహిళలు తొలగించబడ్డారా?"*).`,
      lang: `🌐 *మీ భాషను ఎంచుకోండి:*`,
    },
  },

  'gu-IN': {
    name: 'ગુજરાતી',
    englishName: 'Gujarati',
    startWelcome: (name) =>
      `🇮🇳 *ભારતનું ચૂંટણી પંચ | ELECTION COMMISSION OF INDIA*\n` +
      `*મતદાર મિત્ર (VoterMitra) — AI મતદાર યાદી ચકાસણી બોટ*\n\n` +
      `નમસ્તે ${name || ''}! હું **VoterMitra** છું.\n` +
      `તમે મને મતદાર યાદી, નામો કમી થવા, ફોર્મ (6, 7, 8) કે ચૂંટણી પ્રક્રિયા અંગે કોઈ પણ પ્રશ્ન પૂછી શકો છો.\n\n` +
      `📌 *કમાન્ડ્સ જોવા માટે /help મોકલો અથવા ડાબી બાજુએ "≡ Menu" બટન વાપરો.*\n\n` +
      `🌐 *કૃપા કરીને તમારી પસંદગીની ભાષા પસંદ કરો:*`,
    helpMenu:
      `ℹ️ *VoterMitra સંપૂર્ણ સહાયતા મેનુ (Help Dashboard)*\n\n` +
      `સીધો પ્રશ્ન પૂછો અથવા નીચે આપેલા બટન દબાવીને ત્વરિત સેવા પસંદ કરો:\n\n` +
      `1. 🔍 */verify [પ્રશ્ન]* — મતદાર યાદી દાવાની આંકડાકીય ચકાસણી\n` +
      `2. 📋 */forms* — ફોર્મ 6, 7, 8 અને 6A માર્ગદર્શિકા\n` +
      `3. ⛓️ */blockchain* — મતદાર યાદી બ્લોકચેન પુરાવો\n` +
      `4. 📊 */stats* — દિલ્હી વિધાનસભા મતદાર યાદી ઓડિટ આંકડા\n` +
      `5. 🌐 */language* — ભાષા બદલો (10 ભારતીય ભાષાઓ)\n` +
      `6. 🏛️ */portal* — સત્તાવાર વેબ પોર્ટલ લિંક\n\n` +
      `👇 *ત્વરિત સહાય માટે નીચે આપેલા બટન પર ટેપ કરો:*`,
    helpButtons: {
      verify: '🔍 ચકાસો',
      lang: '🌐 ભાષા બદલો',
      forms: '📋 ફોર્મ માર્ગદર્શિકા',
      blockchain: '⛓️ બ્લોકચેન પુરાવો',
      stats: '📊 આંકડા',
      portal: '🏛️ વેબ પોર્ટલ',
    },
    formsGuide:
      `📋 *ભારતનું ચૂંટણી પંચ — સત્તાવાર ફોર્મ માર્ગદર્શિકા*\n\n` +
      `• *ફોર્મ 6 (Form 6):* નવા મતદાર નોંધણી માટે (ઉંમર 18+). વર્ષમાં 4 તારીખો: 1 જાન્યુઆરી, 1 એપ્રિલ, 1 જુલાઈ, 1 ઑક્ટોબર.\n\n` +
      `• *ફોર્મ 7 (Form 7):* નામ રદ કરવા અથવા વાંધો રજૂ કરવા. કાયદેસર નોટિસ અને બીએલઓ સ્થળ તપાસ ફરજિયાત છે.\n\n` +
      `• *ફોર્મ 8 (Form 8):* સરનામું બદલવા, વિગતો સુધારવા અને નવું ચૂંટણી કાર્ડ મેળવવા.\n\n` +
      `• *ફોર્મ 6A (Form 6A):* પ્રવાસી ભારતીય (NRI) મતદાર નોંધણી માટે (પાસપોર્ટ જરૂરી).\n\n` +
      `🔗 *ઓનલાઈન પોર્ટલ:* https://voters.eci.gov.in`,
    blockchainSeal:
      `⛓️ *મતદાર યાદી બ્લોકચેન અખંડિતતા રજિસ્ટર (Blockchain Seal)*\n\n` +
      `બિનઅધિકૃત ફેરફારો રોકવા માટે સમગ્ર મતદાર યાદી **Polygon Amoy** બ્લોકચેન પર સુરક્ષિત સીલ કરવામાં આવી છે.\n\n` +
      `📌 *નેટવર્ક:* Polygon Amoy (Chain ID: 80002)\n` +
      `📌 *સ્માર્ટ કોન્ટ્રાક્ટ:* \`0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B\`\n` +
      `📌 *માસ્ટર મર્કલ રૂટ:* \`0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f\`\n` +
      `📌 *ઓડિટ થયેલા મતદારો:* 15,308 (AC 6, 13, 44, 58)\n` +
      `📌 *સ્થિતિ:* 🔒 અપરિવર્તનીય અને પ્રમાણિત (Tamper-Proof)\n\n` +
      `🔗 *બ્લોક એક્સપ્લોરર:* https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B`,
    statsGuide:
      `📊 *દિલ્હી વિધાનસભા મતદાર યાદી ઓડિટ આંકડા (Roll Statistics)*\n\n` +
      `• *કુલ ઓડિટ થયેલા મતદારો:* 15,308\n` +
      `• *મતદાન મથકો:* 23 બૂથ\n` +
      `• *વિધાનસભા મતવિસ્તારો:* AC 6 (રિઠાલા), AC 13 (રોહિણી), AC 44 (આર.કે. પુરમ), AC 58 (લક્ષ્મી નગર)\n` +
      `• *ચિહ્નિત વિસંગતતાઓ:* 49 ફ્લેગ્સ\n` +
      `• *રિકોલ દર:* 100% (40/40 કેસ પકડાયા)\n` +
      `• *ખોટી રીતે કમી કરવાનો દર:* 0.0%\n\n` +
      `🔗 *સંપૂર્ણ ઓડિટ ડેશબોર્ડ:* https://voter-mitra-hack.vercel.app/dashboard`,
    verifyPrompt:
      `🔍 *મતદાર યાદી દાવા ચકાસણી (Verify Roll Claim)*\n\n` +
      `કૃપા કરીને તમારો પ્રશ્ન કે દાવો લખીને અથવા બોલીને મોકલો:\n\n` +
      `📌 દા.ત: *"ભાગ 4 માં 49 મહિલા મતદારો કમી થયા છે?"*\n` +
      `📌 દા.ત: *"પ્લોટ 12-B માં કેટલા મતદારો નોંધાયેલા છે?"*\n` +
      `📌 દા.ત: *"ચૂંટણી કાર્ડ ન હોય તો મતદાન કેવી રીતે કરવું?"*\n\n` +
      `હું તમને સચોટ આંકડાકીય પુરાવા અને **Gnani AI વૉઇસ નોટ** સાથે જવાબ આપીશ!`,
    portalPrompt:
      `🏛️ *VoterMitra સત્તાવાર વેબ પોર્ટલ*\n\n` +
      `લાઈવ ચકાસણી, Z-સ્કોર આંકડા અને બીએલઓ સ્થળ તપાસ કતાર જોવા માટે મુલાકાત લો:\n\n` +
      `🔗 https://voter-mitra-hack.vercel.app`,
    langConfirmation: (label, voice) =>
      `✅ *ભાષા સફળતાપૂર્વક પસંદ કરવામાં આવી: ${label}*\n` +
      `🎙️ *Gnani AI Voice Model:* ${voice} (timbre-v2.5)\n\n` +
      `હવે તમે ચૂંટણી યાદી કે પ્રક્રિયા અંગે કોઈ પણ પ્રશ્ન પૂછી શકો છો.\n` +
      `મેનુ જોવા માટે /help મોકલો.`,
    greetingVoiceNote:
      `મતદાર મિત્રમાં આપનું સ્વાગત છે. સત્તાવાર ભાષા ગુજરાતી પસંદ કરવામાં આવી છે. આપ મતદાર યાદી ચકાસણી કે ચૂંટણી પ્રક્રિયાના પ્રશ્નો પૂછી શકો છો.`,
    queryLabels: {
      verdicts: {
        VERIFIED: 'પ્રમાણિત · VERIFIED (સત્તાવાર રેકોર્ડ દ્વારા સાબિત)',
        DISPUTED: 'વિવાદિત · DISPUTED (સત્તાવાર રેકોર્ડ મુજબ અયોગ્ય)',
        GUIDANCE: 'સત્તાવાર ચૂંટણી માર્ગદર્શિકા · OFFICIAL GUIDANCE',
      },
      confidence: {
        HIGH: 'ઉચ્ચ વિશ્વસનીયતા (High Confidence)',
        MEDIUM: 'મધ્યમ વિશ્વસનીયતા (Moderate Confidence)',
      },
      evidenceHeader: 'આંકડાકીય પુરાવા અને કાનૂની આધાર:',
      blockchainSeal: 'બ્લોકચેન સીલ (Polygon Amoy):',
      portalLink: 'સત્તાવાર વેબ પોર્ટલ:',
      footerHint: 'ભાષા બદલવા માટે /language મોકલો | મેનુ માટે /help',
    },
    fallbacks: {
      plot: {
        verdict: 'VERIFIED',
        summary: `સરનામાં ગીચતા ઓડિટ: 'Plot 12-B, Basement' પર કુલ 43 મતદારો નોંધાયેલા છે (અટક વિવિધતા: 48%). આ સામાન્ય મર્યાદાથી વધુ હોવાથી બીએલઓ સ્થળ ચકાસણી માટે ફ્લેગ કરેલ છે.`,
        spokenSummary: `Plot 12-B પર 43 મતદારો નોંધાયેલા છે અને હોસ્ટેલ તપાસ માટે ચિહ્નિત છે.`,
        reasoning: ['ઊંચી મતદાર ગીચતા ચિહ્નિત', 'સંભવિત કારણ: વિદ્યાર્થી હોસ્ટેલ / પીજી'],
      },
      part4: {
        verdict: 'VERIFIED',
        summary: `મતદાર યાદી ઓડિટ: ભાગ 4 માં 49 યુવા મહિલા મતદારોને કમી કરવાની શ્રેણીમાં દર્શાવવામાં આવ્યા છે (Z-Score: +4.9 sigma). આ અસાધારણ ફેરફારની બીએલઓ દ્વારા તપાસ ચાલી રહી છે.`,
        spokenSummary: `ભાગ 4 માં 49 મહિલા મતદારોના નામ કમી થવા અંગે બીએલઓ તપાસ ચાલી રહી છે.`,
        reasoning: ['ડ્રાફ્ટ વિ આખરી યાદી: 680 માંથી 49 કમી', 'લગ્ન બાદ સ્થળાંતર અથવા હોસ્ટેલ બદલાવ'],
      },
      general: {
        verdict: 'GUIDANCE',
        summary: `ચૂંટણી પંચના નિયમો મુજબ નવા મતદાર માટે ફોર્મ 6, નામ કમી માટે ફોર્મ 7, અને સરનામું સુધારવા ફોર્મ 8 ભરો. ચૂંટણી કાર્ડ ન હોય તો પણ યાદીમાં નામ હોય તો 12 માન્ય પુરાવા દ્વારા મતદાન થઈ શકે છે.`,
        spokenSummary: `નવા નોંધણી માટે ફોર્મ 6, કમી માટે ફોર્મ 7 અને સુધારા માટે ફોર્મ 8 વાપરો.`,
        reasoning: ['મતદાર નોંધણી નિયમો 1960', '15,308 મતદારોનું ઓડિટ પ્રમાણિત'],
      },
    },
    voiceReceived:
      `🎙️ *વૉઇસ સંદેશ મળ્યો (Voice Note Received)*\n\n` +
      `ઓડિયો તપાસાઈ રહ્યો છે. તમે તમારો પ્રશ્ન લખીને પણ પૂછી શકો છો:\n\n` +
      `📌 દા.ત: *"ફોર્મ 6 કેવી રીતે ભરવું?"*\n` +
      `📌 દા.ત: *"ભાગ 4 માં 49 મહિલાઓ કમી થઈ છે?"*\n\n` +
      `હું તમને તુરંત પુરાવા અને Gnani AI વૉઇસ નોટ સાથે જવાબ આપીશ!`,
        youAsked: 'તમારો પ્રશ્ન',
    voiceInaudible:
      `🎙️ *અવાજ સ્પષ્ટ સંભળાયો નથી*\n\nકૃપા કરીને માઈકની નજીક બોલો અથવા લખીને પૂછો:\n\n📌 દા.ત: *"ફોર્મ 6 કેવી રીતે ભરવું?"*\n📌 દા.ત: *"ભાગ 4 માં 49 મહિલા મતદારો કમી થયા છે?"*`,
actionPrompts: {
      verify: `🔍 *પ્રશ્ન કે દાવો પૂછો:*\nસીધા ચેટમાં તમારો પ્રશ્ન લખો અથવા બોલો (દા.ત: *"ભાગ 4 માં 49 મહિલાઓ કમી થઈ છે?"*).`,
      lang: `🌐 *તમારી પસંદગીની ભાષા પસંદ કરો:*`,
    },
  },

  'kn-IN': {
    name: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    startWelcome: (name) =>
      `🇮🇳 *ಭಾರತೀಯ ಚುನಾವಣಾ ಆಯೋಗ | ELECTION COMMISSION OF INDIA*\n` +
      `*ಮತದಾರ ಮಿತ್ರ (VoterMitra) — AI ಮತದಾರರ ಪಟ್ಟಿ ಪರಿಶೀಲನಾ ಬಾಟ್*\n\n` +
      `ನಮಸ್ಕಾರ ${name || ''}! ನಾನು **VoterMitra**.\n` +
      `ನೀವು ಮತದಾರರ ಪಟ್ಟಿ, ಹೆಸರು ತೆಗೆದುಹಾಕುವಿಕೆ, ಫಾರ್ಮ್‌ಗಳು (6, 7, 8) ಅಥವಾ ಚುನಾವಣಾ ಪ್ರಕ್ರಿಯೆಯ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.\n\n` +
      `📌 *ಆಜ್ಞೆಗಳನ್ನು ನೋಡಲು /help ಕಳುಹಿಸಿ ಅಥವಾ ಎಡಭಾಗದಲ್ಲಿರುವ "≡ Menu" ಬಟನ್ ಬಳಸಿ.*\n\n` +
      `🌐 *ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:*`,
    helpMenu:
      `ℹ️ *VoterMitra ಸಂಪೂರ್ಣ ಸಹಾಯ ಮೆನು (Help Dashboard)*\n\n` +
      `ಚಾಟ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಕೆಳಗಿನ ಬಟನ್‌ಗಳನ್ನು ಒತ್ತಿರಿ:\n\n` +
      `1. 🔍 */verify [ಪ್ರಶ್ನೆ]* — ಮತದಾರರ ಪಟ್ಟಿ ದೂರುಗಳ ಸಂಖ್ಯಾಶಾಸ್ತ್ರೀಯ ಪರಿಶೀಲನೆ\n` +
      `2. 📋 */forms* — ಫಾರ್ಮ್ 6, 7, 8 ಮತ್ತು 6A ಅಧಿಕೃತ ಮಾರ್ಗದರ್ಶಿ\n` +
      `3. ⛓️ */blockchain* — ಬ್ಲಾಕ್‌ಚೈನ್ ಮತದಾರರ ಪಟ್ಟಿ ದಾಖಲೆ\n` +
      `4. 📊 */stats* — ದೆಹಲಿ ವಿಧಾನಸಭಾ ಮತದಾರರ ಪಟ್ಟಿ ಆಡಿಟ್ ಅಂಕಿಅಂಶಗಳು\n` +
      `5. 🌐 */language* — ಭಾಷೆ ಬದಲಾಯಿಸಿ (10 ಭಾರತೀಯ ಭಾಷೆಗಳು)\n` +
      `6. 🏛️ */portal* — ಅಧಿಕೃತ ವೆಬ್ ಪೋರ್ಟಲ್ ಲಿಂಕ್\n\n` +
      `👇 *ತ್ವರಿತ ಸಹಾಯಕ್ಕಾಗಿ ಕೆಳಗಿನ ಬಟನ್ ಟ್ಯಾಪ್ ಮಾಡಿ:*`,
    helpButtons: {
      verify: '🔍 ಪರಿಶೀಲಿಸಿ',
      lang: '🌐 ಭಾಷೆ ಬದಲಾಯಿಸಿ',
      forms: '📋 ಫಾರ್ಮ್‌ಗಳು',
      blockchain: '⛓️ ಬ್ಲಾಕ್‌ಚೈನ್ ಪುರಾವೆ',
      stats: '📊 ಅಂಕಿಅಂಶಗಳು',
      portal: '🏛️ ವೆಬ್ ಪೋರ್ಟಲ್',
    },
    formsGuide:
      `📋 *ಭಾರತೀಯ ಚುನಾವಣಾ ಆಯೋಗ — ಅಧಿಕೃತ ಫಾರ್ಮ್‌ಗಳ ಮಾರ್ಗದರ್ಶಿ*\n\n` +
      `• *ಫಾರ್ಮ್ 6 (Form 6):* ಹೊಸ ಮತದಾರರ ನೋಂದಣಿಗೆ (ವಯಸ್ಸು 18+). ವರ್ಷದಲ್ಲಿ 4 ಅರ್ಹತಾ ದಿನಾಂಕಗಳು: ಜನವರಿ 1, ಏಪ್ರಿಲ್ 1, ಜುಲೈ 1, ಅಕ್ಟೋಬರ್ 1.\n\n` +
      `• *ಫಾರ್ಮ್ 7 (Form 7):* ಹೆಸರು ತೆಗೆದುಹಾಕಲು ಅಥವಾ ಆಕ್ಷೇಪಣೆ ಸಲ್ಲಿಸಲು. ಕಾನೂನುಬದ್ಧ ನೋಟಿಸ್ ಮತ್ತು ಬಿಎಲ್‌ಒ ಸ್ಥಳ ಪರಿಶೀಲನೆ ಕಡ್ಡಾಯ.\n\n` +
      `• *ಫಾರ್ಮ್ 8 (Form 8):* ವಿಳಾಸ ಬದಲಾವಣೆ, ವಿವರಗಳ ತಿದ್ದುಪಡಿ ಮತ್ತು ಹೊಸ ವೋಟರ್ ಐಡಿ ಪಡೆಯಲು.\n\n` +
      `• *ಫಾರ್ಮ್ 6A (Form 6A):* ಅನಿವಾಸಿ ಭಾರತೀಯ (NRI) ಮತದಾರರ ನೋಂದಣಿಗೆ (ಪಾಸ್‌ಪೋರ್ಟ್ ಅಗತ್ಯ).\n\n` +
      `🔗 *ಆನ್‌ಲೈನ್ ಪೋರ್ಟಲ್:* https://voters.eci.gov.in`,
    blockchainSeal:
      `⛓️ *ಮತದಾರರ ಪಟ್ಟಿ ಬ್ಲಾಕ್‌ಚೈನ್ ಸಮಗ್ರತೆ ರಿಜಿಸ್ಟರ್ (Blockchain Seal)*\n\n` +
      `ಅನಧಿಕೃತ ಬದಲಾವಣೆಗಳನ್ನು ತಡೆಯಲು ಸಂಪೂರ್ಣ ಮತದಾರರ ಪಟ್ಟಿಯನ್ನು **Polygon Amoy** ಬ್ಲಾಕ್‌ಚೈನ್‌ನಲ್ಲಿ ಮುದ್ರಿಸಲಾಗಿದೆ.\n\n` +
      `📌 *ನೆಟ್‌ವರ್ಕ್:* Polygon Amoy (Chain ID: 80002)\n` +
      `📌 *ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದ:* \`0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B\`\n` +
      `📌 *ಮಾಸ್ಟರ್ ಮೆರ್ಕಲ್ ರೂಟ್:* \`0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f\`\n` +
      `📌 *ಪರಿಶೀಲಿಸಿದ ಮತದಾರರು:* 15,308 (AC 6, 13, 44, 58)\n` +
      `📌 *ಸ್ಥಿತಿ:* 🔒 ಬದಲಾಯಿಸಲಾಗದು & ದೃಢೀಕರಿಸಲಾಗಿದೆ (Tamper-Proof)\n\n` +
      `🔗 *ಬ್ಲಾಕ್ ಎಕ್ಸ್‌ಪ್ಲೋರರ್:* https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B`,
    statsGuide:
      `📊 *ದೆಹಲಿ ವಿಧಾನಸಭಾ ಮತದಾರರ ಪಟ್ಟಿ ಆಡಿಟ್ ಅಂಕಿಅಂಶಗಳು (Roll Statistics)*\n\n` +
      `• *ಒಟ್ಟು ಪರಿಶೀಲಿಸಿದ ಮತದಾರರು:* 15,308\n` +
      `• *ಮತಗಟ್ಟೆಗಳು:* 23 ಬೂತ್‌ಗಳು\n` +
      `• *ಕ್ಷೇತ್ರಗಳು:* AC 6 (ರಿಥಾಲಾ), AC 13 (ರೋಹಿಣಿ), AC 44 (ಆರ್.ಕೆ. ಪುರಂ), AC 58 (ಲಕ್ಷ್ಮಿ ನಗರ)\n` +
      `• *ಪತ್ತೆಯಾದ ಅಸಂಗತತೆಗಳು:* 49 ಫ್ಲ್ಯಾಗ್‌ಗಳು\n` +
      `• *ನಿಖರತೆ (Recall):* 100% (40/40 ಪತ್ತೆಯಾಗಿದೆ)\n` +
      `• *ತಪ್ಪಾಗಿ ತೆಗೆದುಹಾಕಿದ ದರ:* 0.0%\n\n` +
      `🔗 *ಸಂಪೂರ್ಣ ಆಡಿಟ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್:* https://voter-mitra-hack.vercel.app/dashboard`,
    verifyPrompt:
      `🔍 *ಮತದಾರರ ಪಟ್ಟಿ ದೂರು ಪರಿಶೀಲನೆ (Verify Roll Claim)*\n\n` +
      `ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅಥವಾ ದೂರನ್ನು ಬರೆದು ಅಥವಾ ಧ್ವನಿ ಮೂಲಕ ಕಳುಹಿಸಿ:\n\n` +
      `📌 ಉದಾ: *"ಭಾಗ 4 ರಲ್ಲಿ 49 ಮಹಿಳಾ ಮತದಾರರನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆಯೇ?"*\n` +
      `📌 ಉದಾ: *"ಪ್ಲಾಟ್ 12-B ಯಲ್ಲಿ ಎಷ್ಟು ಮತದಾರರಿದ್ದಾರೆ?"*\n` +
      `📌 ಉದಾ: *"ವೋಟರ್ ಐಡಿ ಇಲ್ಲದೆ ಮತ ಚಲಾಯಿಸುವುದು ಹೇಗೆ?"*\n\n` +
      `ನಾನು ನಿಮಗೆ ಅಧಿಕೃತ ಪುರಾವೆ ಮತ್ತು **Gnani AI ಧ್ವನಿ ಸಂದೇಶ**ದೊಂದಿಗೆ ಉತ್ತರಿಸುತ್ತೇನೆ!`,
    portalPrompt:
      `🏛️ *VoterMitra ಅಧಿಕೃತ ವೆಬ್ ಪೋರ್ಟಲ್*\n\n` +
      `ಲೈವ್ ಪರಿಶೀಲನೆ, Z-ಸ್ಕೋರ್ ಅಂಕಿಅಂಶಗಳು ಮತ್ತು ಬಿಎಲ್‌ಒ ತಪಾಸಣೆ ವೀಕ್ಷಿಸಲು ಭೇಟಿ ನೀಡಿ:\n\n` +
      `🔗 https://voter-mitra-hack.vercel.app`,
    langConfirmation: (label, voice) =>
      `✅ *ಭಾಷೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ: ${label}*\n` +
      `🎙️ *Gnani AI Voice Model:* ${voice} (timbre-v2.5)\n\n` +
      `ಈಗ ನೀವು ಚುನಾವಣಾ ಪಟ್ಟಿ ಅಥವಾ ಪ್ರಕ್ರಿಯೆಯ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.\n` +
      `ಮೆನು ನೋಡಲು /help ಕಳುಹಿಸಿ.`,
    greetingVoiceNote:
      `ಮತದಾರ ಮಿತ್ರಕ್ಕೆ ಸುಸ್ವಾಗತ. ಅಧಿಕೃತ ಭಾಷೆಯಾಗಿ ಕನ್ನಡವನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ನೀವು ಚುನಾವಣಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು.`,
    queryLabels: {
      verdicts: {
        VERIFIED: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ · VERIFIED (ಅಧಿಕೃತ ದಾಖಲೆಯಂತೆ ಸಾಬೀತಾಗಿದೆ)',
        DISPUTED: 'ವಿವಾದಿತ · DISPUTED (ಅಧಿಕೃತ ದಾಖಲೆಗೆ ವಿರುದ್ಧವಾಗಿದೆ)',
        GUIDANCE: 'ಅಧಿಕೃತ ಚುನಾವಣಾ ಮಾರ್ಗದರ್ಶನ · OFFICIAL GUIDANCE',
      },
      confidence: {
        HIGH: 'ಹೆಚ್ಚಿನ ವಿಶ್ವಾಸಾರ್ಹತೆ (High Confidence)',
        MEDIUM: 'ಮಧ್ಯಮ ವಿಶ್ವಾಸಾರ್ಹತೆ (Moderate Confidence)',
      },
      evidenceHeader: 'ಸಂಖ್ಯಾಶಾಸ್ತ್ರೀಯ ಪುರಾವೆಗಳು ಮತ್ತು ಕಾನೂನು ಆಧಾರ:',
      blockchainSeal: 'ಬ್ಲಾಕ್‌ಚೈನ್ ಮುದ್ರೆ (Polygon Amoy):',
      portalLink: 'ಅಧಿಕೃತ ವೆಬ್ ಪೋರ್ಟಲ್:',
      footerHint: 'ಭಾಷೆ ಬದಲಾಯಿಸಲು /language ಕಳುಹಿಸಿ | ಮೆನುಗಾಗಿ /help',
    },
    fallbacks: {
      plot: {
        verdict: 'VERIFIED',
        summary: `ವಿಳಾಸ ಸಾಂದ್ರತೆಯ ಆಡಿಟ್: 'Plot 12-B, Basement' ನಲ್ಲಿ ಒಟ್ಟು 43 ಮತದಾರರು ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದ್ದಾರೆ (ಉಪನಾಮ ವೈವಿಧ್ಯ: 48%). ಇದು ಸಾಮಾನ್ಯ ಮಿತಿಗಿಂತ ಹೆಚ್ಚಾಗಿದ್ದು, ಬಿಎಲ್‌ಒ ಸ್ಥಳ ಪರಿಶೀಲನೆಗೆ ಗುರುತಿಸಲಾಗಿದೆ.`,
        spokenSummary: `Plot 12-B ನಲ್ಲಿ 43 ಮತದಾರರು ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದ್ದು, ಹಾಸ್ಟೆಲ್ ತಪಾಸಣೆಗೆ ಗುರುತಿಸಲಾಗಿದೆ.`,
        reasoning: ['ಹೆಚ್ಚಿನ ಮತದಾರರ ಸಾಂದ್ರತೆ', 'ಸಂಭಾವ್ಯ ಕಾರಣ: ವಿದ್ಯಾರ್ಥಿ ನಿಲಯ / ಪಿಜಿ'],
      },
      part4: {
        verdict: 'VERIFIED',
        summary: `ಮತದಾರರ ಪಟ್ಟಿ ಆಡಿಟ್: ಭಾಗ 4 ರಲ್ಲಿ 49 ಯುವ ಮಹಿಳಾ ಮತದಾರರನ್ನು ತೆಗೆದುಹಾಕುವ ವರ್ಗದಲ್ಲಿ ಗುರುತಿಸಲಾಗಿದೆ (Z-Score: +4.9 sigma). ಈ ಅಸಹಜ ಬದಲಾವಣೆಯನ್ನು ಬಿಎಲ್‌ಒ ತನಿಖೆ ಮಾಡುತ್ತಿದ್ದಾರೆ.`,
        spokenSummary: `ಭಾಗ 4 ರಲ್ಲಿ 49 ಮಹಿಳಾ ಮತದಾರರನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿರುವುದನ್ನು ಬಿಎಲ್‌ಒ ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ.`,
        reasoning: ['ಕರಡು ಮತ್ತು ಅಂತಿಮ ಪಟ್ಟಿ: 680 ರಲ್ಲಿ 49 ಹೆಸರು ತೆಗೆದುಹಾಕಲಾಗಿದೆ', 'ವಿವಾಹದ ನಂತರದ ಸ್ಥಳಾಂತರ ಅಥವಾ ಹಾಸ್ಟೆಲ್ ಬದಲಾವಣೆ'],
      },
      general: {
        verdict: 'GUIDANCE',
        summary: `ಚುನಾವಣಾ ಆಯೋಗದ ನಿಯಮಗಳ ಪ್ರಕಾರ ಹೊಸ ನೋಂದಣಿಗೆ ಫಾರ್ಮ್ 6, ತೆಗೆದುಹಾಕಲು ಫಾರ್ಮ್ 7, ಮತ್ತು ವಿಳಾಸ ಬದಲಾವಣೆಗೆ ಫಾರ್ಮ್ 8 ಬಳಸಿ. ವೋಟರ್ ಐಡಿ ಇಲ್ಲದಿದ್ದರೂ ಪಟ್ಟಿಯಲ್ಲಿ ಹೆಸರಿದ್ದರೆ 12 ಮಾನ್ಯ ಗುರುತಿನ ಚೀಟಿಗಳ ಮೂಲಕ ಮತ ಚಲಾಯಿಸಬಹುದು.`,
        spokenSummary: `ಹೊಸ ನೋಂದಣಿಗೆ ಫಾರ್ಮ್ 6, ತೆಗೆಯಲು ಫಾರ್ಮ್ 7 ಮತ್ತು ತಿದ್ದುಪಡಿಗೆ ಫಾರ್ಮ್ 8 ಬಳಸಿ.`,
        reasoning: ['ಮತದಾರರ ನೋಂದಣಿ ನಿಯಮಗಳು 1960', '15,308 ಮತದಾರರ ಆಡಿಟ್ ಪೂರ್ಣಗೊಂಡಿದೆ'],
      },
    },
    voiceReceived:
      `🎙️ *ಧ್ವನಿ ಸಂದೇಶ ಸ್ವೀಕರಿಸಲಾಗಿದೆ (Voice Note Received)*\n\n` +
      `ಆಡಿಯೋ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ. ನೀವು ಪಠ್ಯದ ಮೂಲಕವೂ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು:\n\n` +
      `📌 ಉದಾ: *"ಫಾರ್ಮ್ 6 ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?"*\n` +
      `📌 ಉದಾ: *"ಭಾಗ 4 ರಲ್ಲಿ 49 ಮಹಿಳೆಯರನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆಯೇ?"*\n\n` +
      `ನಾನು ನಿಮಗೆ ತಕ್ಷಣವೇ ಪುರಾವೆಯೊಂದಿಗೆ Gnani AI ಧ್ವನಿ ಸಂದೇಶದಲ್ಲಿ ಉತ್ತರಿಸುತ್ತೇನೆ!`,
        youAsked: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ',
    voiceInaudible:
      `🎙️ *ಧ್ವನಿ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ*\n\nದಯವಿಟ್ಟು ಮೈಕ್ ಹತ್ತಿರ ಮಾತನಾಡಿ ಮತ್ತೆ ಕಳುಹಿಸಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ:\n\n📌 ಉದಾ: *"ಫಾರ್ಮ್ 6 ಹೇಗೆ ಸಲ್ಲಿಸುವುದು?"*\n📌 ಉದಾ: *"ಭಾಗ 4 ರಲ್ಲಿ 49 ಮಹಿಳೆಯರನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆಯೇ?"*`,
actionPrompts: {
      verify: `🔍 *ಪ್ರಶ್ನೆ ಅಥವಾ ದೂರು ಕೇಳಿ:*\nನೇರವಾಗಿ ಚಾಟ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ (ಉದಾ: *"ಭಾಗ 4 ರಲ್ಲಿ 49 ಮಹಿಳೆಯರನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆಯೇ?"*).`,
      lang: `🌐 *ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:*`,
    },
  },

  'ml-IN': {
    name: 'മലയാളം',
    englishName: 'Malayalam',
    startWelcome: (name) =>
      `🇮🇳 *ഇന്ത്യൻ തിരഞ്ഞെടുപ്പ് കമ്മീഷൻ | ELECTION COMMISSION OF INDIA*\n` +
      `*വോട്ടർ മിത്ര (VoterMitra) — AI വോട്ടർ പട്ടിക പരിശോധനാ ബോട്ട്*\n\n` +
      `നമസ്കാരം ${name || ''}! ഞാൻ **VoterMitra** ആണ്.\n` +
      `വോട്ടർ പട്ടിക, പേരുകൾ ഒഴിവാക്കൽ, ഫോമുകൾ (6, 7, 8) അല്ലെങ്കിൽ തിരഞ്ഞെടുപ്പ് പ്രക്രിയയെക്കുറിച്ച് ചോദിക്കാം.\n\n` +
      `📌 *കമാൻഡുകൾ കാണാൻ /help അയക്കുക അല്ലെങ്കിൽ താഴെ ഇടത് വശത്തുള്ള "≡ Menu" ബട്ടൺ ഉപയോഗിക്കുക.*\n\n` +
      `🌐 *ദയവായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക:*`,
    helpMenu:
      `ℹ️ *VoterMitra സമ്പൂർണ്ണ സഹായ മെനു (Help Dashboard)*\n\n` +
      `നേരിട്ട് ചോദ്യങ്ങൾ ചോദിക്കുക അല്ലെങ്കിൽ താഴെയുള്ള ബട്ടണുകൾ ഉപയോഗിക്കുക:\n\n` +
      `1. 🔍 */verify [ചോദ്യം]* — വോട്ടർ പട്ടിക സംശയങ്ങളുടെ സ്ഥിതിവിവരക്കണക്ക് പരിശോധന\n` +
      `2. 📋 */forms* — ഫോം 6, 7, 8, 6A ഔദ്യോഗിക വിവരങ്ങൾ\n` +
      `3. ⛓️ */blockchain* — ബ്ലോക്ക്ചെയിൻ വോട്ടർ പട്ടിക തെളിവ്\n` +
      `4. 📊 */stats* — ഡൽഹി അസംബ്ലി വോട്ടർ പട്ടിക ഓഡിറ്റ് വിവരങ്ങൾ\n` +
      `5. 🌐 */language* — ഭാഷ മാറ്റുക (10 ഇന്ത്യൻ ഭാഷകൾ)\n` +
      `6. 🏛️ */portal* — ഔദ്യോഗിക വെബ് പോർട്ടൽ ലിങ്ക്\n\n` +
      `👇 *ഉടൻ സഹായം ലഭിക്കാൻ താഴെയുള്ള ബട്ടൺ അമർത്തുക:*`,
    helpButtons: {
      verify: '🔍 പരിശോധിക്കുക',
      lang: '🌐 ഭാഷ മാറ്റുക',
      forms: '📋 ഫോമുകൾ',
      blockchain: '⛓️ ബ്ലോക്ക്ചെയിൻ തെളിവ്',
      stats: '📊 സ്ഥിതിവിവരക്കണക്കുകൾ',
      portal: '🏛️ വെബ് പോർട്ടൽ',
    },
    formsGuide:
      `📋 *ഇന്ത്യൻ തിരഞ്ഞെടുപ്പ് കമ്മീഷൻ — ഔദ്യോഗിക ഫോമുകൾ ഗൈഡ്*\n\n` +
      `• *ഫോം 6 (Form 6):* പുതിയ വോട്ടർ രജിസ്ട്രേഷന് (പ്രായം 18+). വർഷത്തിൽ 4 യോഗ്യതാ തീയതികൾ: ജനുവരി 1, ഏപ്രിൽ 1, ജൂലൈ 1, ഒക്ടോബർ 1.\n\n` +
      `• *ഫോം 7 (Form 7):* പേര് ഒഴിവാക്കാനോ ആക്ഷേപം ഉന്നയിക്കാനോ. നിയമപരമായ നോട്ടീസും ബിഎൽഒ ഫീൽഡ് ഹിയറിംഗും നിർബന്ധമാണ്.\n\n` +
      `• *ഫോം 8 (Form 8):* വിലാസം മാറ്റൽ, തിരുത്തലുകൾ, പുതിയ വോട്ടർ ഐഡി കാർഡ് എന്നിവയ്ക്ക്.\n\n` +
      `• *ഫോം 6A (Form 6A):* പ്രവാസി ഭാരതീയ (NRI) വോട്ടർ രജിസ്ട്രേഷന് (പാസ്പോർട്ട് നിർബന്ധം).\n\n` +
      `🔗 *ഓൺലൈൻ പോർട്ടൽ:* https://voters.eci.gov.in`,
    blockchainSeal:
      `⛓️ *വോട്ടർ പട്ടിക ബ്ലോക്ക്ചെയിൻ സുരക്ഷാ രജിസ്റ്റർ (Blockchain Seal)*\n\n` +
      `അനധികൃത മാറ്റങ്ങൾ തടയാൻ മുഴുവൻ വോട്ടർ പട്ടികയും **Polygon Amoy** ബ്ലോക്ക്ചെയിനിൽ രേഖപ്പെടുത്തിയിട്ടുണ്ട്.\n\n` +
      `📌 *നെറ്റ്‌വർക്ക്:* Polygon Amoy (Chain ID: 80002)\n` +
      `📌 *സ്മാർട്ട് കരാർ:* \`0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B\`\n` +
      `📌 *മാസ്റ്റർ മെർക്കിൾ റൂട്ട്:* \`0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f\`\n` +
      `📌 *പരിശോധിച്ച വോട്ടർമാർ:* 15,308 (AC 6, 13, 44, 58)\n` +
      `📌 *നില:* 🔒 മാറ്റമില്ലാത്തതും സ്ഥിരീകരിച്ചതും (Tamper-Proof)\n\n` +
      `🔗 *ബ്ലോക്ക് എക്സ്പ്ലോറർ:* https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B`,
    statsGuide:
      `📊 *ഡൽഹി നിയമസഭാ വോട്ടർ പട്ടിക ഓഡിറ്റ് വിവരങ്ങൾ (Roll Statistics)*\n\n` +
      `• *ആകെ പരിശോധിച്ച വോട്ടർമാർ:* 15,308\n` +
      `• *പോളിംഗ് ബൂത്തുകൾ:* 23 ബൂത്തുകൾ\n` +
      `• *നിയോജകമണ്ഡലങ്ങൾ:* AC 6 (രിതാല), AC 13 (രോഹിണി), AC 44 (ആർ.കെ. പുരം), AC 58 (ലക്ഷ്മി നഗർ)\n` +
      `• *കണ്ടെത്തിയ പൊരുത്തക്കേടുകൾ:* 49 ഫ്ലാഗുകൾ\n` +
      `• *കൃത്യത (Recall):* 100% (40/40 കേസുകൾ കണ്ടെത്തി)\n` +
      `• *തെറ്റായ ഒഴിവാക്കൽ നിരക്ക്:* 0.0%\n\n` +
      `🔗 *പൂർണ്ണ ഓഡിറ്റ് ഡാഷ്‌ബോർഡ്:* https://voter-mitra-hack.vercel.app/dashboard`,
    verifyPrompt:
      `🔍 *വോട്ടർ പട്ടിക അവകാശവാദ പരിശോധന (Verify Roll Claim)*\n\n` +
      `നിങ്ങളുടെ ചോദ്യം എഴുതിയോ ശബ്ദ സന്ദേശമായോ അയക്കുക:\n\n` +
      `📌 ഉദാ: *"പാർട്ട് 4 ൽ 49 സ്ത്രീ വോട്ടർമാരെ ഒഴിവാക്കിയോ?"*\n` +
      `📌 ഉദാ: *"പ്ലോട്ട് 12-B യിൽ എത്ര വോട്ടർമാരുണ്ട്?"*\n` +
      `📌 ഉദാ: *"വോട്ടർ ഐഡി ഇല്ലാതെ എങ്ങനെ വോട്ട് ചെയ്യാം?"*\n\n` +
      `ഞാൻ നിങ്ങൾക്ക് കൃത്യമായ വിവരങ്ങളും **Gnani AI ശബ്ദ സന്ദേശവും** നൽകും!`,
    portalPrompt:
      `🏛️ *VoterMitra ഔദ്യോഗിക വെബ് പോർട്ടൽ*\n\n` +
      `തത്സമയ പരിശോധന, Z-സ്കോർ കണക്കുകൾ, ബിഎൽഒ ഫീൽഡ് പരിശോധന എന്നിവ കാണാൻ പോർട്ടൽ സന്ദർശിക്കുക:\n\n` +
      `🔗 https://voter-mitra-hack.vercel.app`,
    langConfirmation: (label, voice) =>
      `✅ *ഭാഷ വിജയകരമായി തിരഞ്ഞെടുത്തു: ${label}*\n` +
      `🎙️ *Gnani AI Voice Model:* ${voice} (timbre-v2.5)\n\n` +
      `ഇനി തിരഞ്ഞെടുപ്പ് പട്ടികയെക്കുറിച്ചോ നടപടികളെക്കുറിച്ചോ ഏത് ചോദ്യവും ചോദിക്കാം.\n` +
      `മെനു കാണാൻ /help അയക്കുക.`,
    greetingVoiceNote:
      `വോട്ടർ മിത്രയിലേക്ക് സ്വാഗതം. ഔദ്യോഗിക ഭാഷ മലയാളമായി തിരഞ്ഞെടുത്തു. നിങ്ങൾക്ക് തിരഞ്ഞെടുപ്പ് സംശയങ്ങൾ ചോദിക്കാം.`,
    queryLabels: {
      verdicts: {
        VERIFIED: 'സ്ഥിരീകരിച്ചു · VERIFIED (ഔദ്യോഗിക രേഖകൾ പ്രകാരം ഉറപ്പിച്ചു)',
        DISPUTED: 'തർക്കവിഷയം · DISPUTED (ഔദ്യോഗിക രേഖകൾക്ക് വിരുദ്ധം)',
        GUIDANCE: 'ഔദ്യോഗിക തിരഞ്ഞെടുപ്പ് മാർഗ്ഗനിർദ്ദേശം · OFFICIAL GUIDANCE',
      },
      confidence: {
        HIGH: 'ഉയർന്ന വിശ്വാസ്യത (High Confidence)',
        MEDIUM: 'ഇടത്തരം വിശ്വാസ്യത (Moderate Confidence)',
      },
      evidenceHeader: 'സ്ഥിതിവിവര തെളിവുകളും നിയമപരമായ അടിസ്ഥാനവും:',
      blockchainSeal: 'ബ്ലോക്ക്ചെയിൻ സീൽ (Polygon Amoy):',
      portalLink: 'ഔദ്യോഗിക വെബ് പോർട്ടൽ:',
      footerHint: 'ഭാഷ മാറ്റാൻ /language അയക്കുക | മെനുവിന് /help',
    },
    fallbacks: {
      plot: {
        verdict: 'VERIFIED',
        summary: `വിലാസ സാന്ദ്രത ഓഡിറ്റ്: 'Plot 12-B, Basement' ൽ ആകെ 43 വോട്ടർമാർ രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട് (കുടുംബപ്പേര് വൈവിധ്യം: 48%). ഇത് സാധാരണ പരിധിയിൽ കൂടുതലായതിനാൽ ബിഎൽഒ ഫീൽഡ് പരിശോധനയ്ക്കായി അടയാളപ്പെടുത്തിയിരിക്കുന്നു.`,
        spokenSummary: `Plot 12-B ൽ 43 വോട്ടർമാരുണ്ട്, ഹോസ്റ്റൽ പരിശോധനയ്ക്കായി അടയാളപ്പെടുത്തി.`,
        reasoning: ['ഉയർന്ന വോട്ടർ സാന്ദ്രത', 'സാധ്യമായ കാരണം: വിദ്യാർത്ഥി ഹോസ്റ്റൽ / പി.ജി'],
      },
      part4: {
        verdict: 'VERIFIED',
        summary: `വോട്ടർ പട്ടിക ഓഡിറ്റ്: പാർട്ട് 4 ൽ 49 യുവതികളെ ഒഴിവാക്കൽ പട്ടികയിൽ കണ്ടെത്തി (Z-Score: +4.9 sigma). ഈ അസാധാരണ മാറ്റം ബിഎൽഒ അന്വേഷിക്കുകയാണ്.`,
        spokenSummary: `പാർട്ട് 4 ൽ 49 സ്ത്രീ വോട്ടർമാരെ ഒഴിവാക്കിയത് ബിഎൽഒ അന്വേഷിക്കുന്നു.`,
        reasoning: ['കരട് vs അന്തിമ പട്ടിക: 680 ൽ 49 ഒഴിവാക്കലുകൾ', 'വിവാഹ ശേഷമുള്ള താമസം മാറ്റം അല്ലെങ്കിൽ ഹോസ്റ്റൽ മാറ്റം'],
      },
      general: {
        verdict: 'GUIDANCE',
        summary: `തിരഞ്ഞെടുപ്പ് കമ്മീഷൻ ചട്ടങ്ങൾ പ്രകാരം പുതിയ രജിസ്ട്രേഷന് ഫോം 6, ഒഴിവാക്കലിന് ഫോം 7, വിലാസം മാറ്റലിന് ഫോം 8 എന്നിവ ഉപയോഗിക്കുക. വോട്ടർ ഐഡി ഇല്ലെങ്കിലും പട്ടികയിൽ പേരുണ്ടെങ്കിൽ അംഗീകൃത 12 തിരിച്ചറിയൽ രേഖകൾ ഉപയോഗിച്ച് വോട്ട് ചെയ്യാം.`,
        spokenSummary: `പുതിയതിന് ഫോം 6, ഒഴിവാക്കലിന് ഫോം 7, തിരുത്തലിന് ഫോം 8 ഉപയോഗിക്കുക.`,
        reasoning: ['വോട്ടർ രജിസ്ട്രേഷൻ ചട്ടങ്ങൾ 1960', '15,308 വോട്ടർമാരുടെ ഓഡിറ്റ് സ്ഥിരീകരിച്ചു'],
      },
    },
    voiceReceived:
      `🎙️ *ശബ്ദ സന്ദേശം ലഭിച്ചു (Voice Note Received)*\n\n` +
      `ഓഡിയോ പ്രോസസ്സ് ചെയ്യുകയാണ്. ടെക്സ്റ്റായും ചോദിക്കാവുന്നതാണ്:\n\n` +
      `📌 ഉദാ: *"ഫോം 6 എങ്ങനെ അപേക്ഷിക്കാം?"*\n` +
      `📌 ഉദാ: *"പാർട്ട് 4 ൽ 49 സ്ത്രീകളെ ഒഴിവാക്കിയോ?"*\n\n` +
      `ഉടൻ തന്നെ തെളിവുകളോടെ Gnani AI ശബ്ദ മറുപടി നൽകുന്നതാണ്!`,
        youAsked: 'നിങ്ങളുടെ ചോദ്യം',
    voiceInaudible:
      `🎙️ *ശബ്ദം വ്യക്തമായി കേട്ടില്ല*\n\nദയവായി മൈക്കിനടുത്ത് സംസാരിച്ച് വീണ്ടും അയക്കുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക:\n\n📌 ഉദാ: *"ഫോം 6 എങ്ങനെ അപേക്ഷിക്കാം?"*\n📌 ഉദാ: *"പാർട്ട് 4 ൽ 49 സ്ത്രീകളെ ഒഴിവാക്കിയോ?"*`,
actionPrompts: {
      verify: `🔍 *ചോദ്യം ചോദിക്കുക:*\nനേരിട്ട് ചാറ്റിൽ എഴുതുകയോ സംസാരിക്കുകയോ ചെയ്യുക (ഉദാ: *"പാർട്ട് 4 ൽ 49 സ്ത്രീകളെ ഒഴിവാക്കിയോ?"*).`,
      lang: `🌐 *നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക:*`,
    },
  },

  'pa-IN': {
    name: 'ਪੰਜਾਬੀ',
    englishName: 'Punjabi',
    startWelcome: (name) =>
      `🇮🇳 *ਭਾਰਤ ਚੋਣ ਕਮਿਸ਼ਨ | ELECTION COMMISSION OF INDIA*\n` +
      `*ਵੋਟਰ ਮਿੱਤਰ (VoterMitra) — AI ਵੋਟਰ ਸੂਚੀ ਪੜਤਾਲ ਬੋਟ*\n\n` +
      `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${name || ''}! ਮੈਂ **VoterMitra** ਹਾਂ।\n` +
      `ਤੁਸੀਂ ਮੈਨੂੰ ਵੋਟਰ ਸੂਚੀ, ਨਾਮ ਕੱਟਣ, ਫਾਰਮ (6, 7, 8) ਜਾਂ ਚੋਣ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।\n\n` +
      `📌 *ਕਮਾਂਡਾਂ ਦੀ ਸੂਚੀ ਲਈ /help ਭੇਜੋ ਜਾਂ ਖੱਬੇ ਪਾਸੇ "≡ Menu" ਬਟਨ ਵਰਤੋ।*\n\n` +
      `🌐 *ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ:*`,
    helpMenu:
      `ℹ️ *VoterMitra ਸੰਪੂਰਨ ਸਹਾਇਤਾ ਮੇਨੂ (Help Dashboard)*\n\n` +
      `ਸਿੱਧਾ ਸਵਾਲ ਪੁੱਛੋ ਜਾਂ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ:\n\n` +
      `1. 🔍 */verify [ਸਵਾਲ]* — ਵੋਟਰ ਸੂਚੀ ਦਾਅਵਿਆਂ ਦੀ ਅੰਕੜਾਤਮਕ ਪੜਤਾਲ\n` +
      `2. 📋 */forms* — ਫਾਰਮ 6, 7, 8 ਅਤੇ 6A ਬਾਰੇ ਪੂਰੀ ਜਾਣਕਾਰੀ\n` +
      `3. ⛓️ */blockchain* — ਵੋਟਰ ਸੂਚੀ ਦਾ ਬਲਾਕਚੈਨ ਪ੍ਰਮਾਣ\n` +
      `4. 📊 */stats* — ਦਿੱਲੀ ਵਿਧਾਨ ਸਭਾ ਵੋਟਰ ਸੂਚੀ ਆਡਿਟ ਅੰਕੜੇ\n` +
      `5. 🌐 */language* — ਭਾਸ਼ਾ ਬਦਲੋ (10 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ)\n` +
      `6. 🏛️ */portal* — ਅਧਿਕਾਰਤ ਵੈੱਬ ਪੋਰਟਲ ਲਿੰਕ\n\n` +
      `👇 *ਤੁਰੰਤ ਸਹਾਇਤਾ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ ਤੇ ਟੈਪ ਕਰੋ:*`,
    helpButtons: {
      verify: '🔍 ਪੜਤਾਲ ਕਰੋ',
      lang: '🌐 ਭਾਸ਼ਾ ਬਦਲੋ',
      forms: '📋 ਫਾਰਮ ਗਾਈਡ',
      blockchain: '⛓️ ਬਲਾਕਚੈਨ ਸਬੂਤ',
      stats: '📊 ਅੰਕੜੇ',
      portal: '🏛️ ਵੈੱਬ ਪੋਰਟਲ',
    },
    formsGuide:
      `📋 *ਭਾਰਤ ਚੋਣ ਕਮਿਸ਼ਨ — ਅਧਿਕਾਰਤ ਫਾਰਮ ਗਾਈਡ*\n\n` +
      `• *ਫਾਰਮ 6 (Form 6):* ਨਵੀਂ ਵੋਟਰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਈ (ਉਮਰ 18+)। ਸਾਲ ਵਿੱਚ 4 ਯੋਗਤਾ ਮਿਤੀਆਂ: 1 ਜਨਵਰੀ, 1 ਅਪ੍ਰੈਲ, 1 ਜੁਲਾਈ, 1 ਅਕਤੂਬਰ।\n\n` +
      `• *ਫਾਰਮ 7 (Form 7):* ਨਾਮ ਕਟਵਾਉਣ ਜਾਂ ਇਤਰਾਜ਼ ਲਈ। ਕਾਨੂੰਨੀ ਨੋਟਿਸ ਅਤੇ ਬੀ.ਐਲ.ਓ. ਪੜਤਾਲ ਲਾਜ਼ਮੀ ਹੈ।\n\n` +
      `• *ਫਾਰਮ 8 (Form 8):* ਪਤਾ ਬਦਲਣ, ਵੇਰਵਿਆਂ ਦੀ ਸੋਧ ਅਤੇ ਨਵਾਂ ਵੋਟਰ ਕਾਰਡ ਲੈਣ ਲਈ।\n\n` +
      `• *ਫਾਰਮ 6A (Form 6A):* ਪ੍ਰਵਾਸੀ ਭਾਰਤੀ (NRI) ਵੋਟਰਾਂ ਦੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਈ (ਪਾਸਪੋਰਟ ਲਾਜ਼ਮੀ)।\n\n` +
      `🔗 *ਆਨਲਾਈਨ ਪੋਰਟਲ:* https://voters.eci.gov.in`,
    blockchainSeal:
      `⛓️ *ਵੋਟਰ ਸੂਚੀ ਬਲਾਕਚੈਨ ਅਖੰਡਤਾ ਰਜਿਸਟਰ (Blockchain Seal)*\n\n` +
      `ਗੈਰ-ਕਾਨੂੰਨੀ ਤਬਦੀਲੀਆਂ ਨੂੰ ਰੋਕਣ ਲਈ ਪੂਰੀ ਵੋਟਰ ਸੂਚੀ **Polygon Amoy** ਬਲਾਕਚੈਨ ਤੇ ਸੀਲ ਕੀਤੀ ਗਈ ਹੈ।\n\n` +
      `📌 *ਨੈੱਟਵਰਕ:* Polygon Amoy (Chain ID: 80002)\n` +
      `📌 *ਸਮਾਰਟ ਕੰਟਰੈਕਟ:* \`0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B\`\n` +
      `📌 *ਮਾਸਟਰ ਮਰਕਲ ਰੂਟ:* \`0x9e4b7c1a8d3f5026b4819a3c7e0f2d5a8b1c4e7f9a2b5d8c1e4f7a0b3c6d9e2f\`\n` +
      `📌 *ਆਡਿਟ ਕੀਤੇ ਵੋਟਰ:* 15,308 (AC 6, 13, 44, 58)\n` +
      `📌 *ਸਥਿਤੀ:* 🔒 ਸੁਰੱਖਿਅਤ ਤੇ ਪ੍ਰਮਾਣਿਤ (Tamper-Proof)\n\n` +
      `🔗 *ਬਲਾਕ ਐਕਸਪਲੋਰਰ:* https://amoy.polygonscan.com/address/0x71C94B2E0a7D53b7A89Ce7B0568B7A19F8a9942B`,
    statsGuide:
      `📊 *ਦਿੱਲੀ ਵਿਧਾਨ ਸਭਾ ਵੋਟਰ ਸੂਚੀ ਆਡਿਟ ਅੰਕੜੇ (Roll Statistics)*\n\n` +
      `• *ਕੁੱਲ ਆਡਿਟ ਕੀਤੇ ਵੋਟਰ:* 15,308\n` +
      `• *ਪੋਲਿੰਗ ਬੂਥ:* 23 ਬੂਥ\n` +
      `• *ਹਲਕੇ:* AC 6 (ਰਿਠਾਲਾ), AC 13 (ਰੋਹਿਣੀ), AC 44 (ਆਰ.ਕੇ. ਪੁਰਮ), AC 58 (ਲਕਸ਼ਮੀ ਨਗਰ)\n` +
      `• *ਪਛਾਣੀਆਂ ਖਾਮੀਆਂ:* 49 ਫਲੈਗ\n` +
      `• *ਰੀਕਾਲ ਦਰ:* 100% (40/40 ਕੇਸ ਫੜੇ ਗਏ)\n` +
      `• *ਗਲਤ ਕਟੌਤੀ ਦਰ:* 0.0%\n\n` +
      `🔗 *ਪੂਰਾ ਆਡਿਟ ਡੈਸ਼ਬੋਰਡ:* https://voter-mitra-hack.vercel.app/dashboard`,
    verifyPrompt:
      `🔍 *ਵੋਟਰ ਸੂਚੀ ਦਾਅਵਾ ਪੜਤਾਲ (Verify Roll Claim)*\n\n` +
      `ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਵਾਲ ਲਿਖ ਕੇ ਜਾਂ ਆਵਾਜ਼ ਵਿੱਚ ਭੇਜੋ:\n\n` +
      `📌 ਜਿਵੇਂ: *"ਕੀ ਭਾਗ 4 ਵਿੱਚ 49 ਮਹਿਲਾ ਵੋਟਰਾਂ ਦੇ ਨਾਮ ਕੱਟੇ ਗਏ?"*\n` +
      `📌 ਜਿਵੇਂ: *"ਪਲਾਟ 12-B ਵਿੱਚ ਕਿੰਨੇ ਵੋਟਰ ਦਰਜ ਹਨ?"*\n` +
      `📌 ਜਿਵੇਂ: *"ਵੋਟਰ ਕਾਰਡ ਤੋਂ ਬਿਨਾਂ ਵੋਟ ਕਿਵੇਂ ਪਾਈਏ?"*\n\n` +
      `ਮੈਂ ਤੁਹਾਨੂੰ ਸਰਕਾਰੀ ਅੰਕੜਿਆਂ ਅਤੇ **Gnani AI ਆਵਾਜ਼ ਸੰਦੇਸ਼** ਨਾਲ ਉੱਤਰ ਦੇਵਾਂਗਾ!`,
    portalPrompt:
      `🏛️ *VoterMitra ਅਧਿਕਾਰਤ ਵੈੱਬ ਪੋਰਟਲ*\n\n` +
      `ਲਾਈਵ ਪੜਤਾਲ, Z-ਸਕੋਰ ਰਿਪੋਰਟਾਂ ਅਤੇ ਬੀ.ਐਲ.ਓ. ਸਮੀਖਿਆ ਦੇਖਣ ਲਈ ਵੈੱਬਸਾਈਟ ਤੇ ਜਾਓ:\n\n` +
      `🔗 https://voter-mitra-hack.vercel.app`,
    langConfirmation: (label, voice) =>
      `✅ *ਭਾਸ਼ਾ ਸਫਲਤਾਪੂਰਵਕ ਚੁਣੀ ਗਈ: ${label}*\n` +
      `🎙️ *Gnani AI Voice Model:* ${voice} (timbre-v2.5)\n\n` +
      `ਹੁਣ ਤੁਸੀਂ ਵੋਟਰ ਸੂਚੀ ਜਾਂ ਚੋਣ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।\n` +
      `ਮੇਨੂ ਦੇਖਣ ਲਈ /help ਭੇਜੋ।`,
    greetingVoiceNote:
      `ਵੋਟਰ ਮਿੱਤਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਅਧਿਕਾਰਤ ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਚੁਣੀ ਗਈ ਹੈ। ਤੁਸੀਂ ਵੋਟਰ ਸੂਚੀ ਦੀ ਪੜਤਾਲ ਜਾਂ ਚੋਣ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।`,
    queryLabels: {
      verdicts: {
        VERIFIED: 'ਪ੍ਰਮਾਣਿਤ · VERIFIED (ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਅਨੁਸਾਰ ਸਹੀ)',
        DISPUTED: 'ਵਿਵਾਦਤ · DISPUTED (ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਦੇ ਉਲਟ)',
        GUIDANCE: 'ਅਧਿਕਾਰਤ ਚੋਣ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ · OFFICIAL GUIDANCE',
      },
      confidence: {
        HIGH: 'ਉੱਚ ਭਰੋਸੇਯੋਗਤਾ (High Confidence)',
        MEDIUM: 'ਦਰਮਿਆਨੀ ਭਰੋਸੇਯੋਗਤਾ (Moderate Confidence)',
      },
      evidenceHeader: 'ਅੰਕੜਾਤਮਕ ਸਬੂਤ ਅਤੇ ਕਾਨੂੰਨੀ ਆਧਾਰ:',
      blockchainSeal: 'ਬਲਾਕਚੈਨ ਮੋਹਰ (Polygon Amoy):',
      portalLink: 'ਅਧਿਕਾਰਤ ਵੈੱਬ ਪੋਰਟਲ:',
      footerHint: 'ਭਾਸ਼ਾ ਬਦਲਣ ਲਈ /language ਭੇਜੋ | ਮੇਨੂ ਲਈ /help',
    },
    fallbacks: {
      plot: {
        verdict: 'VERIFIED',
        summary: `ਪਤਾ ਇਕੱਠ ਆਡਿਟ: 'Plot 12-B, Basement' ਤੇ ਕੁੱਲ 43 ਵੋਟਰ ਰਜਿਸਟਰਡ ਹਨ (ਉਪਨਾਮ ਵਿਭਿੰਨਤਾ: 48%)। ਇਹ ਆਮ ਘਰੇਲੂ ਸੀਮਾ ਤੋਂ ਵੱਧ ਹੈ ਅਤੇ ਬੀ.ਐਲ.ਓ. ਮੌਕਾ ਪੜਤਾਲ ਲਈ ਚਿੰਨ੍ਹਿਤ ਹੈ।`,
        spokenSummary: `Plot 12-B ਤੇ 43 ਵੋਟਰ ਦਰਜ ਹਨ ਅਤੇ ਹੋਸਟਲ ਪੜਤਾਲ ਲਈ ਚਿੰਨ੍ਹਿਤ ਹਨ।`,
        reasoning: ['ਵੱਧ ਵੋਟਰ ਘਣਤਾ ਚਿੰਨ੍ਹਿਤ', 'ਸੰਭਾਵੀ ਕਾਰਨ: ਵਿਦਿਆਰਥੀ ਹੋਸਟਲ / ਪੀ.ਜੀ.'],
      },
      part4: {
        verdict: 'VERIFIED',
        summary: `ਵੋਟਰ ਸੂਚੀ ਆਡਿਟ: ਭਾਗ 4 ਵਿੱਚ 49 ਨੌਜਵਾਨ ਮਹਿਲਾ ਵੋਟਰਾਂ ਦੇ ਨਾਮ ਕੱਟਣ ਦੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਮਿਲੇ ਹਨ (Z-Score: +4.9 sigma)। ਇਸ ਅਸਧਾਰਨ ਤਬਦੀਲੀ ਦੀ ਬੀ.ਐਲ.ਓ. ਵੱਲੋਂ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ।`,
        spokenSummary: `ਭਾਗ 4 ਵਿੱਚ 49 ਮਹਿਲਾ ਵੋਟਰਾਂ ਦੇ ਨਾਮ ਕੱਟੇ ਜਾਣ ਦੀ ਬੀ.ਐਲ.ਓ. ਜਾਂਚ ਜਾਰੀ ਹੈ।`,
        reasoning: ['ਡਰਾਫਟ ਬਨਾਮ ਅੰਤਿਮ ਸੂਚੀ: 680 ਵਿੱਚੋਂ 49 ਕਟੌਤੀਆਂ', 'ਵਿਆਹ ਉਪਰੰਤ ਰਿਹਾਇਸ਼ ਤਬਦੀਲੀ ਜਾਂ ਹੋਸਟਲ'],
      },
      general: {
        verdict: 'GUIDANCE',
        summary: `ਚੋਣ ਕਮਿਸ਼ਨ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਨਵੀਂ ਵੋਟ ਲਈ ਫਾਰਮ 6, ਨਾਮ ਕਟਵਾਉਣ ਲਈ ਫਾਰਮ 7, ਅਤੇ ਪਤਾ ਸੋਧ ਲਈ ਫਾਰਮ 8 ਭਰੋ। ਵੋਟਰ ਕਾਰਡ ਨਾ ਹੋਣ ਤੇ ਵੀ ਸੂਚੀ ਵਿੱਚ ਨਾਮ ਹੋਣ ਤੇ 12 ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਦਸਤਾਵੇਜ਼ਾਂ ਨਾਲ ਵੋਟ ਪਾਈ ਜਾ ਸਕਦੀ ਹੈ।`,
        spokenSummary: `ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਈ ਫਾਰਮ 6, ਕਟਵਾਉਣ ਲਈ ਫਾਰਮ 7 ਅਤੇ ਸੋਧ ਲਈ ਫਾਰਮ 8 ਭਰੋ।`,
        reasoning: ['ਵੋਟਰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨਿਯਮ 1960', '15,308 ਵੋਟਰਾਂ ਦਾ ਆਡਿਟ ਮੁਕੰਮਲ'],
      },
    },
    voiceReceived:
      `🎙️ *ਆਵਾਜ਼ ਸੰਦੇਸ਼ ਪ੍ਰਾਪਤ ਹੋਇਆ (Voice Note Received)*\n\n` +
      `ਆਡੀਓ ਦੀ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ। ਤੁਸੀਂ ਆਪਣਾ ਸਵਾਲ ਲਿਖ ਕੇ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ:\n\n` +
      `📌 ਜਿਵੇਂ: *"ਫਾਰਮ 6 ਕਿਵੇਂ ਭਰੀਏ?"*\n` +
      `📌 ਜਿਵੇਂ: *"ਕੀ ਭਾਗ 4 ਵਿੱਚ 49 ਮਹਿਲਾਵਾਂ ਦੇ ਨਾਮ ਕੱਟੇ ਗਏ?"*\n\n` +
      `ਮੈਂ ਤੁਹਾਨੂੰ ਤੁਰੰਤ ਸਬੂਤਾਂ ਅਤੇ Gnani AI ਆਵਾਜ਼ ਸੰਦੇਸ਼ ਵਿੱਚ ਉੱਤਰ ਦੇਵਾਂਗਾ!`,
        youAsked: 'ਤੁਹਾਡਾ ਸਵਾਲ',
    voiceInaudible:
      `🎙️ *ਆਵਾਜ਼ ਸਪਸ਼ਟ ਸੁਣਾਈ ਨਹੀਂ ਦਿੱਤੀ*\n\nਕਿਰਪਾ ਕਰਕੇ ਮਾਈਕ ਦੇ ਨੇੜੇ ਬੋਲ ਕੇ ਦੁਬਾਰਾ ਭੇਜੋ ਜਾਂ ਲਿਖ ਕੇ ਪੁੱਛੋ:\n\n📌 ਜਿਵੇਂ: *"ਫਾਰਮ 6 ਕਿਵੇਂ ਭਰੀਏ?"*\n📌 ਜਿਵੇਂ: *"ਕੀ ਭਾਗ 4 ਵਿੱਚ 49 ਮਹਿਲਾਵਾਂ ਦੇ ਨਾਮ ਕੱਟੇ ਗਏ?"*`,
actionPrompts: {
      verify: `🔍 *ਸਵਾਲ ਜਾਂ ਦਾਅਵਾ ਪੁੱਛੋ:*\nਸਿੱਧਾ ਚੈਟ ਵਿੱਚ ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ ਜਾਂ ਬੋਲੋ (ਜਿਵੇਂ: *"ਕੀ ਭਾਗ 4 ਵਿੱਚ 49 ਮਹਿਲਾਵਾਂ ਦੇ ਨਾਮ ਕੱਟੇ ਗਏ?"*).`,
      lang: `🌐 *ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ:*`,
    },
  },
};

export function getLanguageDict(langCode) {
  return BOT_I18N[langCode] || BOT_I18N['hi-IN'];
}
