import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import 'primeicons/primeicons.css';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'ThesisFlow', template: '%s — ThesisFlow' },
  description: 'Track confidence in ideas as evidence arrives.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 antialiased">
        <Providers>
          <header className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
            <a href="/" className="text-lg font-semibold tracking-tight text-white hover:text-zinc-300 transition-colors">
              ThesisFlow
            </a>
            <span className="text-zinc-600 text-sm">/ explore</span>
          </header>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
