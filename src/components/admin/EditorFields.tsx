import { useId } from 'react';
import type { AboutContent, FAQItem, TeamContent, TeamMember } from '../../data/contentSchema';
import { teamDepartments } from '../../data/contentSchema';
import HeadshotUpload from './HeadshotUpload';

const buttonClass = 'rounded-lg border border-white/20 px-3 py-2 text-sm text-gray-200 hover:border-tech-gold hover:text-tech-gold disabled:opacity-30';

function Field({ label, value, onChange, multiline = false, optional = false, hint }: {
  label: string; value: string; onChange: (value: string) => void; multiline?: boolean; optional?: boolean; hint?: string;
}) {
  const id = useId();
  const props = { id, value, required: !optional, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), className: 'mt-2 w-full rounded-lg border border-white/20 bg-deep-space px-3 py-2 text-white focus:border-tech-gold focus:outline-none focus:ring-1 focus:ring-tech-gold', 'aria-describedby': hint ? `${id}-hint` : undefined };
  return <div><label htmlFor={id} className="text-sm font-medium text-gray-200">{label}{optional && ' (optional)'}</label>
    {multiline ? <textarea {...props} rows={4} /> : <input {...props} />}
    {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>;
}

function move<T>(items: T[], index: number, direction: number): T[] {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= items.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
function Actions({ label, index, count, onMove, onRemove }: {
  label: string; index: number; count: number; onMove: (direction: number) => void; onRemove: () => void;
}) {
  return <div className="flex flex-wrap gap-2">
    <button className={buttonClass} type="button" disabled={index === 0} aria-label={`Move ${label} up`} onClick={() => onMove(-1)}>↑ Up</button>
    <button className={buttonClass} type="button" disabled={index === count - 1} aria-label={`Move ${label} down`} onClick={() => onMove(1)}>↓ Down</button>
    <button className={buttonClass} type="button" aria-label={`Remove ${label}`} onClick={onRemove}>Remove</button>
  </div>;
}

export function AboutFields({ content, update }: { content: AboutContent; update: (content: AboutContent) => void }) {
  const fields: [keyof AboutContent, string][] = [
    ['whoBody', 'Who we are'],
    ['valuesBody', 'What we stand for'],
    ['updatesBody', 'Stay updated'],
  ];
  return <>{fields.map(([key, label]) => <Field key={key} label={label} value={content[key]} multiline onChange={value => update({ ...content, [key]: value })} />)}</>;
}

export function FAQFields({ content, update }: { content: FAQItem[]; update: (content: FAQItem[]) => void }) {
  return <div className="space-y-4">
    <p className="text-sm text-gray-400">Questions appear in this order. Answers support links using [label](https://example.com) or [Games](/games).</p>
    {content.map((faq, index) => <div key={faq.id} className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <Field label={`Question ${index + 1}`} value={faq.question} onChange={question => update(content.map(item => item.id === faq.id ? { ...item, question } : item))} />
      <Field label="Answer" value={faq.answer} multiline onChange={answer => update(content.map(item => item.id === faq.id ? { ...item, answer } : item))} />
      <Actions label={faq.question || `question ${index + 1}`} index={index} count={content.length} onMove={direction => update(move(content, index, direction))} onRemove={() => update(content.filter(item => item.id !== faq.id))} />
    </div>)}
    {!content.length && <p className="text-gray-400">No FAQs. Add a question to get started.</p>}
    <button type="button" className={buttonClass} onClick={() => update([...content, { id: crypto.randomUUID(), question: '', answer: '' }])}>+ Add question</button>
  </div>;
}

function Members({ content, update }: { content: TeamMember[]; update: (content: TeamMember[]) => void }) {
  return <div className="space-y-3">
    {content.map((member, index) => <details key={member.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
      <summary className="cursor-pointer font-medium text-gray-200">{member.name || 'New member'} <span className="text-sm text-gray-400">— {member.position || 'Add a role'}</span></summary>
      <div className="mt-4 space-y-4">
        <HeadshotUpload image={member.image} name={member.name} onChange={image => update(content.map(item => item.id === member.id ? { ...item, image } : item))} />
        <div className="grid gap-4 sm:grid-cols-2">
          {([['name', 'Name'], ['position', 'Role'], ['linkedinUrl', 'LinkedIn URL']] as const).map(([key, label]) => <Field key={key} label={label} value={member[key]} optional={key === 'linkedinUrl'} hint={key === 'linkedinUrl' ? 'Use the full URL, including https://.' : undefined} onChange={value => update(content.map(item => item.id === member.id ? { ...item, [key]: value } : item))} />)}
        </div>
        <Actions label={member.name || 'member'} index={index} count={content.length} onMove={direction => update(move(content, index, direction))} onRemove={() => update(content.filter(item => item.id !== member.id))} />
      </div>
    </details>)}
    {!content.length && <p className="text-sm text-gray-400">No members in this group.</p>}
    <button type="button" className={buttonClass} onClick={() => update([...content, { id: crypto.randomUUID(), name: '', position: '', image: '', linkedinUrl: '' }])}>+ Add member</button>
  </div>;
}

export function TeamFields({ content, update }: { content: TeamContent; update: (content: TeamContent) => void }) {
  return <>
    <Field label="Team introduction" value={content.introduction} multiline onChange={introduction => update({ ...content, introduction })} />
    <h3 className="font-outfit text-xl font-semibold">Executives</h3>
    <Members content={content.executives} update={executives => update({ ...content, executives })} />
    <h3 className="font-outfit text-xl font-semibold">Departments</h3>
    {teamDepartments.map(({ id, title }) => <div key={id} className="space-y-5 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h4 className="font-outfit text-lg font-semibold">{title}</h4>
      <Members content={content.departments.find(department => department.id === id)?.members ?? []} update={members => update({ ...content, departments: content.departments.map(item => item.id === id ? { ...item, members } : item) })} />
    </div>)}
  </>;
}
