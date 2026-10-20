import { supabase } from './supabase';
import { normalizeContact, type ContactInput, type MarketingContact } from '../data/marketingContacts';

function requestError(error: { code?: string }, fallback: string): Error {
  if (error.code === '23505') return new Error('A contact with this email already exists. Search for it to edit the existing record.');
  if (error.code === '42501') return new Error('Your admin access could not be verified. Reload the page and try again.');
  if (error.code === '42P01' || error.code === 'PGRST205') return new Error('Contact storage is not available yet. Apply the marketing contacts migration and retry.');
  return new Error(fallback);
}

export async function fetchContacts(): Promise<MarketingContact[]> {
  const contacts: MarketingContact[] = [];
  // Supabase limits responses; page through records so large lists are complete.
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.from('marketing_contacts').select('*')
      .order('email').range(offset, offset + 499).returns<MarketingContact[]>();
    if (error) throw requestError(error, 'Unable to load contacts. Please try again.');
    contacts.push(...data);
    if (data.length < 500) return contacts;
  }
}

export async function saveContact(input: ContactInput, existing?: MarketingContact): Promise<MarketingContact> {
  const values = normalizeContact(input);
  const query = existing
    ? supabase.from('marketing_contacts').update(values).eq('id', existing.id).eq('revision', existing.revision)
    : supabase.from('marketing_contacts').insert(values);
  const { data, error } = await query.select('*').maybeSingle<MarketingContact>();
  if (error) throw requestError(error, 'Unable to save this contact. Your edits are still here; try again.');
  if (!data) throw new Error('This contact changed or your access was removed. Refresh the list and reopen the contact before saving.');
  return data;
}

export async function deleteContact(contact: MarketingContact): Promise<void> {
  const { data, error } = await supabase.from('marketing_contacts').delete()
    .eq('id', contact.id).eq('revision', contact.revision).select('id');
  if (error) throw requestError(error, 'Unable to delete this contact. Please try again.');
  if (!data?.length) throw new Error('This contact changed or your access was removed. Refresh the list before deleting.');
}

export async function importContacts(contacts: ContactInput[]): Promise<number> {
  const { data, error } = await supabase.from('marketing_contacts')
    .upsert(contacts.map(normalizeContact), { onConflict: 'email', ignoreDuplicates: true }).select('id');
  if (error) throw requestError(error, 'Import failed. No contacts were imported. Please try again.');
  return data.length;
}
