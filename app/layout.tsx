import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { LanguageProvider } from '@/components/language-context';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_BASE_URL ?? 'http://localhost:3000'),
  title: 'VoterMitra · Electoral Roll Transparency & Anomaly Auditing',
  description: 'AI-assisted, explainable electoral roll audit and citizen claim verification suite.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen bg-slate-50 text-slate-900 antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
