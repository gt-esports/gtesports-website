import { apiBaseUrl, isRecord } from './esportsApiClient';

type Environment = Readonly<Record<string, unknown>>;

function requiredText(environment: Environment, name: string): string {
  const value = environment[name];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} is required.`);
  return value.trim();
}

function publicKey(value: string): string {
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(value)) return value;
  const parts = value.split('.');
  if (parts.length === 3 && parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) {
    try {
      const payload: unknown = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (isRecord(payload) && payload.role === 'anon') return value;
    } catch { /* The error below deliberately excludes the supplied key. */ }
  }
  throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY must be a publishable key or legacy anon key. Secret, service-role, and user-session keys must not be included in frontend builds.');
}

function publicUrl(environment: Environment, name: string): string {
  const value = requiredText(environment, name);
  try { return apiBaseUrl(value); }
  catch { throw new Error(`${name} must be an absolute HTTPS URL (HTTP is allowed only for loopback), without credentials, query parameters, or fragments.`); }
}

export function readSupabaseConfiguration(environment: Environment) {
  return {
    url: publicUrl(environment, 'VITE_SUPABASE_URL'),
    publishableKey: publicKey(requiredText(environment, 'VITE_SUPABASE_PUBLISHABLE_KEY')),
  };
}

export function validateBuildConfiguration(environment: Environment): void {
  readSupabaseConfiguration(environment);
  publicUrl(environment, 'VITE_ESPORTS_API_URL');
}
