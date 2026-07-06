import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import 'primeicons/primeicons.css';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  description: 'Track confidence in ideas as evidence arrives.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
