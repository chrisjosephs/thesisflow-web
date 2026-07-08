'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '../../../lib/navigation';
import { createThesis } from '../../../lib/api';

type CriterionType = 'SUPPORT' | 'FALSIFY' | 'WATCH_SIGNAL';

interface DraftCriterion {
  localId: number;
  type: CriterionType;
  description: string;
  rationale: string;
}

const MONITORING_PROFILES = [
  { name: 'CONTINUOUS', label: 'Continuous — every minute' },
  { name: 'LIVE',       label: 'Live — every 15 minutes' },
  { name: 'ACTIVE',     label: 'Active — hourly' },
  { name: 'STANDARD',   label: 'Standard — daily' },
  { name: 'SLOW',       label: 'Slow — weekly' },
  { name: 'COSMIC',     label: 'Cosmic — bi-weekly' },
];

const criterionStyle: Record<CriterionType, { border: string; badge: string; label: string }> = {
  SUPPORT:      { border: 'border-emerald-800', badge: 'bg-emerald-900 text-emerald-300', label: 'Support' },
  FALSIFY:      { border: 'border-red-800',     badge: 'bg-red-900 text-red-300',         label: 'Falsify' },
  WATCH_SIGNAL: { border: 'border-amber-800',   badge: 'bg-amber-900 text-amber-300',     label: 'Watch signal' },
};

let nextId = 0;
function newCriterion(type: CriterionType): DraftCriterion {
  return { localId: nextId++, type, description: '', rationale: '' };
}

export default function CreateThesisPage() {
  const t = useTranslations('CreateThesisPage');
  const router = useRouter();

  const [title,               setTitle]               = useState('');
  const [summary,             setSummary]             = useState('');
  const [description,         setDescription]         = useState('');
  const [confidence,          setConfidence]          = useState(50);
  const [visibility,          setVisibility]          = useState<'PUBLIC' | 'UNLISTED' | 'PRIVATE'>('PUBLIC');
  const [monitoringProfile,   setMonitoringProfile]   = useState('');
  const [expiresAt,           setExpiresAt]           = useState('');
  const [tags,                setTags]                = useState('');
  const [criteria,            setCriteria]            = useState<DraftCriterion[]>([]);
  const [saving,              setSaving]              = useState(false);
  const [error,               setError]               = useState<string | null>(null);

  function addCriterion(type: CriterionType) {
    setCriteria((prev) => [...prev, newCriterion(type)]);
  }

  function removeCriterion(localId: number) {
    setCriteria((prev) => prev.filter((c) => c.localId !== localId));
  }

  function updateCriterion(localId: number, patch: Partial<DraftCriterion>) {
    setCriteria((prev) => prev.map((c) => c.localId === localId ? { ...c, ...patch } : c));
  }

  async function submit(publish: boolean) {
    if (!title.trim()) return;
    setSaving(true);
    setError(null);

    const body = {
      title:                title.trim(),
      summary:              summary.trim() || undefined,
      description:          description.trim() || undefined,
      visibility,
      authorStatedConfidence: confidence,
      monitoringProfileName: monitoringProfile || undefined,
      expiresAt:            expiresAt || undefined,
      tags:                 tags.split(',').map((s) => s.trim()).filter(Boolean),
      criteria:             criteria
        .filter((c) => c.description.trim())
        .map(({ type, description, rationale }) => ({
          type,
          description: description.trim(),
          rationale:   rationale.trim() || undefined,
        })),
      publish,
    };

    try {
      // Auth token will come from session once auth is wired up.
      // Passing empty string surfaces a 401 which we surface as an error.
      const thesis = await createThesis(body, '');
      router.push(`/theses/${thesis.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errorGeneric'));
      setSaving(false);
    }
  }

  const filled = criteria.filter((c) => c.description.trim()).length;
  const supports      = criteria.filter((c) => c.type === 'SUPPORT');
  const falsifications = criteria.filter((c) => c.type === 'FALSIFY');
  const watchSignals  = criteria.filter((c) => c.type === 'WATCH_SIGNAL');

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">{t('title')}</h1>
        <p className="mt-1 text-sm text-zinc-400">{t('subtitle')}</p>
      </div>

      {/* ── The thesis ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{t('sectionThesis')}</h2>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400">{t('titleLabel')}</label>
          <textarea
            rows={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('titlePlaceholder')}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400">{t('summaryLabel')}</label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={t('summaryPlaceholder')}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400">{t('descriptionLabel')}</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('descriptionPlaceholder')}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none resize-none"
          />
        </div>
      </section>

      {/* ── Confidence ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{t('sectionConfidence')}</h2>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <label className="text-xs text-zinc-400">{t('confidenceLabel', { pct: confidence })}</label>
            <span className={`text-2xl font-semibold tabular-nums ${confidence >= 60 ? 'text-emerald-400' : confidence >= 30 ? 'text-amber-400' : 'text-red-400'}`}>
              {confidence}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full accent-zinc-400"
          />
          <p className="text-xs text-zinc-500">{t('confidenceHelp')}</p>
        </div>
      </section>

      {/* ── Details ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{t('sectionDetails')}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">{t('visibilityLabel')}</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as typeof visibility)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
            >
              <option value="PUBLIC">{t('visibilityPublic')}</option>
              <option value="UNLISTED">{t('visibilityUnlisted')}</option>
              <option value="PRIVATE">{t('visibilityPrivate')}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">{t('monitoringLabel')}</label>
            <select
              value={monitoringProfile}
              onChange={(e) => setMonitoringProfile(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
            >
              <option value="">{t('monitoringNone')}</option>
              {MONITORING_PROFILES.map((p) => (
                <option key={p.name} value={p.name}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">{t('expiresLabel')}</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
            />
            <p className="text-xs text-zinc-500">{t('expiresHelp')}</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">{t('tagsLabel')}</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={t('tagsPlaceholder')}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
            />
            <p className="text-xs text-zinc-500">{t('tagsHelp')}</p>
          </div>
        </div>
      </section>

      {/* ── Criteria ───────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{t('sectionCriteria')}</h2>

        {/* The key message */}
        <blockquote className="border-l-4 border-zinc-500 pl-4">
          <p className="text-sm font-medium text-zinc-200 italic">{t('criteriaCallout')}</p>
          <p className="mt-1 text-xs text-zinc-500">{t('criteriaHelp')}</p>
        </blockquote>

        {/* Criterion cards */}
        {criteria.length > 0 && (
          <div className="space-y-3">
            {[...supports, ...falsifications, ...watchSignals].map((c) => {
              const style = criterionStyle[c.type];
              return (
                <div key={c.localId} className={`rounded-lg border ${style.border} bg-zinc-900 p-4 space-y-3`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style.badge}`}>
                      {style.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCriterion(c.localId)}
                      className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {t('remove')}
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={c.description}
                    onChange={(e) => updateCriterion(c.localId, { description: e.target.value })}
                    placeholder={t('criterionDescriptionPlaceholder')}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none resize-none"
                  />

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500">{t('criterionRationaleLabel')}</label>
                    <textarea
                      rows={2}
                      value={c.rationale}
                      onChange={(e) => updateCriterion(c.localId, { rationale: e.target.value })}
                      placeholder={t('criterionRationalePlaceholder')}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addCriterion('SUPPORT')}
            className="rounded-full border border-emerald-800 px-4 py-1.5 text-xs text-emerald-400 hover:bg-emerald-900/30 transition-colors"
          >
            {t('addSupport')}
          </button>
          <button
            type="button"
            onClick={() => addCriterion('FALSIFY')}
            className="rounded-full border border-red-800 px-4 py-1.5 text-xs text-red-400 hover:bg-red-900/30 transition-colors"
          >
            {t('addFalsify')}
          </button>
          <button
            type="button"
            onClick={() => addCriterion('WATCH_SIGNAL')}
            className="rounded-full border border-amber-800 px-4 py-1.5 text-xs text-amber-400 hover:bg-amber-900/30 transition-colors"
          >
            {t('addWatch')}
          </button>
        </div>

        {filled > 0 && (
          <p className="text-xs text-zinc-500">
            {filled} criterion{filled !== 1 ? 'a' : ''} defined.{' '}
            {supports.filter(c => c.description.trim()).length} support ·{' '}
            {falsifications.filter(c => c.description.trim()).length} falsify ·{' '}
            {watchSignals.filter(c => c.description.trim()).length} watch
          </p>
        )}
      </section>

      {/* ── Error ──────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ── Actions ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-800 pt-8">
        <button
          type="button"
          disabled={!title.trim() || saving}
          onClick={() => submit(false)}
          className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? t('saving') : t('saveDraft')}
        </button>

        <button
          type="button"
          disabled={!title.trim() || saving}
          onClick={() => submit(true)}
          className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? t('saving') : t('contend')}
        </button>

        <p className="text-xs text-zinc-600">{t('requiresAuth')}</p>
      </div>

    </div>
  );
}
