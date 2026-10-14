import { supabase } from './supabase';

export interface AdminAccount {
  user_id: string;
  email: string | null;
  full_name: string | null;
}

function requestError(error: { code?: string; message: string }, fallback: string): Error {
  if (error.code === '42501') return new Error('Your admin access could not be verified. Reload the page and try again.');
  if (error.code === '22023' || error.code === 'P0002') return new Error(error.message);
  return new Error(fallback);
}

export async function fetchAdmins(): Promise<AdminAccount[]> {
  const result = await supabase.rpc('list_admins');
  if (result.error) throw requestError(result.error, 'Unable to load admins. Try refreshing the list.');
  const data: unknown = result.data;
  if (!Array.isArray(data) || !data.every((value: unknown): value is AdminAccount => (
    typeof value === 'object' && value !== null
    && 'user_id' in value && typeof value.user_id === 'string'
    && 'email' in value && (value.email === null || typeof value.email === 'string')
    && 'full_name' in value && (value.full_name === null || typeof value.full_name === 'string')
  ))) throw new Error('Unable to read the admin list. Refresh and try again.');
  return data;
}

export async function grantAdmin(email: string): Promise<void> {
  const { error } = await supabase.rpc('grant_admin', { target_email: email.trim() });
  if (error) throw requestError(error, 'Unable to grant admin access. Please try again.');
}

export async function revokeAdmin(userId: string): Promise<void> {
  const { error } = await supabase.rpc('revoke_admin', { target_user_id: userId });
  if (error) throw requestError(error, 'Unable to remove admin access. Please try again.');
}
