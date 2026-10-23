import { supabase } from './supabase';
import { createApiClient } from './esportsApiClient';

export const ACCESS_DENIED_EVENT = 'esports:access-denied';

export const esportsApi = createApiClient({
  baseUrl: () => import.meta.env.VITE_ESPORTS_API_URL as unknown,
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data.session;
  },
  onAccessDenied: (userId, error) => {
    window.dispatchEvent(new CustomEvent(ACCESS_DENIED_EVENT, { detail: { userId, error } }));
  },
});
