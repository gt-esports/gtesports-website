export interface ApiSession { user: { id: string }; access_token: string }
export interface Account {
  user: { id: string; email: string | null };
  profile: { id: string; full_name: string | null; created_at: string | null } | null;
  role: 'member' | 'admin';
}
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  session?: ApiSession;
  expectedUserId?: string;
}
export class ApiError extends Error {
  constructor(readonly code: string, message: string, readonly status = 0) {
    super(message);
    this.name = 'ApiError';
  }
}
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function apiBaseUrl(value: unknown): string {
  try {
    if (typeof value !== 'string' || !value.trim() || /[?#]/.test(value)) throw new Error();
    const url = new URL(value);
    const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) ||
        url.username || url.password || url.search || url.hash) throw new Error();
    return url.toString().replace(/\/+$/, '');
  } catch {
    throw new ApiError('configuration', 'Account services are not configured. Please contact the site team.');
  }
}

function responseError(status: number, payload: unknown, write: boolean): ApiError {
  const code = isRecord(payload) && isRecord(payload.error) && typeof payload.error.code === 'string'
    ? payload.error.code : 'unavailable';
  if (status === 401) return new ApiError('unauthorized', 'Your session could not be verified. Sign in again and reload the page.', status);
  if (status === 403) return new ApiError('forbidden', 'Your admin access could not be verified. Reload the page and try again.', status);
  if (status === 409 && code === 'duplicate_contact') return new ApiError(code, 'A contact with this email already exists. Search for it to edit the existing record.', status);
  if (status === 409 && code === 'revision_conflict') return new ApiError(code, 'This contact changed. Refresh the list and reopen the contact before making changes.', status);
  if (status === 422) return new ApiError('validation_error', 'Check the contact details and try again. Your edits are still here.', status);
  return new ApiError(code, write
    ? 'Unable to confirm this change. Refresh the contact list before trying again.'
    : 'Account services are unavailable. Please reload and try again.', status);
}

export function createApiClient(dependencies: {
  baseUrl: () => unknown;
  getSession: () => Promise<ApiSession | null>;
  fetch?: typeof fetch;
  timeoutMs?: number;
  onAccessDenied?: (userId: string, error: ApiError) => void;
}) {
  return {
    async request(path: string, options: ApiRequestOptions = {}): Promise<{ data: unknown; userId: string; status: number }> {
      const base = apiBaseUrl(dependencies.baseUrl());
      if (!path.startsWith('/v1/') || path.includes('..') || path.includes('#')) throw new ApiError('invalid_path', 'Invalid account service request.');
      const session = options.session ?? await dependencies.getSession();
      if (!session?.access_token || !session.user.id) throw new ApiError('unauthorized', 'Sign in again to access account services.', 401);
      if (options.expectedUserId && session.user.id !== options.expectedUserId) throw new ApiError('account_changed', 'Your account changed. Reload the page before continuing.');
      const controller = new AbortController();
      const abort = () => controller.abort();
      options.signal?.addEventListener('abort', abort, { once: true });
      if (options.signal?.aborted) controller.abort();
      const timeout = setTimeout(abort, dependencies.timeoutMs ?? 20_000);
      const method = options.method ?? 'GET';
      const write = method !== 'GET';
      try {
        const response = await (dependencies.fetch ?? fetch)(`${base}${path}`, {
          method, signal: controller.signal, credentials: 'omit', redirect: 'error', cache: 'no-store',
          headers: { Accept: 'application/json', Authorization: `Bearer ${session.access_token}`, ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }) },
          ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
        });
        const data: unknown = response.status === 204 ? null : await response.json().catch(() => null);
        if (!response.ok) {
          const error = responseError(response.status, data, write);
          if (!options.session && [401, 403].includes(response.status)) dependencies.onAccessDenied?.(session.user.id, error);
          throw error;
        }
        if (!options.session && (await dependencies.getSession())?.user.id !== session.user.id) {
          throw new ApiError('account_changed', 'Your account changed. Reload the page before continuing.');
        }
        if (controller.signal.aborted) throw new DOMException('Request cancelled', 'AbortError');
        return { data, userId: session.user.id, status: response.status };
      } catch (error) {
        if (options.signal?.aborted) throw new DOMException('Request cancelled', 'AbortError');
        if (error instanceof ApiError) throw error;
        throw responseError(controller.signal.aborted ? 504 : 503, null, write);
      } finally {
        clearTimeout(timeout);
        options.signal?.removeEventListener('abort', abort);
      }
    },
  };
}
export type ApiClient = ReturnType<typeof createApiClient>;

export async function fetchAccount(api: ApiClient, session: ApiSession, signal: AbortSignal): Promise<Account> {
  const { data } = await api.request('/v1/me', { session, signal });
  if (!isRecord(data) || !isRecord(data.user) || data.user.id !== session.user.id ||
      !(data.user.email === null || typeof data.user.email === 'string') ||
      (data.role !== 'member' && data.role !== 'admin') ||
      !(data.profile === null || (isRecord(data.profile) && data.profile.id === session.user.id &&
        (data.profile.full_name === null || typeof data.profile.full_name === 'string') &&
        (data.profile.created_at === null || (typeof data.profile.created_at === 'string' && Number.isFinite(Date.parse(data.profile.created_at))))))) {
    throw new ApiError('invalid_response', 'Unable to verify your account. Please reload and try again.');
  }
  return {
    user: { id: session.user.id, email: data.user.email }, role: data.role,
    profile: data.profile === null ? null : {
      id: session.user.id, full_name: data.profile.full_name as string | null, created_at: data.profile.created_at as string | null,
    },
  };
}
