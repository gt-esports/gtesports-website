import { useState } from 'react';
import { Link, Outlet, useMatch } from 'react-router-dom';
import ContentEditor from '../components/admin/ContentEditor';
import { AboutFields, FAQFields, TeamFields } from '../components/admin/EditorFields';
import type { ContentSection } from '../data/contentSchema';

export default function Admin() {
  const [tab, setTab] = useState<ContentSection>('about');
  const showingContent = useMatch('/admin') !== null;
  return (
    <>
    {/* Keep content drafts mounted while visiting the separate access page. */}
    <section hidden={!showingContent} className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-outfit text-3xl font-bold text-white">Administration</h1>
      <p className="mt-4 text-gray-300">Manage website content and who has admin access.</p>
      <section aria-labelledby="admin-access-heading" className="my-8 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="admin-access-heading" className="font-outfit text-xl font-semibold">Admin access</h2>
          <p className="mt-1 text-sm text-gray-400">Grant or remove permission to manage this website.</p>
        </div>
        <Link to="/admin/access" className="shrink-0 rounded-lg border border-tech-gold/50 px-5 py-3 text-center font-medium text-tech-gold transition hover:bg-tech-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-gold">Manage admin access <span aria-hidden="true">→</span></Link>
      </section>
      <div className="border-t border-white/10 pt-8">
        <h2 className="font-outfit text-2xl font-bold">Site content</h2>
        <p className="mt-2 text-gray-300">Choose a page to edit. Publishing makes changes visible to visitors.</p>
      </div>
      <nav aria-label="Content editors" className="my-8 flex flex-wrap gap-3">
        {([['about', 'About Us'], ['faq', 'FAQs'], ['team', 'Our Team']] as const).map(([section, label]) => (
          <button key={section} type="button" aria-pressed={tab === section} onClick={() => setTab(section)} className={`rounded-lg border px-5 py-3 font-medium transition ${tab === section ? 'border-tech-gold bg-tech-gold text-deep-space' : 'border-white/20 text-gray-300 hover:border-tech-gold'}`}>{label}</button>
        ))}
      </nav>
      <div hidden={tab !== 'about'}><ContentEditor section="about" title="About Us">{(content, update) => <AboutFields content={content} update={update} />}</ContentEditor></div>
      <div hidden={tab !== 'faq'}><ContentEditor section="faq" title="FAQs">{(content, update) => <FAQFields content={content} update={update} />}</ContentEditor></div>
      <div hidden={tab !== 'team'}><ContentEditor section="team" title="Our Team">{(content, update) => <TeamFields content={content} update={update} />}</ContentEditor></div>
    </section>
    <Outlet />
    </>
  );
}
