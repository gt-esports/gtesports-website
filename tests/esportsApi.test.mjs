import assert from 'node:assert/strict';
import test from 'node:test';
import { importTypescript } from './helpers/importTypescript.mjs';

const { createApiClient, apiBaseUrl, fetchAccount, ApiError } = await importTypescript(new URL('../src/lib/esportsApiClient.ts', import.meta.url));
const { createAccountAuthorization } = await importTypescript(new URL('../src/lib/accountAuthorization.ts', import.meta.url));
const session = { user: { id: 'account-a' }, access_token: 'token-a' };
const account = { user: { id: 'account-a', email: 'a@example.com' }, profile: null, role: 'admin' };
const client = (overrides = {}) => createApiClient({ baseUrl: () => 'https://api.example.com/base/', getSession: async () => session, ...overrides });
const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
const tick = () => new Promise(resolve => setTimeout(resolve, 5));

test('API configuration accepts HTTPS and loopback HTTP, rejects unsafe or missing destinations', () => {
  for (const url of ['https://api.example.com', 'http://localhost:8000', 'http://127.0.0.1:8000', 'http://[::1]:8000']) assert.equal(apiBaseUrl(url), url);
  for (const url of [undefined, '', '/api', 'http://api.example.com', 'http://localhost.evil.test', 'ftp://example.com', 'https://user:pass@example.com', 'https://example.com?token=x', 'https://example.com#x', 'https://example.com?', 'https://example.com#']) {
    assert.throws(() => apiBaseUrl(url), error => error.code === 'configuration');
  }
});

test('missing API config and session fail closed without contacting a fallback', async () => {
  let calls = 0;
  const fetch = async () => { calls++; return json({}); };
  await assert.rejects(client({ baseUrl: () => '', fetch }).request('/v1/me'), { code: 'configuration' });
  await assert.rejects(client({ getSession: async () => null, fetch }).request('/v1/main/marketing-contacts'), { code: 'unauthorized' });
  assert.equal(calls, 0);
});

test('each contacts request reads the latest token, omits cookies, disables redirects and caches', async () => {
  let token = 0;
  const requests = [];
  const api = client({
    getSession: async () => ({ ...session, access_token: `fresh-${++token}` }),
    fetch: async (url, options) => { requests.push({ url, options }); return json({ contacts: [] }); },
  });
  await api.request('/v1/main/marketing-contacts');
  await api.request('/v1/main/marketing-contacts');
  assert.deepEqual(requests.map(r => r.options.headers.Authorization), ['Bearer fresh-1', 'Bearer fresh-3']);
  assert.equal(requests[0].url, 'https://api.example.com/base/v1/main/marketing-contacts');
  assert.equal(requests[0].options.credentials, 'omit');
  assert.equal(requests[0].options.redirect, 'error');
  assert.equal(requests[0].options.cache, 'no-store');
});

test('contacts response and pagination cannot survive a switch to another account', async () => {
  let current = session;
  let calls = 0;
  const api = client({ getSession: async () => current, fetch: async () => { calls++; current = { ...session, user: { id: 'b' } }; return json({}); } });
  await assert.rejects(api.request('/v1/main/marketing-contacts'), { code: 'account_changed' });
  await assert.rejects(api.request('/v1/main/marketing-contacts', { expectedUserId: 'account-a' }), { code: 'account_changed' });
  assert.equal(calls, 1);
});

test('401 and 403 revoke access for the requesting identity without exposing backend details', async () => {
  for (const status of [401, 403]) {
    const denied = [];
    const api = client({ onAccessDenied: (...args) => denied.push(args), fetch: async () => json({ error: { code: 'secret', message: '<html>private backend details</html>' } }, status) });
    await assert.rejects(api.request('/v1/main/marketing-contacts'), error => error.status === status && !error.message.includes('private'));
    assert.equal(denied[0][0], 'account-a');
    await assert.rejects(api.request('/v1/me', { session }));
    assert.equal(denied.length, 1, 'identity validation must not recursively invalidate itself');
  }
});

test('API conflict and validation failures have actionable safe messages', async () => {
  for (const [status, code, message] of [[409, 'duplicate_contact', /already exists/], [409, 'revision_conflict', /Refresh the list/], [422, 'validation_error', /Check the contact/]]) {
    await assert.rejects(client({ fetch: async () => json({ error: { code, message: 'secret' } }, status) }).request('/v1/main/marketing-contacts', { method: 'POST', body: {} }), error => message.test(error.message) && !error.message.includes('secret'));
  }
});

test('write failures never retry or claim that no change was made', async () => {
  for (const fetchResult of [async () => { throw new Error('network'); }, async () => json({ error: { code: 'upstream_unavailable' } }, 503), async () => json({}, 504)]) {
    let calls = 0;
    const api = client({ fetch: async () => { calls++; return fetchResult(); } });
    await assert.rejects(api.request('/v1/main/marketing-contacts/import', { method: 'POST', body: { contacts: [] } }), /Unable to confirm this change.*Refresh/);
    assert.equal(calls, 1);
  }
});

test('timeout and caller cancellation abort requests and preserve uncertain-write messaging', async () => {
  const hanging = (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
  await assert.rejects(client({ fetch: hanging, timeoutMs: 5 }).request('/v1/main/marketing-contacts', { method: 'PATCH', body: {} }), /Unable to confirm/);
  const controller = new AbortController();
  const pending = client({ fetch: hanging }).request('/v1/me', { session, signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});

test('/me validates session identity, nullable profile values and known roles', async () => {
  const load = body => fetchAccount(client({ fetch: async () => json(body) }), session, new AbortController().signal);
  assert.deepEqual(await load(account), account);
  const nullable = { ...account, user: { ...account.user, email: null }, profile: { id: 'account-a', full_name: null, created_at: null }, role: 'member' };
  assert.deepEqual(await load(nullable), nullable);
  for (const bad of [null, { ...account, role: 'superadmin' }, { ...account, user: { id: 'b', email: null } }, { ...nullable, profile: { ...nullable.profile, id: 'b' } }, { ...account, profile: {} }]) {
    await assert.rejects(load(bad), { code: 'invalid_response' });
  }
});

function authorizationHarness(load) {
  const state = { session: null, profile: null, role: null, error: null, loading: true };
  const authorization = createAccountAuthorization({
    load,
    reset: session => Object.assign(state, { session, profile: null, role: null, error: null, loading: true }),
    authorize: result => Object.assign(state, { profile: result.profile, role: result.role }),
    fail: error => Object.assign(state, { role: null, profile: null, error }),
    settle: () => { state.loading = false; },
  });
  return { state, authorization };
}

test('authorization clears privileges immediately and ignores stale account responses', async () => {
  const pending = new Map();
  const { authorization, state } = authorizationHarness((session, signal) => new Promise(resolve => pending.set(session.user.id, { resolve, signal })));
  authorization.setSession(session);
  await tick();
  authorization.setSession({ ...session, user: { id: 'b' } });
  assert.equal(state.role, null);
  assert.equal(pending.get('account-a').signal.aborted, true);
  await tick();
  pending.get('b').resolve({ ...account, role: 'member' });
  await tick();
  pending.get('account-a').resolve(account);
  await tick();
  assert.equal(state.role, 'member');
  assert.equal(state.session.user.id, 'b');
  authorization.dispose();
});

test('signout, unmount and a later access denial cannot be undone by pending identity responses', async () => {
  for (const action of ['logout', 'dispose', 'deny']) {
    let resolve;
    const { authorization, state } = authorizationHarness(() => new Promise(done => { resolve = done; }));
    authorization.setSession(session);
    await tick();
    if (action === 'logout') authorization.setSession(null);
    else if (action === 'dispose') authorization.dispose();
    else authorization.deny('account-a', new ApiError('forbidden', 'Access denied'));
    resolve(account);
    await tick();
    assert.equal(state.role, null);
    assert.equal(state.profile, null);
    authorization.dispose();
  }
});

test('permission errors fail closed, and an old account denial does not clear the new account', async () => {
  const { authorization, state } = authorizationHarness(async () => { throw new ApiError('configuration', 'Account services are not configured.'); });
  authorization.setSession(session);
  await tick();
  assert.equal(state.role, null);
  assert.equal(state.loading, false);
  assert.equal(state.error.code, 'configuration');
  authorization.deny('other-account', new Error('stale'));
  assert.equal(state.error.code, 'configuration');
  authorization.dispose();
});
