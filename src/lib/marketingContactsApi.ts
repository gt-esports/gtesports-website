import { contactGroups, contactStatuses, normalizeContact, type ContactInput, type MarketingContact } from '../data/marketingContacts';
import { ApiError, isRecord, type ApiClient } from './esportsApiClient';

const endpoint = '/v1/main/marketing-contacts';
const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
const invalidResponse = (write = false) => new ApiError('invalid_response', write
  ? 'Unable to confirm this change. Refresh the contact list before trying again.'
  : 'Unable to load contacts. Please reload and try again.');

function parseContact(value: unknown, write = false): MarketingContact {
  if (!isRecord(value) || typeof value.id !== 'string' || !uuid.test(value.id) ||
      typeof value.revision !== 'number' || !Number.isSafeInteger(value.revision) || value.revision < 1 ||
      typeof value.created_at !== 'string' || !Number.isFinite(Date.parse(value.created_at)) ||
      typeof value.updated_at !== 'string' || !Number.isFinite(Date.parse(value.updated_at)) ||
      !['email', 'name', 'organization', 'category', 'notes'].every(key => typeof value[key] === 'string') ||
      !(value.last_contacted === null || typeof value.last_contacted === 'string')) throw invalidResponse(write);
  const group = contactGroups.find(([key]) => key === value.contact_group);
  const status = contactStatuses.find(([key]) => key === value.status);
  if (!group || !status) throw invalidResponse(write);
  try {
    const input = normalizeContact({
      email: value.email as string, name: value.name as string, organization: value.organization as string,
      category: value.category as string, notes: value.notes as string,
      contact_group: group[0], status: status[0], last_contacted: value.last_contacted,
    });
    return { ...input, id: value.id, revision: value.revision, created_at: value.created_at, updated_at: value.updated_at };
  } catch { throw invalidResponse(write); }
}

function contactPath(contact: MarketingContact): string {
  if (!uuid.test(contact.id) || !Number.isSafeInteger(contact.revision) || contact.revision < 1) {
    throw new Error('Refresh the list and reopen this contact before making changes.');
  }
  return `${endpoint}/${contact.id}`;
}

export function createMarketingContactsApi(api: ApiClient) {
  return {
    async fetchContacts(this: void, signal?: AbortSignal): Promise<MarketingContact[]> {
      const contacts: MarketingContact[] = [];
      const ids = new Set<string>();
      let offset = 0;
      let userId: string | undefined;
      for (;;) {
        const result = await api.request(`${endpoint}?offset=${offset}&limit=500`, { signal, expectedUserId: userId });
        userId = result.userId;
        const data = result.data;
        if (!isRecord(data) || !Array.isArray(data.contacts) || data.contacts.length > 500 ||
            !(data.next_offset === null || (typeof data.next_offset === 'number' && Number.isSafeInteger(data.next_offset) &&
              data.next_offset > offset && data.next_offset === offset + data.contacts.length))) throw invalidResponse();
        for (const value of data.contacts) {
          const contact = parseContact(value);
          if (ids.has(contact.id)) throw invalidResponse();
          ids.add(contact.id);
          contacts.push(contact);
        }
        if (data.next_offset === null) return contacts;
        offset = data.next_offset;
      }
    },
    async saveContact(this: void, input: ContactInput, existing?: MarketingContact): Promise<MarketingContact> {
      const values = normalizeContact(input);
      const { data } = await api.request(existing ? contactPath(existing) : endpoint, {
        method: existing ? 'PATCH' : 'POST',
        body: existing ? { ...values, revision: existing.revision } : values,
      });
      const saved = parseContact(data, true);
      if (existing && saved.id !== existing.id) throw invalidResponse(true);
      return saved;
    },
    async deleteContact(this: void, contact: MarketingContact): Promise<void> {
      const { status } = await api.request(`${contactPath(contact)}?revision=${contact.revision}`, { method: 'DELETE' });
      if (status !== 204) throw invalidResponse(true);
    },
    async importContacts(this: void, contacts: ContactInput[]): Promise<number> {
      if (!contacts.length || contacts.length > 500) throw new Error('Import between 1 and 500 contacts at a time.');
      const { data } = await api.request(`${endpoint}/import`, { method: 'POST', body: { contacts: contacts.map(normalizeContact) } });
      if (!isRecord(data) || typeof data.imported !== 'number' || typeof data.skipped !== 'number' ||
          !Number.isSafeInteger(data.imported) || !Number.isSafeInteger(data.skipped) || data.imported < 0 || data.skipped < 0 ||
          data.imported + data.skipped !== contacts.length) throw invalidResponse(true);
      return data.imported;
    },
  };
}
