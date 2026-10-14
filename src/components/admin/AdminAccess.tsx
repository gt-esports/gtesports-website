import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAdmins, grantAdmin, revokeAdmin, type AdminAccount } from '../../lib/adminAccess';

const buttonClass = 'rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-300 transition hover:border-tech-gold disabled:cursor-not-allowed disabled:opacity-50';

export default function AdminAccess() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const busy = loading || saving;

  useEffect(() => {
    let active = true;
    setLoading(true); setError(null); setAdmins([]); setConfirmId(null);
    void fetchAdmins().then(data => {
      if (active) setAdmins(data);
    }).catch((err: unknown) => {
      if (active) setError(err instanceof Error ? err.message : 'Unable to load admins.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reload]);

  const changeAccess = async (account?: AdminAccount) => {
    if (busy) return;
    setSaving(true); setError(null); setNotice('');
    const targetEmail = email.trim();
    try {
      if (account) {
        await revokeAdmin(account.user_id);
        setNotice(`Admin access removed for ${account.email ?? account.full_name ?? account.user_id}.`);
      } else {
        await grantAdmin(targetEmail);
        setEmail('');
        setNotice(`Admin access granted to ${targetEmail}.`);
      }
      setLoading(true);
      setConfirmId(null);
      setReload(value => value + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to change admin access.');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-3xl font-bold">Admin access</h1>
        <p className="mt-2 text-gray-300">Admins can publish site content and manage other admins. Access changes take effect immediately.</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-red-200">{error}</p>}
      {notice && <p role="status" className="text-green-300">{notice}</p>}
      <form onSubmit={event => { event.preventDefault(); void changeAccess(); }} className="rounded-xl border border-white/10 p-5">
        <fieldset disabled={busy} className="space-y-3 disabled:opacity-60">
          <label htmlFor="admin-email" className="block font-medium">Grant admin access</label>
          <p id="admin-email-help" className="text-sm text-gray-400">Enter the email of an existing account with a verified email address. Ask new admins to reload the app after access is granted.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input id="admin-email" type="email" required maxLength={254} autoComplete="off" aria-describedby="admin-email-help" value={email} onChange={event => setEmail(event.target.value)} placeholder="Email address" className="min-w-0 flex-1 rounded-lg border border-white/20 bg-deep-space px-4 py-3 text-white focus:border-tech-gold focus:outline-none" />
            <button disabled={busy || !email.trim()} className="rounded-lg bg-tech-gold px-5 py-3 font-semibold text-deep-space transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50">{saving && !confirmId ? 'Granting...' : 'Grant access'}</button>
          </div>
        </fieldset>
      </form>
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-outfit text-xl font-semibold">Current admins</h2>
          <button type="button" disabled={busy} onClick={() => setReload(value => value + 1)} className={buttonClass}>Refresh list</button>
        </div>
        {loading && <p role="status" className="text-gray-300">Loading admins...</p>}
        {!loading && admins.length > 0 && <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
          {admins.map(account => (
            <li key={account.user_id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="break-words font-medium">{account.full_name || account.email || account.user_id}{account.user_id === user?.id && <span className="ml-2 text-sm text-tech-gold">(You)</span>}</p>
                {account.email && <p className="break-words text-sm text-gray-400">{account.email}</p>}
              </div>
              {account.user_id === user?.id ? <span className="text-sm text-gray-400">Your access cannot be removed here.</span> : confirmId === account.user_id ? (
                <div className="space-y-2 sm:max-w-xs">
                  <p className="text-sm text-gray-300">Remove admin access? They will keep their member account.</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => void changeAccess(account)} aria-label={`Confirm removal of admin access for ${account.email ?? account.full_name ?? account.user_id}`} className="rounded-lg bg-red-400 px-4 py-2 text-sm font-semibold text-deep-space disabled:opacity-50">{saving ? 'Removing...' : 'Confirm removal'}</button>
                    <button type="button" disabled={busy} onClick={() => setConfirmId(null)} className={buttonClass}>Cancel</button>
                  </div>
                </div>
              ) : <button type="button" disabled={busy} onClick={() => setConfirmId(account.user_id)} aria-label={`Remove admin access for ${account.email ?? account.full_name ?? account.user_id}`} className={buttonClass}>Remove access</button>}
            </li>
          ))}
        </ul>}
      </div>
    </div>
  );
}
