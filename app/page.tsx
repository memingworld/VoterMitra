import Link from 'next/link';
import { ClaimChecker } from '@/components/claim-checker';

export default function HomePage() {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <span className="text-lg font-semibold">VoterMitra</span>
        {botUsername && (
          <a href={`https://t.me/${botUsername}`} className="text-sm text-indigo-600 hover:underline">
            Use on Telegram →
          </a>
        )}
      </header>

      <ClaimChecker />

      <footer className="mt-12 space-y-1 border-t border-slate-200 pt-4 text-xs text-slate-500">
        <p>Demo on synthetic test data. Every answer shows its reasoning and confidence, and applies the same rules to every claim.</p>
        <p>
          Election officials:{' '}
          <Link href="/dashboard" className="underline">
            audit console
          </Link>
        </p>
      </footer>
    </main>
  );
}
