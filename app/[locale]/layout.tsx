import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Providers } from '../providers';
import { Link } from '../lib/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Nav' });
  return { title: { default: t('brand'), template: `%s — ${t('brand')}` } };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <header className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white hover:text-zinc-300 transition-colors">
            ThesisFlow
          </Link>
          <span className="text-zinc-600 text-sm">/ explore</span>
        </header>
        <main className="flex-1">{children}</main>
      </Providers>
    </NextIntlClientProvider>
  );
}
