import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getThesis } from '../../lib/api';
import type { Criterion } from '../../lib/types';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const thesis = await getThesis(id);
    return { title: thesis.title };
  } catch {
    return { title: 'Thesis' };
  }
}

function ConfidenceBar({ label, value, sublabel }: { label: string; value: number | null; sublabel?: string }) {
  if (value === null) return null;
  const pct = Math.round(value);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-zinc-100">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-zinc-300 transition-all"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      {sublabel && <p className="text-xs text-zinc-500 leading-relaxed">{sublabel}</p>}
    </div>
  );
}

const CRITERION_STYLES = {
  SUPPORT:      { label: 'Supports',     bar: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-900' },
  FALSIFY:      { label: 'Falsifies',    bar: 'bg-red-500',     text: 'text-red-400',     border: 'border-red-900'     },
  WATCH_SIGNAL: { label: 'Watch signal', bar: 'bg-amber-500',   text: 'text-amber-400',   border: 'border-amber-900'   },
};

function CriterionRow({ c }: { c: Criterion }) {
  const style = CRITERION_STYLES[c.type];
  const impact = c.impactIfConfirmed ?? 0;
  const absImpact = Math.abs(impact);

  return (
    <li className={`rounded-lg border ${style.border} bg-zinc-900 p-4 flex flex-col gap-2`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-zinc-200 leading-snug">{c.description}</p>
        {c.weight !== null && (
          <span className={`shrink-0 text-xs font-medium tabular-nums ${style.text}`}>
            w{c.weight}
          </span>
        )}
      </div>

      {c.rationale && (
        <p className="text-xs text-zinc-500 leading-relaxed">{c.rationale}</p>
      )}

      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-1 rounded-full bg-zinc-800">
          <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${Math.min(absImpact, 100)}%` }} />
        </div>
        <span className={`text-xs tabular-nums ${style.text}`}>{impact > 0 ? '+' : ''}{impact}%</span>
      </div>
    </li>
  );
}

export default async function ThesisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let thesis;
  try {
    thesis = await getThesis(id);
  } catch {
    notFound();
  }

  const criteria = thesis.criteria ?? [];
  const supports      = criteria.filter((c) => c.type === 'SUPPORT');
  const falsifiers    = criteria.filter((c) => c.type === 'FALSIFY');
  const watchSignals  = criteria.filter((c) => c.type === 'WATCH_SIGNAL');

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        {thesis.originalAuthor && (
          <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">{thesis.originalAuthor}</p>
        )}
        <h1 className="text-2xl font-semibold text-white leading-snug">{thesis.title}</h1>
        {thesis.originalSource && (
          <p className="mt-1 text-sm text-zinc-500 italic">{thesis.originalSource}</p>
        )}
        {thesis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {thesis.tags.map((tag) => (
              <span key={tag.id} className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-400">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Confidence */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 mb-8 flex flex-col gap-5">
        <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500">Confidence</h2>
        <ConfidenceBar
          label="Evidence-based"
          value={thesis.currentConfidence}
          sublabel={thesis.confidenceRationale ?? undefined}
        />
        <ConfidenceBar
          label={`Author (${thesis.originalAuthor ?? 'self'})`}
          value={thesis.authorStatedConfidence}
        />
        <ConfidenceBar
          label="AI estimate"
          value={thesis.aiStatedConfidence}
          sublabel={thesis.aiStatedRationale ?? undefined}
        />
      </section>

      {/* Description */}
      {thesis.description && (
        <section className="mb-8 prose prose-invert prose-sm max-w-none
          prose-p:text-zinc-300 prose-p:leading-relaxed
          prose-headings:text-zinc-100">
          <ReactMarkdown>{thesis.description}</ReactMarkdown>
        </section>
      )}

      {/* Criteria */}
      {criteria.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500">Criteria</h2>

          {supports.length > 0 && (
            <div>
              <h3 className="text-xs text-emerald-400 mb-3 font-medium">What would support it</h3>
              <ul className="flex flex-col gap-2">
                {supports.map((c) => <CriterionRow key={c.id} c={c} />)}
              </ul>
            </div>
          )}

          {falsifiers.length > 0 && (
            <div>
              <h3 className="text-xs text-red-400 mb-3 font-medium">What would falsify it</h3>
              <ul className="flex flex-col gap-2">
                {falsifiers.map((c) => <CriterionRow key={c.id} c={c} />)}
              </ul>
            </div>
          )}

          {watchSignals.length > 0 && (
            <div>
              <h3 className="text-xs text-amber-400 mb-3 font-medium">Watch signals</h3>
              <ul className="flex flex-col gap-2">
                {watchSignals.map((c) => <CriterionRow key={c.id} c={c} />)}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
