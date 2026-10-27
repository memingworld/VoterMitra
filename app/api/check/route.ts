import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { answerQuestion } from '@/lib/assistant';
import { BOT_LANGUAGES } from '@/lib/telegram/i18n';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { errorResponse } from '@/lib/route-helpers';

export const dynamic = 'force-dynamic';

const Body = z.object({
  question: z.string().trim().min(2).max(500),
  lang: z.enum(BOT_LANGUAGES),
});

export async function POST(req: NextRequest) {
  if (!rateLimit(`check:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Send { question, lang }.' }, { status: 400 });
  }

  try {
    const answer = await answerQuestion(parsed.data.question, parsed.data.lang, { source: 'WEB_UI' });
    return NextResponse.json({ answer });
  } catch (err) {
    return errorResponse(err);
  }
}
