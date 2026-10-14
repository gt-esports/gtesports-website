import { useEffect, useState, type ReactNode } from 'react';
import type { ContentMap, ContentSection } from '../../data/contentSchema';
import { defaultContent } from '../../data/siteContent';
import { fetchContent, publishContent } from '../../lib/siteContent';

export default function ContentEditor<K extends ContentSection>({ section, title, children }: {
  section: K; title: string;
  children: (content: ContentMap[K], update: (content: ContentMap[K]) => void) => ReactNode;
}) {
  const [draft, setDraft] = useState(defaultContent[section]);
  const [saved, setSaved] = useState(defaultContent[section]);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(null); setNotice('');
    void fetchContent(section).then(result => {
      if (!active) return;
      setDraft(result.content); setSaved(result.content); setRevision(result.revision);
    }).catch((err: unknown) => {
      if (active) setError(err instanceof Error ? err.message : 'Unable to load content.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [section, reload]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const publish = async () => {
    setSaving(true); setError(null); setNotice('');
    try {
      const next = await publishContent(section, draft, revision);
      setSaved(draft); setRevision(next); setNotice(`${title} published successfully.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to publish content.');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={event => { event.preventDefault(); void publish(); }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-outfit text-2xl font-bold">{title}</h2>
        <a href={section === 'team' ? '/ourteam' : '/about'} target="_blank" rel="noreferrer" className="text-sm text-tech-gold underline">View public page ↗</a>
      </div>
      {loading && <p role="status" className="text-gray-300">Loading published content...</p>}
      {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-red-200">{error}</p>}
      {notice && <p role="status" className="text-green-300">{notice}</p>}
      {!loading && (!error || dirty || revision > 0) && (
        <fieldset disabled={saving} className="space-y-6 disabled:opacity-60">
          {children(draft, value => { setDraft(value); setNotice(''); })}
          <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
            <button disabled={!dirty || saving} className="rounded-lg bg-tech-gold px-5 py-3 font-semibold text-deep-space transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Publishing...' : 'Publish changes'}</button>
            <span className="text-sm text-gray-400">{dirty ? 'Unpublished changes' : 'Up to date'}</span>
          </div>
        </fieldset>
      )}
      <button type="button" disabled={loading || saving} onClick={() => setReload(value => value + 1)} className="text-sm text-gray-300 underline disabled:opacity-50">{dirty ? 'Discard edits and reload published content' : 'Reload published content'}</button>
    </form>
  );
}
