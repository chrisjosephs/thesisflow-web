import { getTranslations } from 'next-intl/server';
import { getTheses } from '../lib/api';
import { Link } from '../lib/navigation';
import type { Thesis } from '../lib/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  return { title: t('title') };
}

function confidenceColor(pct: number) {
  return pct >= 60 ? 'text-emerald-400' : pct >= 30 ? 'text-amber-400' : 'text-red-400';
}

function ConfidenceStat({ label, pct }: { label: string; pct: number | null }) {
  if (pct === null) return null;
  const rounded = Math.round(pct);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-base font-semibold tabular-nums leading-none ${confidenceColor(rounded)}`}>{rounded}%</span>
      <span className="text-[10px] text-zinc-500 leading-none">{label}</span>
    </div>
  );
}

function ThesisCard({ thesis, labels }: {
  thesis: Thesis;
  labels: { creator: string; author: string; community: string; by: string };
}) {
  const communityPct = thesis.community.average != null ? Math.round(thesis.community.average) : null;

  return (
    <Link href={`/theses/${thesis.id}`} className="block group">
      <article className="h-full rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-3 transition-colors group-hover:border-zinc-600 group-hover:bg-zinc-800/60">
        <h2 className="text-sm font-semibold text-zinc-100 leading-snug group-hover:text-white transition-colors line-clamp-2">
          {thesis.title}
        </h2>

        {thesis.originalAuthor && (
          <p className="text-xs text-zinc-500">{labels.by}</p>
        )}

        {thesis.summary && (
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{thesis.summary}</p>
        )}

        <div className="flex gap-4 mt-auto pt-2 border-t border-zinc-800">
          <ConfidenceStat label={labels.creator} pct={Math.round(thesis.currentConfidence)} />
          <ConfidenceStat label={labels.author} pct={thesis.authorStatedConfidence} />
          {communityPct !== null && (
            <ConfidenceStat label={`${labels.community} (${thesis.community.count})`} pct={communityPct} />
          )}
        </div>

        {thesis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
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
              labels={{
                creator:   t('creatorConfidence'),
                author:    t('authorConfidence'),
                community: t('communityConfidence'),
                by:        t('by', { author: thesis.originalAuthor ?? '' }),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
