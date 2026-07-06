import { getTranslations } from 'next-intl/server';
import { getTheses } from '../lib/api';
import { Link } from '../lib/navigation';
import type { Thesis } from '../lib/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  return { title: t('title') };
}

function ConfidencePill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums bg-zinc-800 text-zinc-300">
      {label}
    </span>
  );
}

function ThesisCard({ thesis, confidenceLabel, byLabel }: {
  thesis: Thesis;
  confidenceLabel: string;
  byLabel: string;
}) {
  const pct = Math.round(thesis.currentConfidence);
  const pillColor =
    pct >= 60 ? 'bg-emerald-900 text-emerald-300' :
    pct >= 30 ? 'bg-amber-900 text-amber-300' :
                'bg-red-950 text-red-400';

  return (
    <Link href={`/theses/${thesis.id}`} className="block group">
      <article className="h-full rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-3 transition-colors group-hover:border-zinc-600 group-hover:bg-zinc-800/60">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-100 leading-snug group-hover:text-white transition-colors line-clamp-2">
            {thesis.title}
          </h2>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums shrink-0 ${pillColor}`}>
            {confidenceLabel}
          </span>
        </div>

        {thesis.originalAuthor && (
          <p className="text-xs text-zinc-500">{byLabel}</p>
        )}

        {thesis.summary && (
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{thesis.summary}</p>
        )}

        {thesis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {thesis.tags.map((tag) => (
              <span key={tag.id} className="rounded-full bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}

export default async function HomePage() {
  const t = await getTranslations('HomePage');

  let theses: Thesis[] = [];
  let error: string | null = null;

  try {
    theses = await getTheses();
  } catch {
    error = t('engineError');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">{t('title')}</h1>
        <p className="mt-1 text-sm text-zinc-400">{t('subtitle')}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!error && theses.length === 0 && (
        <p className="text-sm text-zinc-500">{t('empty')}</p>
      )}

      {theses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {theses.map((thesis) => (
            <ThesisCard
              key={thesis.id}
              thesis={thesis}
              confidenceLabel={t('confidence', { pct: Math.round(thesis.currentConfidence) })}
              byLabel={t('by', { author: thesis.originalAuthor ?? '' })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
