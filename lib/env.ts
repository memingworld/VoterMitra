import 'server-only';
import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // PostgreSQL Database & Supabase
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

  // Gnani Voice AI (Vachana STT / TTS)
  GNANI_API_KEY: z.string().optional(),

  // Telegram Bot
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_SECRET_TOKEN: z.string().optional(),
  TELEGRAM_BOT_USERNAME: z.string().default('VoterMitrabot'),

  // Application & Session Security
  DEV_ROUTES_SECRET: z.string().default('votermitra-dev-secret'),
  SESSION_SECRET: z.string().default('votermitra-super-secret-session-key-32chars'),
  BENCHMARK_PLANTED_TOTAL: z.coerce.number().int().default(40),
  PUBLIC_BASE_URL: z.string().default('https://voter-mitra-hack.vercel.app'),
});

export type Env = z.infer<typeof EnvSchema>;

let cachedEnv: Env | null = null;

export function env(): Env {
  if (cachedEnv) return cachedEnv;

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    return {
      NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) || 'production',
      DATABASE_URL: process.env.DATABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      GNANI_API_KEY: process.env.GNANI_API_KEY,
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
      TELEGRAM_SECRET_TOKEN: process.env.TELEGRAM_SECRET_TOKEN,
      TELEGRAM_BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME || 'VoterMitrabot',
      DEV_ROUTES_SECRET: process.env.DEV_ROUTES_SECRET || 'votermitra-dev-secret',
      SESSION_SECRET: process.env.SESSION_SECRET || 'votermitra-super-secret-session-key-32chars',
      BENCHMARK_PLANTED_TOTAL: Number(process.env.BENCHMARK_PLANTED_TOTAL) || 40,
      PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || 'https://voter-mitra-hack.vercel.app',
    };
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
