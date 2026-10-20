import { useEffect, useRef, useState } from 'react';
import { contactGroups, contactStatuses, emptyContact, exportContactCsv, parseContactCsv, type ContactInput, type MarketingContact } from '../../data/marketingContacts';
import { deleteContact, fetchContacts, importContacts, saveContact } from '../../lib/marketingContacts';

const buttonClass = 'rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-200 transition hover:border-tech-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold disabled:cursor-not-allowed disabled:opacity-50';
const inputClass = 'mt-2 w-full min-w-0 rounded-lg border border-white/20 bg-deep-space px-3 py-2 text-white focus:border-tech-gold focus:outline-none focus:ring-1 focus:ring-tech-gold';
const primaryClass = 'rounded-lg bg-tech-gold px-5 py-3 font-semibold text-deep-space hover:bg-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-gold disabled:cursor-not-allowed disabled:opacity-50';

export default function MarketingContacts() {
  const [contacts, setContacts] = useState<MarketingContact[]>([]);
  const [draft, setDraft] = useState<ContactInput>({ ...emptyContact });
  const [editing, setEditing] = useState<MarketingContact>();
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [group, setGroup] = useState('all');
  const [confirmId, setConfirmId] = useState<string>();
  const [preview, setPreview] = useState<ReturnType<typeof parseContactCsv>>();
  const emailInput = useRef<HTMLInputElement>(null);
  const busy = loading || saving;

  useEffect(() => {
    let active = true;
    setLoading(true); setLoaded(false); setError('');
    void fetchContacts().then(data => {
      if (active) { setContacts(data); setLoaded(true); }
    }).catch((err: unknown) => {
      if (active) { setContacts([]); setError(err instanceof Error ? err.message : 'Unable to load contacts.'); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reload]);

  useEffect(() => {
    if (formOpen) emailInput.current?.focus();
  }, [formOpen, editing]);

  const update = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => setDraft(current => ({ ...current, [key]: value }));
  const closeForm = () => { setFormOpen(false); setEditing(undefined); setDraft({ ...emptyContact }); };
  const openForm = (contact?: MarketingContact) => {
    if (formOpen && !window.confirm('Discard the current contact edits?')) return;
    setEditing(contact); setDraft(contact ? { ...contact } : { ...emptyContact });
    setFormOpen(true); setError(''); setNotice(''); setConfirmId(undefined);
  };
  // Warn on browser close/reload while a contact form contains edits.
  const dirty = formOpen && JSON.stringify(draft) !== JSON.stringify(editing ?? emptyContact);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const save = async () => {
    if (busy || !loaded) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const saved = await saveContact(draft, editing);
      setContacts(current => [...current.filter(contact => contact.id !== saved.id), saved].sort((a, b) => a.email.localeCompare(b.email)));
      closeForm(); setNotice(`Saved ${saved.email}.`);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Unable to save contact.'); }
    finally { setSaving(false); }
  };
  const remove = async (contact: MarketingContact) => {
    if (busy) return;
    setSaving(true); setError(''); setNotice('');
    try {
      await deleteContact(contact);
      setContacts(current => current.filter(item => item.id !== contact.id));
      setConfirmId(undefined); setNotice(`Deleted ${contact.email}.`);
      if (editing?.id === contact.id) closeForm();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Unable to delete contact.'); }
    finally { setSaving(false); }
  };
  const readImport = async (file: File) => {
    if (busy) return;
    setSaving(true); setError(''); setNotice(''); setPreview(undefined);
    try {
      if (file.size > 1024 * 1024) throw new Error('Choose a CSV file under 1 MB.');
      setPreview(parseContactCsv(await file.text()));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Unable to read CSV.'); }
    finally { setSaving(false); }
  };
  const confirmImport = async () => {
    if (busy || !preview) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const added = await importContacts(preview.contacts);
      setNotice(`Imported ${added} contacts. Skipped ${preview.duplicates + preview.contacts.length - added} duplicate emails; existing records were preserved.`);
      setPreview(undefined); setLoading(true); setReload(value => value + 1);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Unable to import contacts.'); }
    finally { setSaving(false); }
  };

  const term = search.trim().toLowerCase();
  const visible = contacts.filter(contact => (status === 'all' || contact.status === status)
    && (group === 'all' || contact.contact_group === group || (group !== 'both' && contact.contact_group === 'both'))
    && [contact.email, contact.name, contact.organization, contact.category, contact.notes].some(value => value.toLowerCase().includes(term)));
  const download = () => {
    const url = URL.createObjectURL(new Blob(['\uFEFF', exportContactCsv(visible)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'marketing-contacts.csv';
    link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-outfit text-3xl font-bold">Marketing contacts</h1>
        <p className="mt-2 text-gray-300">Manage newsletter subscribers and alumni in one place. Contacts can belong to either group or both. Only admins can access this list.</p>
      </div>
      <button type="button" disabled={busy || !loaded} onClick={() => openForm()} className={primaryClass}>+ Add contact</button>
    </div>
    {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-red-200">{error}</p>}
    {notice && <p role="status" className="text-green-300">{notice}</p>}

    {formOpen && <form onSubmit={event => { event.preventDefault(); void save(); }} className="rounded-xl border border-tech-gold/30 bg-white/[0.03] p-5">
      <h2 className="font-outfit text-xl font-semibold">{editing ? 'Edit contact' : 'New contact'}</h2>
      <fieldset disabled={busy || !loaded} className="mt-4 space-y-4 disabled:opacity-60">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Email<input ref={emailInput} type="email" required maxLength={254} autoComplete="off" value={draft.email} onChange={event => update('email', event.target.value)} className={inputClass} /></label>
          {([['name', 'Name', 200], ['organization', 'Organization', 200], ['category', 'Category', 100]] as const).map(([key, label, max]) => <label key={key} className="text-sm font-medium">{label} <span className="text-gray-400">(optional)</span><input maxLength={max} value={draft[key]} onChange={event => update(key, event.target.value)} className={inputClass} /></label>)}
          <div className="text-sm font-medium"><label htmlFor="contact-group">Contact group</label><select id="contact-group" value={draft.contact_group} onChange={event => {
            const selected = contactGroups.find(([key]) => key === event.target.value);
            if (selected) update('contact_group', selected[0]);
          }} className={inputClass}>{contactGroups.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
          <div className="text-sm font-medium"><label htmlFor="contact-status">Email status</label><select id="contact-status" value={draft.status} onChange={event => {
            const selected = contactStatuses.find(([key]) => key === event.target.value);
            if (selected) update('status', selected[0]);
          }} className={inputClass}>{contactStatuses.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
          <label className="text-sm font-medium">Last contacted <span className="text-gray-400">(optional)</span><input type="date" value={draft.last_contacted ?? ''} onChange={event => update('last_contacted', event.target.value || null)} className={inputClass} /></label>
        </div>
        <div className="text-sm font-medium"><label htmlFor="contact-notes">Notes <span className="text-gray-400">(optional)</span></label><textarea id="contact-notes" rows={3} maxLength={5000} value={draft.notes} onChange={event => update('notes', event.target.value)} className={inputClass} /></div>
        <div className="flex flex-wrap gap-3"><button className={primaryClass}>{saving ? 'Saving…' : 'Save contact'}</button><button type="button" onClick={() => { if (!dirty || window.confirm('Discard the current contact edits?')) closeForm(); }} className={buttonClass}>Cancel</button></div>
      </fieldset>
    </form>}

    <details className="rounded-xl border border-white/10 p-5">
      <summary className="cursor-pointer font-medium text-tech-gold">Import contacts from a spreadsheet</summary>
      <div className="mt-4 space-y-4">
        <p id="contacts-import-help" className="text-sm text-gray-300">Export your spreadsheet as CSV with an <strong>email</strong> column. Optional columns: name, organization, category, contact_group, status, last_contacted, notes. Groups use newsletter, alumni, or both (default: newsletter). Statuses use active, unsubscribed, or do_not_contact (default: active). Dates use YYYY-MM-DD. Import up to 500 rows (1 MB) at a time. Existing email addresses are skipped, including their group and unsubscribe status.</p>
        <label className="block text-sm font-medium">Choose CSV<input type="file" accept=".csv,text/csv" disabled={busy || !loaded} aria-describedby="contacts-import-help" onChange={event => {
          const file = event.target.files?.[0]; event.target.value = ''; if (file) void readImport(file);
        }} className="mt-2 block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white disabled:opacity-50" /></label>
        {preview && <div className="space-y-3 rounded-lg bg-white/5 p-4">
          <p>{preview.contacts.length} unique contacts ready to import; {preview.duplicates} duplicate rows skipped.</p>
          <ul className="space-y-1 text-sm text-gray-300">{preview.contacts.slice(0, 5).map(contact => <li key={contact.email} className="break-words">{contact.email} — {contactGroups.find(([key]) => key === contact.contact_group)?.[1]} · {contactStatuses.find(([key]) => key === contact.status)?.[1]}</li>)}</ul>
          {preview.contacts.length > 5 && <p className="text-sm text-gray-400">And {preview.contacts.length - 5} more.</p>}
          <div className="flex flex-wrap gap-3"><button type="button" disabled={busy || !loaded} onClick={() => void confirmImport()} className={primaryClass}>{saving ? 'Importing…' : 'Import contacts'}</button><button type="button" disabled={busy} onClick={() => setPreview(undefined)} className={buttonClass}>Cancel import</button></div>
        </div>}
      </div>
    </details>

    <div className="flex flex-wrap items-end gap-4">
      <label className="w-full text-sm font-medium">Search contacts<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Email, name, organization, category, or notes" className={inputClass} /></label>
      <div className="min-w-0 flex-1 basis-full text-sm font-medium sm:basis-56"><label htmlFor="contact-group-filter">Filter by group</label><select id="contact-group-filter" value={group} onChange={event => setGroup(event.target.value)} className={inputClass}><option value="all">All groups</option>{contactGroups.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
      <div className="min-w-0 flex-1 basis-full text-sm font-medium sm:basis-48"><label htmlFor="contact-status-filter">Filter by status</label><select id="contact-status-filter" value={status} onChange={event => setStatus(event.target.value)} className={inputClass}><option value="all">All statuses</option>{contactStatuses.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
      <button type="button" disabled={busy} onClick={() => { setConfirmId(undefined); setReload(value => value + 1); }} className={buttonClass}>Refresh list</button>
      <button type="button" disabled={busy || !loaded || !visible.length} onClick={download} className={buttonClass}>Export shown contacts</button>
    </div>
    {loading ? <p role="status" className="text-gray-300">Loading contacts…</p> : loaded && <>
      <p role="status" className="text-sm text-gray-400">Showing {visible.length} of {contacts.length} contacts</p>
      {!visible.length && <p className="rounded-xl border border-dashed border-white/20 p-8 text-center text-gray-300">{contacts.length ? 'No contacts match your search or filter.' : 'No contacts yet. Add a contact or import your spreadsheet to get started.'}</p>}
      <ul className="space-y-3">{visible.map(contact => <li key={contact.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3"><h2 className="break-words font-semibold">{contact.name || contact.email}</h2><span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200">{contactGroups.find(([key]) => key === contact.contact_group)?.[1]}</span><span className={`rounded-full px-3 py-1 text-xs ${contact.status !== 'active' ? 'bg-red-400/15 text-red-200' : 'bg-tech-gold/10 text-tech-gold'}`}>{contactStatuses.find(([key]) => key === contact.status)?.[1]}</span></div>
            {contact.name && <p className="mt-1 break-words text-sm text-gray-300">{contact.email}</p>}
            {(contact.organization || contact.category) && <p className="mt-2 break-words text-sm text-gray-400">{[contact.organization, contact.category].filter(Boolean).join(' · ')}</p>}
            <p className="mt-2 text-xs text-gray-400">Last contacted: {contact.last_contacted || 'Not recorded'}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-start gap-2"><button type="button" disabled={busy} onClick={() => openForm(contact)} aria-label={`Edit ${contact.email}`} className={buttonClass}>Edit</button><button type="button" disabled={busy} onClick={() => setConfirmId(contact.id)} aria-label={`Delete ${contact.email}`} className={buttonClass}>Delete</button></div>
        </div>
        {contact.notes && <details className="mt-4 text-sm"><summary className="cursor-pointer text-gray-300">Notes</summary><p className="mt-2 whitespace-pre-wrap break-words text-gray-400">{contact.notes}</p></details>}
        {confirmId === contact.id && <div className="mt-4 space-y-3 border-t border-white/10 pt-4"><p className="break-words text-sm text-red-200">Permanently delete {contact.email} and its notes?</p><div className="flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={() => void remove(contact)} className="rounded-lg bg-red-400 px-4 py-2 text-sm font-semibold text-deep-space disabled:opacity-50">Confirm deletion</button><button type="button" disabled={busy} onClick={() => setConfirmId(undefined)} className={buttonClass}>Cancel</button></div></div>}
      </li>)}</ul>
    </>}
  </div>;
}
