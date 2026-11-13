import { useState } from 'react';
import { Link } from 'react-router-dom';
import ContentEditor from '../components/admin/ContentEditor';
import { AboutFields, FAQFields, TeamFields } from '../components/admin/EditorFields';
import type { ContentSection } from '../data/contentSchema';

export default function AdminContentPage() {
  const [tab, setTab] = useState<ContentSection>('about');

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <Link to="/admin" className="mb-8 inline-block text-sm text-tech-gold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-gold"><span aria-hidden="true">← </span>Administration</Link>
      <h1 className="font-outfit text-3xl font-bold text-white">Site content</h1>
      <p className="mt-4 text-gray-300">Choose a page to edit. Publishing makes changes visible to visitors.</p>
      <nav aria-label="Content editors" className="my-8 flex flex-wrap gap-3">
        {([['about', 'About Us'], ['faq', 'FAQs'], ['team', 'Leadership']] as const).map(([section, label]) => (
          <button key={section} type="button" aria-pressed={tab === section} onClick={() => setTab(section)} className={`rounded-lg border px-5 py-3 font-medium transition ${tab === section ? 'border-tech-gold bg-tech-gold text-deep-space' : 'border-white/20 text-gray-300 hover:border-tech-gold'}`}>{label}</button>
        ))}
      </nav>
      <div hidden={tab !== 'about'}><ContentEditor section="about" title="About Us">{(content, update) => <AboutFields content={content} update={update} />}</ContentEditor></div>
      <div hidden={tab !== 'faq'}><ContentEditor section="faq" title="FAQs">{(content, update) => <FAQFields content={content} update={update} />}</ContentEditor></div>
      <div hidden={tab !== 'team'}><ContentEditor section="team" title="Leadership">{(content, update) => <TeamFields content={content} update={update} />}</ContentEditor></div>
    </section>
  );
}
