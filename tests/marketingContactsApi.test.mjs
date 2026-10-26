import assert from 'node:assert/strict';
import test from 'node:test';
import { importTypescript } from './helpers/importTypescript.mjs';

const { createMarketingContactsApi } = await importTypescript(new URL('../src/lib/marketingContactsApi.ts', import.meta.url));
const contact = (index = 1) => ({
  id: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`, revision: 1,
  email: `contact${index}@example.com`, name: '', organization: '', category: '', contact_group: 'both',
  status: 'unsubscribed', notes: '=not a formula here', last_contacted: null,
  created_at: '2026-10-01T00:00:00Z', updated_at: '2026-10-01T00:00:00Z',
});
const result = (data, status = 200) => ({ data, status, userId: 'account-a' });

test('contact pagination reads all pages and binds them to the same account', async () => {
  const calls = [];
  const firstPage = Array.from({ length: 500 }, (_, i) => contact(i + 1));
  const api = createMarketingContactsApi({ request: async (...args) => {
    calls.push(args);
    return result(calls.length === 1 ? { contacts: firstPage, next_offset: 500 } : { contacts: [contact(501)], next_offset: null });
  } });
  const signal = new AbortController().signal;
  const contacts = await api.fetchContacts(signal);
  assert.equal(contacts.length, 501);
  assert.match(calls[1][0], /offset=500&limit=500$/);
  assert.equal(calls[1][1].expectedUserId, 'account-a');
  assert.equal(calls[0][1].signal, signal);
  assert.equal(contacts[0].status, 'unsubscribed');
});

test('empty lists are valid; repeated, backward and malformed pagination fail instead of looping', async () => {
  assert.deepEqual(await createMarketingContactsApi({ request: async () => result({ contacts: [], next_offset: null }) }).fetchContacts(), []);
  for (const payload of [{}, { contacts: [], next_offset: 0 }, { contacts: [contact()], next_offset: -1 }, { contacts: [contact()], next_offset: 500 }, { contacts: [{}], next_offset: null }, { contacts: [contact(), contact()], next_offset: null }]) {
    let calls = 0;
    const api = createMarketingContactsApi({ request: async () => { calls++; return result(payload); } });
    await assert.rejects(api.fetchContacts(), { code: 'invalid_response' });
    assert.equal(calls, 1);
  }
});

test('malformed contacts, unsafe revisions and unknown statuses are rejected', async () => {
  for (const bad of [{ ...contact(), revision: 0 }, { ...contact(), email: 'bad' }, { ...contact(), status: 'pending' }, { ...contact(), notes: null }, { ...contact(), created_at: 'invalid' }]) {
    await assert.rejects(createMarketingContactsApi({ request: async () => result({ contacts: [bad], next_offset: null }) }).fetchContacts(), { code: 'invalid_response' });
  }
});

test('create normalizes editable fields and PATCH sends the loaded revision without metadata', async () => {
  const calls = [];
  const api = createMarketingContactsApi({ request: async (...args) => { calls.push(args); return result(contact(), 201); } });
  await api.saveContact({ ...contact(), email: ' CONTACT1@EXAMPLE.COM ', name: ' Person ' });
  await api.saveContact(contact(), contact());
  assert.equal(calls[0][1].method, 'POST');
  assert.equal(calls[0][1].body.email, 'contact1@example.com');
  assert.equal(calls[0][1].body.name, 'Person');
  assert.equal('id' in calls[0][1].body, false);
  assert.equal('revision' in calls[0][1].body, false);
  assert.equal('created_at' in calls[1][1].body, false);
  assert.equal(calls[1][1].method, 'PATCH');
  assert.equal(calls[1][1].body.revision, 1);
  assert.match(calls[1][0], new RegExp(`${contact().id}$`));
});

test('DELETE sends the loaded revision and requires the agreed 204 receipt', async () => {
  let request;
  await createMarketingContactsApi({ request: async (...args) => { request = args; return result(null, 204); } }).deleteContact(contact());
  assert.match(request[0], /\?revision=1$/);
  assert.equal(request[1].method, 'DELETE');
  await assert.rejects(createMarketingContactsApi({ request: async () => result(null, 200) }).deleteContact(contact()), /Unable to confirm/);
});

test('imports preserve existing suppression flags and interpret imported/skipped counts', async () => {
  let request;
  const api = createMarketingContactsApi({ request: async (...args) => { request = args; return result({ imported: 1, skipped: 1 }); } });
  assert.equal(await api.importContacts([contact(), contact(2)]), 1);
  assert.match(request[0], /\/import$/);
  assert.equal(request[1].body.contacts[0].status, 'unsubscribed');
  assert.equal(request[1].body.contacts[0].contact_group, 'both');
  assert.equal('revision' in request[1].body.contacts[0], false);
  await assert.rejects(api.importContacts([]), /between 1 and 500/);
  await assert.rejects(api.importContacts(Array.from({ length: 501 }, () => contact())), /between 1 and 500/);
});

test('bad write receipts are uncertain, never silently successful', async () => {
  await assert.rejects(createMarketingContactsApi({ request: async () => result(contact(2)) }).saveContact(contact(), contact()), /Unable to confirm/);
  for (const counts of [{ imported: 1, skipped: 1 }, { imported: -1, skipped: 2 }, { imported: '1', skipped: 0 }]) {
    await assert.rejects(createMarketingContactsApi({ request: async () => result(counts) }).importContacts([contact()]), /Unable to confirm/);
  }
});
