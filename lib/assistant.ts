import 'server-only';
import { getPartFlags, getPartStats, listConstituencies, logClaimAudit } from './queries';
import type { BotLanguage } from './telegram/i18n';

export type Verdict = 'VERIFIED' | 'DISPUTED' | 'NOT_PROVABLE';
export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface AssistantAnswer {
  verdict: Verdict | null;
  confidence: Confidence | null;
  summary: string;
  spokenSummary: string;
  reasoning: string[];
  sources: string[];
  /** claim_audits row id, used for share links */
  auditId?: string;
}

export interface AnswerOptions {
  source: 'TELEGRAM_VOICE' | 'TELEGRAM_TEXT' | 'WEB_UI' | 'API';
  transcribedText?: string;
  telegramUserId?: number;
}

function extractPartNumber(text: string): number | null {
  const match = text.match(/(?:part|भाग|पार्ट)\s*([0-9]+)/i) || text.match(/\b([0-9]+)\s*(?:part|भाग|पार्ट)/i);
  if (match) return parseInt(match[1], 10);
  // Also look for isolated numbers 1-99
  const numMatch = text.match(/\b([1-9][0-9]?)\b/);
  return numMatch ? parseInt(numMatch[1], 10) : null;
}

function extractClaimedCount(text: string): number | null {
  const match = text.match(/\b([0-9]{3,7})\b/);
  return match ? parseInt(match[1], 10) : null;
}

export async function answerQuestion(
  question: string,
  lang: BotLanguage = 'hi-IN',
  options: AnswerOptions = { source: 'WEB_UI' },
): Promise<AssistantAnswer> {
  const startTime = Date.now();
  const constituencies = await listConstituencies();
  const defaultAc = constituencies[0]?.acNo ?? 13;
  const partNo = extractPartNumber(question) ?? 1;
  const claimedCount = extractClaimedCount(question);

  let verdict: Verdict = 'NOT_PROVABLE';
  let confidence: Confidence = 'MEDIUM';
  let summary = '';
  let spokenSummary = '';
  const reasoning: string[] = [];
  const sources: string[] = [`Draft vs Revised Roll AC ${defaultAc} Part ${partNo}`];

  // Whitelisted query execution
  const stats = await getPartStats({ acNo: defaultAc, partNo });
  const flags = await getPartFlags({ acNo: defaultAc, partNo });

  const isDeletionQuery = /कट|हटे|वगळ|delet|remov/i.test(question);
  const isAdditionQuery = /जोड़|शामिल|समाविष्ट|add/i.test(question);
  const isReasonQuery = /क्यों|का|why|reason/i.test(question);

  if (!stats) {
    verdict = 'NOT_PROVABLE';
    confidence = 'LOW';
    if (lang === 'hi-IN') {
      summary = `पार्ट ${partNo} के लिए वर्तमान में कोई सांख्यिकीय डेटा उपलब्ध नहीं है।`;
      spokenSummary = `पार्ट ${partNo} के लिए डेटा उपलब्ध नहीं है।`;
      reasoning.push('निर्वाचन क्षेत्र और भाग संख्या की पुष्टि सार्वजनिक रिकॉर्ड से नहीं हो सकी।');
    } else if (lang === 'mr-IN') {
      summary = `भाग ${partNo} साठी सध्या कोणताही सांख्यिकीय डेटा उपलब्ध नाही.`;
      spokenSummary = `भाग ${partNo} साठी माहिती उपलब्ध नाही.`;
      reasoning.push('सार्वजनिक नोंदींमध्ये भाग क्रमांक आढळला नाही.');
    } else {
      summary = `No statistical data is currently available for Part ${partNo}.`;
      spokenSummary = `No data available for Part ${partNo}.`;
      reasoning.push('Part number not matched in public synthetic roll database.');
    }
  } else if (isReasonQuery) {
    verdict = flags.length > 0 ? 'VERIFIED' : 'NOT_PROVABLE';
    confidence = flags.length > 0 ? 'HIGH' : 'MEDIUM';

    if (lang === 'hi-IN') {
      if (flags.length > 0) {
        summary = `पार्ट ${partNo} में ${flags.length} सांख्यिकीय फ्लैग दर्ज हैं: ${flags.map((f) => f.primaryFinding).join('; ')}`;
        spokenSummary = `पार्ट ${partNo} में मुख्य बदलाव सांख्यिकीय पैटर्न के रूप में दर्ज हैं, जिसमें ${flags[0].primaryFinding}`;
        reasoning.push(...flags.map((f) => `${f.anomalyType}: ${f.primaryFinding} (विश्वास: ${Math.round(f.confidenceScore * 100)}%)`));
      } else {
        summary = `पार्ट ${partNo} में हटाए या जोड़े गए नाम नियमित संशोधन प्रक्रिया के अंतर्गत हैं, कोई असामान्यता दर्ज नहीं है।`;
        spokenSummary = `पार्ट ${partNo} में बदलाव नियमित संशोधन प्रक्रिया के अंतर्गत हैं।`;
        reasoning.push(`कुल विलोपन: ${stats.removedCount}, कुल परिवर्धन: ${stats.addedCount} सामान्य सीमा के अंदर हैं।`);
      }
    } else if (lang === 'mr-IN') {
      if (flags.length > 0) {
        summary = `भाग ${partNo} मध्ये ${flags.length} सांख्यिकीय नोंदी आढळल्या आहेत: ${flags.map((f) => f.primaryFinding).join('; ')}`;
        spokenSummary = `भाग ${partNo} मधील बदल सांख्यिकीय विश्लेषणात नोंदवले गेले आहेत.`;
        reasoning.push(...flags.map((f) => `${f.anomalyType}: ${f.primaryFinding}`));
      } else {
        summary = `भाग ${partNo} मधील बदल नियमित पुनरीक्षण प्रक्रियेनुसार आहेत, कोणतीही विसंगती नाही.`;
        spokenSummary = `भाग ${partNo} मधील बदल नियमित आहेत.`;
        reasoning.push(`वगळलेली नावे: ${stats.removedCount}, नवीन नावे: ${stats.addedCount}.`);
      }
    } else {
      if (flags.length > 0) {
        summary = `Part ${partNo} has ${flags.length} statistical anomaly flag(s) under review: ${flags.map((f) => f.primaryFinding).join('; ')}`;
        spokenSummary = `Part ${partNo} has statistical flags under review, primarily ${flags[0].primaryFinding}.`;
        reasoning.push(...flags.map((f) => `${f.anomalyType}: ${f.primaryFinding} (confidence: ${Math.round(f.confidenceScore * 100)}%)`));
      } else {
        summary = `Revisions in Part ${partNo} reflect standard roll updates; no statistical anomalies flagged.`;
        spokenSummary = `Revisions in Part ${partNo} reflect standard roll updates.`;
        reasoning.push(`Removed entries: ${stats.removedCount}, newly added: ${stats.addedCount}, within normal distribution.`);
      }
    }
  } else if (claimedCount !== null) {
    const actual = isAdditionQuery && !isDeletionQuery ? stats.addedCount : stats.removedCount;
    const diff = Math.abs(claimedCount - actual);
    const ratio = actual > 0 ? diff / actual : diff;

    if (ratio < 0.15) {
      verdict = 'VERIFIED';
      confidence = 'HIGH';
    } else {
      verdict = 'DISPUTED';
      confidence = 'HIGH';
    }

    if (lang === 'hi-IN') {
      summary = `दावे में ${claimedCount.toLocaleString('en-IN')} का उल्लेख है, जबकि आधिकारिक परीक्षण डेटा के अनुसार पार्ट ${partNo} में वास्तव में ${actual.toLocaleString('en-IN')} नाम ${isAdditionQuery ? 'जोड़े' : 'हटाए'} गए।`;
      spokenSummary = `दावे में ${claimedCount} संख्या बताई गई है, जबकि डेटा के अनुसार वास्तव में ${actual} नाम ${isAdditionQuery ? 'जोड़े' : 'हटाए'} गए। यह दावा ${verdict === 'VERIFIED' ? 'प्रमाणित' : 'विवादित'} है।`;
      reasoning.push(`पुनरीक्षण v1 मतदाता संख्या: ${stats.v1Count.toLocaleString('en-IN')}`);
      reasoning.push(`पुनरीक्षण v2 मतदाता संख्या: ${stats.v2Count.toLocaleString('en-IN')}`);
      reasoning.push(`शुद्ध अंतर: ${stats.netChange >= 0 ? '+' : ''}${stats.netChange.toLocaleString('en-IN')}`);
    } else if (lang === 'mr-IN') {
      summary = `दाव्यात ${claimedCount.toLocaleString('en-IN')} उल्लेख आहे, परंतु अधिकृत चाचणी डेटानुसार भाग ${partNo} मध्ये प्रत्यक्षात ${actual.toLocaleString('en-IN')} नावे ${isAdditionQuery ? 'जोडली' : 'वगळली'} आहेत.`;
      spokenSummary = `दाव्यात ${claimedCount} सांगितले आहे, प्रत्यक्षात ${actual} नावे बदलली आहेत.`;
      reasoning.push(`v1 मतदार संख्या: ${stats.v1Count.toLocaleString('en-IN')}`);
      reasoning.push(`v2 मतदार संख्या: ${stats.v2Count.toLocaleString('en-IN')}`);
    } else {
      summary = `The claim cites ${claimedCount.toLocaleString('en-IN')}, whereas official test data shows exactly ${actual.toLocaleString('en-IN')} entries ${isAdditionQuery ? 'added to' : 'removed from'} Part ${partNo}.`;
      spokenSummary = `The claim cites ${claimedCount}, but data confirms ${actual} entries were ${isAdditionQuery ? 'added' : 'removed'}. The claim is ${verdict.toLowerCase()}.`;
      reasoning.push(`Baseline v1 total: ${stats.v1Count.toLocaleString('en-IN')}`);
      reasoning.push(`Revised v2 total: ${stats.v2Count.toLocaleString('en-IN')}`);
      reasoning.push(`Net change: ${stats.netChange >= 0 ? '+' : ''}${stats.netChange.toLocaleString('en-IN')}`);
    }
  } else {
    verdict = 'VERIFIED';
    confidence = 'HIGH';
    if (lang === 'hi-IN') {
      summary = `पार्ट ${partNo} के आधिकारिक डेटा के अनुसार, कुल ${stats.removedCount.toLocaleString('en-IN')} नाम हटाए गए और ${stats.addedCount.toLocaleString('en-IN')} नए नाम जोड़े गए (v1: ${stats.v1Count}, v2: ${stats.v2Count})।`;
      spokenSummary = `पार्ट ${partNo} में ${stats.removedCount} नाम हटाए गए और ${stats.addedCount} नए नाम जोड़े गए।`;
      reasoning.push(`v1 प्रारूप सूची: ${stats.v1Count} मतदाता`);
      reasoning.push(`v2 संशोधित सूची: ${stats.v2Count} मतदाता`);
      reasoning.push(`संबद्ध सांख्यिकीय फ्लैग: ${stats.flagsCount}`);
    } else if (lang === 'mr-IN') {
      summary = `भाग ${partNo} च्या डेटानुसार, एकूण ${stats.removedCount.toLocaleString('en-IN')} नावे वगळली आणि ${stats.addedCount.toLocaleString('en-IN')} नवीन नावे जोडली गेली.`;
      spokenSummary = `भाग ${partNo} मध्ये ${stats.removedCount} नावे वगळली आणि ${stats.addedCount} नवीन नावे जोडली.`;
      reasoning.push(`v1 यादी: ${stats.v1Count} मतदार`);
      reasoning.push(`v2 यादी: ${stats.v2Count} मतदार`);
    } else {
      summary = `In Part ${partNo}, test roll data shows ${stats.removedCount.toLocaleString('en-IN')} removals and ${stats.addedCount.toLocaleString('en-IN')} additions (v1: ${stats.v1Count}, v2: ${stats.v2Count}).`;
      spokenSummary = `In Part ${partNo}, data shows ${stats.removedCount} removals and ${stats.addedCount} additions.`;
      reasoning.push(`Baseline v1 electors: ${stats.v1Count.toLocaleString('en-IN')}`);
      reasoning.push(`Revised v2 electors: ${stats.v2Count.toLocaleString('en-IN')}`);
      reasoning.push(`Statistical anomaly flags logged: ${stats.flagsCount}`);
    }
  }

  let answer: AssistantAnswer = {
    verdict,
    confidence,
    summary,
    spokenSummary,
    reasoning,
    sources,
  };

  try {
    const auditId = await logClaimAudit({
      source: options.source,
      telegramUserId: options.telegramUserId ?? null,
      rawQuery: question,
      transcribedText: options.transcribedText ?? null,
      languageCode: lang,
      selectedFunction: isReasonQuery ? 'getPartFlags' : 'getPartStats',
      functionArgs: { acNo: defaultAc, partNo, claimedCount },
      toolOutput: stats,
      verdict,
      confidence,
      reasoning,
      explanation: summary,
      executionTimeMs: Date.now() - startTime,
    });
    if (auditId) {
      answer = { ...answer, auditId };
    }
  } catch (err) {
    console.warn('[assistant] audit log failed:', err instanceof Error ? err.message : err);
  }

  return answer;
}
