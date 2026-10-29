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
