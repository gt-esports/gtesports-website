import { useEffect, useState } from 'react';
import { fetchApplications, type LeadershipApplication } from '../../lib/leadershipApplications';
import { downloadResume } from '../../lib/resumes';

const fieldClass = 'rounded-lg border border-white/10 bg-deep-space px-4 py-3 text-white';
const labelClass = 'mb-1 block text-sm text-gray-400';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <p className={fieldClass}>{value.trim() || '—'}</p>
    </div>
  );
}

function resumeFileName(application: LeadershipApplication) {
  const name = `${application.first_name} ${application.last_name}`.trim().replace(/[^\w]+/g, '-') || 'resume';
  return `${name}-resume.pdf`;
}

export default function Applications() {
  const [applications, setApplications] = useState<LeadershipApplication[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const selected = applications.find(application => application.id === selectedId);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    void fetchApplications().then(data => {
      if (!active) return;
      setApplications(data);
      setSelectedId(current => current && data.some(application => application.id === current) ? current : data[0]?.id);
    }).catch((err: unknown) => {
      if (active) {
        setApplications([]);
        setSelectedId(undefined);
        setError(err instanceof Error ? err.message : 'Unable to load applications.');
      }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const download = async () => {
    if (!selected?.resume_path || downloading) return;
    setDownloading(true);
    setError('');
    try {
      await downloadResume(selected.resume_path, resumeFileName(selected));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to download this resume.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-3xl font-bold">Applications</h1>
        <p className="mt-2 text-gray-300">Select an applicant to review their submission.</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-red-200">{error}</p>}
      {loading && <p role="status" className="text-gray-300">Loading applications...</p>}
      {!loading && applications.length === 0 && !error && (
        <p className="text-gray-400">No applications have been submitted yet.</p>
      )}
      {!loading && applications.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[minmax(16rem,20rem)_1fr]">
          <aside className="overflow-hidden rounded-xl border border-white/10">
            <h2 className="border-b border-white/10 px-4 py-3 font-outfit text-sm font-semibold uppercase tracking-wider text-gray-400">Applicants</h2>
            <ul className="max-h-[70vh] overflow-y-auto">
              {applications.map(application => {
                const name = `${application.first_name} ${application.last_name}`.trim() || application.email;
                const active = application.id === selectedId;
                return (
                  <li key={application.id} className="border-b border-white/10 last:border-b-0">
                    <button
                      type="button"
                      aria-current={active ? 'true' : undefined}
                      onClick={() => setSelectedId(application.id)}
                      className={`w-full px-4 py-3 text-left transition ${active ? 'bg-tech-gold/15 text-tech-gold' : 'text-white hover:bg-white/5'}`}
                    >
                      <span className="block font-medium">{name}</span>
                      <span className="block truncate text-sm text-gray-400">{application.email}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
          {selected && (
            <section aria-label={`${selected.first_name} ${selected.last_name} application`} className="rounded-xl border border-white/10 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" value={selected.first_name} />
                <Field label="Last name" value={selected.last_name} />
                <Field label="Email" value={selected.email} />
                <Field label="Year" value={selected.year} />
                <Field label="Major" value={selected.major} />
                <Field label="First choice" value={selected.first_choice} />
                <Field label="Second choice" value={selected.second_choice} />
                <div className="sm:col-span-2">
                  <span className={labelClass}>Portfolio / GitHub</span>
                  {selected.portfolio_url.trim() ? (
                    <a href={selected.portfolio_url} target="_blank" rel="noreferrer" className={`${fieldClass} block break-all text-tech-gold underline underline-offset-4`}>
                      {selected.portfolio_url}
                    </a>
                  ) : <p className={fieldClass}>—</p>}
                </div>
                <div className="sm:col-span-2">
                  <span className={labelClass}>Why do you want to join?</span>
                  <p className={`${fieldClass} whitespace-pre-wrap`}>{selected.why_join.trim() || '—'}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className={labelClass}>Resume</span>
                  {selected.resume_path ? (
                    <button
                      type="button"
                      onClick={() => void download()}
                      disabled={downloading}
                      className="rounded-lg border border-tech-gold/50 px-5 py-3 font-medium text-tech-gold transition hover:bg-tech-gold/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {downloading ? 'Preparing download...' : `Download ${selected.first_name}'s resume`}
                    </button>
                  ) : <p className={fieldClass}>No resume submitted</p>}
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
