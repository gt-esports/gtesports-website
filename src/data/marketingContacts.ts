export const contactStatuses = [
  ['active', 'Active'],
  ['unsubscribed', 'Unsubscribed'],
  ['do_not_contact', 'Do not contact'],
] as const;

export type ContactStatus = typeof contactStatuses[number][0];
export const contactGroups = [['newsletter', 'Newsletter'], ['alumni', 'Alumni'], ['both', 'Newsletter + Alumni']] as const;
export type ContactGroup = typeof contactGroups[number][0];
export interface ContactInput {
  email: string;
  name: string;
  organization: string;
  category: string;
  contact_group: ContactGroup;
  status: ContactStatus;
  last_contacted: string | null;
  notes: string;
}
export interface MarketingContact extends ContactInput {
  id: string;
  revision: number;
  created_at: string;
  updated_at: string;
}

export const emptyContact: ContactInput = {
  email: '', name: '', organization: '', category: '', contact_group: 'newsletter', status: 'active', last_contacted: null, notes: '',
};

export function normalizeContact(input: ContactInput): ContactInput {
  const contact = {
    email: input.email.trim().toLowerCase(), name: input.name.trim(), status: input.status, contact_group: input.contact_group,
    organization: input.organization.trim(), category: input.category.trim(), notes: input.notes.trim(),
    last_contacted: input.last_contacted || null,
  };
  if (contact.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) throw new Error('Enter a valid email address.');
  if (contact.name.length > 200 || contact.organization.length > 200 || contact.category.length > 100 || contact.notes.length > 5000) {
    throw new Error('Name and organization must be at most 200 characters, category 100, and notes 5,000.');
  }
  if (!contactStatuses.some(([status]) => status === contact.status)) throw new Error('Choose a valid contact status.');
  if (!contactGroups.some(([group]) => group === contact.contact_group)) throw new Error('Choose Newsletter, Alumni, or Both as the contact group.');
  if (contact.last_contacted && (!/^\d{4}-\d{2}-\d{2}$/.test(contact.last_contacted)
    || !Number.isFinite(Date.parse(contact.last_contacted))
    || new Date(contact.last_contacted).toISOString().slice(0, 10) !== contact.last_contacted)) {
    throw new Error('Last contacted must be a valid date in YYYY-MM-DD format.');
  }
  return contact;
}

// CSV records can contain escaped quotes, commas, and line breaks inside quotes.
function csvRows(source: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false, closed = false;
  const input = source.replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { quoted = false; closed = true; }
      else field += ch;
    } else if (ch === '"' && !field && !closed) quoted = true;
    else if (ch === ',' || ch === '\n' || ch === '\r') {
      row.push(field); field = ''; closed = false;
      if (ch !== ',') {
        if (ch === '\r' && input[i + 1] === '\n') i++;
        if (row.some(value => value.trim())) rows.push(row);
        row = [];
      }
    } else if (ch === '"' || closed) throw new Error('Invalid CSV quoting. Export the spreadsheet as CSV and try again.');
    else field += ch;
  }
  if (quoted) throw new Error('The CSV contains an unfinished quoted field.');
  row.push(field);
  if (row.some(value => value.trim())) rows.push(row);
  return rows;
}

const csvColumns = ['email', 'name', 'organization', 'category', 'contact_group', 'status', 'last_contacted', 'notes'] as const;
export function parseContactCsv(source: string): { contacts: ContactInput[]; duplicates: number } {
  const [header, ...rows] = csvRows(source);
  if (!header || !rows.length) throw new Error('The CSV must have a header and at least one contact.');
  if (rows.length > 500) throw new Error('Import up to 500 contacts at a time.');
  const columns = header.map(value => value.trim().toLowerCase().replace(/\s+/g, '_'));
  if (!columns.includes('email')) throw new Error('The CSV needs an email column.');
  if (new Set(columns).size !== columns.length) throw new Error('The CSV has duplicate column names.');
  const contacts: ContactInput[] = [], seen = new Set<string>();
  let duplicates = 0;
  for (const [index, row] of rows.entries()) {
    try {
      if (row.length !== columns.length) throw new Error('Column count does not match the header.');
      const values = Object.fromEntries(columns.map((key, col) => [key, row[col].trim()]));
      const status = values.status || 'active';
      const matched = contactStatuses.find(([key, label]) => key === status.toLowerCase().replace(/\s+/g, '_') || label.toLowerCase() === status.toLowerCase());
      if (!matched) throw new Error('Unknown status. Use active, unsubscribed, or do_not_contact.');
      const group = contactGroups.find(([key]) => key === (values.contact_group || 'newsletter').toLowerCase());
      if (!group) throw new Error('Unknown contact group. Use newsletter, alumni, or both.');
      const contact = normalizeContact({
        email: values.email, name: values.name || '', organization: values.organization || '',
        category: values.category || '', contact_group: group[0], status: matched[0], last_contacted: values.last_contacted || null, notes: values.notes || '',
      });
      if (seen.has(contact.email)) duplicates++;
      else { seen.add(contact.email); contacts.push(contact); }
    } catch (error) {
      throw new Error(`CSV record ${index + 2}: ${error instanceof Error ? error.message : 'Invalid contact.'}`);
    }
  }
  return { contacts, duplicates };
}

export function exportContactCsv(contacts: ContactInput[]): string {
  // Neutralize spreadsheet formula prefixes in user-entered values.
  const cell = (value: string) => `"${(/^[\s]*[=+\-@]/.test(value) || /^[\t\r\n]/.test(value) ? "'" + value : value).replace(/"/g, '""')}"`;
  return [csvColumns.join(','), ...contacts.map(contact => csvColumns.map(key => cell(contact[key] ?? '')).join(','))].join('\r\n');
}
