import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const devanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-devanagari' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_BASE_URL ?? 'http://localhost:3000'),
  title: 'VoterMitra · Electoral roll transparency',
  description: 'Check electoral roll claims against the data, with reasoning and confidence. Demo on synthetic test data.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${devanagari.variable} font-sans`}>{children}</body>
    </html>
  );
}
