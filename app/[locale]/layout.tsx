import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Providers } from '../providers';
import { Link } from '../lib/navigation';
import { NavTabs } from './nav-tabs';

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
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'Nav' });

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <header className="border-b border-zinc-800 px-6 py-3 flex items-center gap-6">
          <Link href="/" className="text-base font-semibold tracking-tight text-white hover:text-zinc-300 transition-colors shrink-0">
            ThesisFlow
          </Link>
          <NavTabs tabs={[
            { href: '/',            label: t('explore') },
            { href: '/theses/new', label: t('contend') },
            { href: '/help',       label: t('help') },
          ]} />
        </header>
        <main className="flex-1">{children}</main>
      </Providers>
    </NextIntlClientProvider>
  );
}
