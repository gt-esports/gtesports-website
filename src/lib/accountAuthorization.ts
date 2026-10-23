import type { Account, ApiSession } from './esportsApiClient';

export function createAccountAuthorization<S extends ApiSession>(options: {
  load: (session: S, signal: AbortSignal) => Promise<Account>;
  reset: (session: S | null) => void;
  authorize: (account: Account) => void;
  fail: (error: unknown) => void;
  settle: () => void;
}) {
  let active = true;
  let revision = 0;
  let current: S | null = null;
  let controller: AbortController | undefined;
  let deferred: ReturnType<typeof setTimeout> | undefined;

  const cancel = () => {
    ++revision;
    controller?.abort();
    clearTimeout(deferred);
  };
  return {
    setSession(session: S | null) {
      if (!active) return;
      cancel();
      current = session;
      options.reset(session);
      const request = revision;
      // Leave the synchronous Supabase auth callback before making requests.
      deferred = setTimeout(() => {
        if (!active || request !== revision) return;
        if (!session) { options.settle(); return; }
        controller = new AbortController();
        void options.load(session, controller.signal)
          .then(account => { if (active && request === revision) options.authorize(account); })
          .catch((error: unknown) => { if (active && request === revision) options.fail(error); })
          .finally(() => { if (active && request === revision) options.settle(); });
      }, 0);
    },
    deny(userId: string, error: unknown) {
      if (!active || current?.user.id !== userId) return;
      cancel();
      options.reset(current);
      options.fail(error);
      options.settle();
    },
    dispose() { active = false; cancel(); },
  };
}
