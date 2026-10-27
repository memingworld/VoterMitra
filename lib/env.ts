import 'server-only';
import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  GNANI_API_KEY: z.string().min(1, 'GNANI_API_KEY is required'),
  DEV_ROUTES_SECRET: z.string().min(1, 'DEV_ROUTES_SECRET is required'),

  // Dashboard
  DASHBOARD_PASSCODE: z.string().min(6).optional(),
  SESSION_SECRET: z.string().min(32, 'must be at least 32 characters').optional(),
  BENCHMARK_PLANTED_TOTAL: z.coerce.number().int().positive().optional(),
  TELEGRAM_BOT_USERNAME: z.string().optional(),
  PUBLIC_BASE_URL: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

let cachedEnv: Env | null = null;

export function env(): Env {
  if (cachedEnv) return cachedEnv;

  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    // Build must not fail if env is missing
    const isBuildPhase =
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.__NEXT_BUILDING === '1' ||
      process.env.npm_lifecycle_event === 'build';

    if (isBuildPhase) {
      return {
        NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) || 'production',
        DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy',
        GNANI_API_KEY: process.env.GNANI_API_KEY || 'dummy-key',
        DEV_ROUTES_SECRET: process.env.DEV_ROUTES_SECRET || 'dummy-secret',
        DASHBOARD_PASSCODE: process.env.DASHBOARD_PASSCODE,
        SESSION_SECRET: process.env.SESSION_SECRET || '01234567890123456789012345678901',
        BENCHMARK_PLANTED_TOTAL: process.env.BENCHMARK_PLANTED_TOTAL
          ? Number(process.env.BENCHMARK_PLANTED_TOTAL)
          : undefined,
        TELEGRAM_BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME,
        PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL,
      };
    }

    const formatted = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Environment validation failed:\n${formatted}`);
  }

  cachedEnv = result.data;
  return cachedEnv;
}
