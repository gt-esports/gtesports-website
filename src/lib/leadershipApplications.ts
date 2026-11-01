import { supabase } from './supabase';

export interface LeadershipApplicationInput {
  first_name: string;
  last_name: string;
  email: string;
  year: string;
  major: string;
  first_choice: string;
  second_choice: string;
  portfolio_url: string;
  why_join: string;
  resume_path: string;
}

export interface LeadershipApplication extends LeadershipApplicationInput {
  id: string;
  created_at: string;
}

function requestError(error: { code?: string }, fallback: string): Error {
  if (error.code === '42501') return new Error('Your admin access could not be verified. Reload the page and try again.');
  if (error.code === '42P01' || error.code === 'PGRST205') return new Error('Application storage is not available yet. Please try again later.');
  return new Error(fallback);
}

export async function fetchApplications(): Promise<LeadershipApplication[]> {
  const applications: LeadershipApplication[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.from('leadership_applications').select('*')
      .order('created_at', { ascending: false }).range(offset, offset + 499).returns<LeadershipApplication[]>();
    if (error) throw requestError(error, 'Unable to load applications. Please try again.');
    applications.push(...data);
    if (data.length < 500) return applications;
  }
}

export async function submitLeadershipApplication(input: LeadershipApplicationInput): Promise<void> {
  const { error } = await supabase.rpc('submit_leadership_application', {
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    email: input.email.trim().toLowerCase(),
    year: input.year.trim(),
    major: input.major.trim(),
    first_choice: input.first_choice.trim(),
    second_choice: input.second_choice.trim(),
    portfolio_url: input.portfolio_url.trim(),
    why_join: input.why_join.trim(),
    resume_path: input.resume_path.trim(),
  });
  if (error) throw new Error('Unable to submit this application. Please try again.');
}
