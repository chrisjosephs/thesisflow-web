import Link from 'next/link';
import { getTheses } from './lib/api';
import type { Thesis } from './lib/types';

export const metadata = { title: 'Explore' };

function ConfidencePill({ value }: { value: number }) {
  const pct = Math.round(value);
  const color =
    pct >= 60 ? 'bg-emerald-900 text-emerald-300' :
    pct >= 30 ? 'bg-amber-900 text-amber-300' :
                'bg-red-950 text-red-400';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums ${color}`}>
      {pct}% confidence
    </span>
  );
}

function ThesisCard({ thesis }: { thesis: Thesis }) {
  return (
    <Link href={`/theses/${thesis.id}`} className="block group">
      <article className="h-full rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-3 transition-colors group-hover:border-zinc-600 group-hover:bg-zinc-800/60">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-100 leading-snug group-hover:text-white transition-colors line-clamp-2">
            {thesis.title}
          </h2>
          <ConfidencePill value={thesis.currentConfidence} />
        </div>

        {thesis.originalAuthor && (
          <p className="text-xs text-zinc-500">by {thesis.originalAuthor}</p>
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
  let theses: Thesis[] = [];
  let error: string | null = null;

  try {
    theses = await getTheses();
  } catch {
    error = 'Could not reach the engine. Is it running?';
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Explore theses</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Propositions whose confidence changes as evidence arrives.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!error && theses.length === 0 && (
        <p className="text-sm text-zinc-500">No public theses yet.</p>
      )}

      {theses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {theses.map((thesis) => (
            <ThesisCard key={thesis.id} thesis={thesis} />
          ))}
        </div>
      )}
    </div>
  );
}
