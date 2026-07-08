import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Nav' });
  return { title: t('help') };
}

export default async function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-12 text-sm text-zinc-300 leading-relaxed">

      {/* What is ThesisFlow */}
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-white">What is ThesisFlow?</h1>
        <p>
          ThesisFlow is a platform for holding beliefs accountable to evidence. You state a thesis — any
          proposition you hold with some degree of confidence — and the platform monitors incoming evidence
          to update that confidence over time.
        </p>
        <p>
          A thesis can be an investment view, a scientific hypothesis, a political prediction, or a sporting
          call. The only requirement is that it is falsifiable: there must be something that, if true, would
          change your mind.
        </p>
        <p className="text-zinc-400 italic border-l-4 border-zinc-700 pl-4">
          ThesisFlow is not about being right. It is about updating your beliefs when the evidence warrants it.
          Someone who publishes at 90% confidence and arrives at 35% six months later — because the evidence
          moved — is doing it correctly.
        </p>
      </section>

      {/* Contenders and Gladiators */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Contenders and Gladiators</h2>
        <p>
          When you publish a thesis, you are a <strong className="text-white">Contender</strong>. You step
          into the arena and declare your position. The evidence, the AI, and the community are the
          <strong className="text-white"> Gladiators</strong> — they come at your thesis from every angle.
        </p>
        <p>
          The Gladiators do not win by proving you wrong. They win by forcing you to be honest.
        </p>

        {/* The whistle sequence */}
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">How it works</p>

          <div className="flex gap-4">
            <span className="text-2xl shrink-0">🤌</span>
            <div>
              <p className="font-medium text-white">First whistle — Contenders, ready!</p>
              <p className="text-zinc-400 mt-0.5">
                You state your thesis, set your confidence, and define the criteria. This is your move.
                The arena opens. ThesisFlow saves your position.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="text-2xl shrink-0">🤌</span>
            <div>
              <p className="font-medium text-white">Second whistle — Gladiators, ready!</p>
              <p className="text-zinc-400 mt-0.5">
                The AI begins monitoring. Evidence arrives from feeds, documents, and sources. Each piece
                is evaluated against your criteria. Your confidence score updates. You do not need to be
                watching — Ziggy will alert you when something significant happens.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="text-2xl shrink-0">📣</span>
            <div>
              <p className="font-medium text-white">Argue the toss!</p>
              <p className="text-zinc-400 mt-0.5">
                Other Contenders can submit their own confidence estimates and leave comments on your thesis.
                The community average is decay-weighted — recent opinions count more than old ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is a thesis */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">What makes a good thesis?</h2>
        <p className="text-zinc-200 italic border-l-4 border-zinc-500 pl-4">
          A thesis can only be as good as the criteria you test it by.
        </p>
        <p>
          A good thesis has at least one criterion that would <strong className="text-emerald-400">support</strong> it
          and at least one that would <strong className="text-red-400">falsify</strong> it. Without a falsification
          criterion, you are not holding a thesis — you are holding an opinion.
        </p>
        <div className="space-y-3">
          <div className="rounded-lg border border-emerald-800 bg-zinc-900 px-4 py-3">
            <p className="text-xs font-medium text-emerald-400 mb-1">Support</p>
            <p className="text-zinc-300">Evidence that, if confirmed, increases your confidence. Be specific: name the source, the threshold, the observable outcome.</p>
          </div>
          <div className="rounded-lg border border-red-800 bg-zinc-900 px-4 py-3">
            <p className="text-xs font-medium text-red-400 mb-1">Falsify</p>
            <p className="text-zinc-300">Evidence that, if confirmed, would force you to abandon or substantially revise the thesis. This is the most important criterion.</p>
          </div>
          <div className="rounded-lg border border-amber-800 bg-zinc-900 px-4 py-3">
            <p className="text-xs font-medium text-amber-400 mb-1">Watch signal</p>
            <p className="text-zinc-300">A leading indicator — something to monitor that does not by itself confirm or deny the thesis, but tells you which way the wind is blowing.</p>
          </div>
        </div>
      </section>

      {/* Confidence scores */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">The confidence scores</h2>
        <p>Each thesis shows up to four confidence readings:</p>
        <ul className="space-y-2 list-none">
          <li><span className="text-white font-medium">Evidence-based</span> — computed by the AI from incoming documents, weighted by source credibility.</li>
          <li><span className="text-white font-medium">Author-stated</span> — your declared confidence when you published the thesis.</li>
          <li><span className="text-white font-medium">AI estimate</span> — the AI&apos;s calibrated probability, independent of the evidence feed.</li>
          <li><span className="text-white font-medium">Community</span> — the decay-weighted average of estimates submitted by other Contenders. Older votes count less.</li>
        </ul>
      </section>

      {/* Lifecycle */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Thesis lifecycle</h2>
        <div className="space-y-2">
          {[
            { status: 'Draft',    color: 'text-zinc-400', desc: 'You are still writing it. Nothing is monitored. Nothing is public.' },
            { status: 'Active',   color: 'text-emerald-400', desc: 'Live. Monitoring runs. The community can see and vote on it.' },
            { status: 'Archived', color: 'text-zinc-500', desc: 'Manually retired. Monitoring stops. The record is preserved.' },
            { status: 'Resolved', color: 'text-blue-400', desc: 'The question has been answered — by you, or automatically when the expiry date is reached.' },
          ].map(({ status, color, desc }) => (
            <div key={status} className="flex gap-3">
              <span className={`font-medium shrink-0 w-20 ${color}`}>{status}</span>
              <span className="text-zinc-400">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ziggy */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Ziggy</h2>
        <p>
          Ziggy is the ThesisFlow Android home screen widget. It monitors your active theses in the
          background and surfaces alerts when significant evidence arrives — a sharp confidence move,
          a falsification criterion triggered, a watch signal firing.
        </p>
        <p className="text-zinc-400">
          You contend your thesis once, then get on with your life. Ziggy keeps watching.
        </p>
      </section>

    </div>
  );
}
