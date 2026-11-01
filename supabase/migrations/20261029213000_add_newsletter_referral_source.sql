-- Optional "How did you hear about GT Esports?" answer from the newsletter signup form.
-- '' means the subscriber skipped the question (and is the value for all existing rows).
alter table public.marketing_contacts
  add column referral_source text not null default ''
  check (referral_source in (
    '',
    'georgia_tech_newsletter',
    'gt_esports_alumni',
    'gt_esports_member',
    'gt_esports_event',
    'social_media',
    'friend',
    'other'
  ));

drop function if exists public.subscribe_newsletter(text, text);

create function public.subscribe_newsletter(
  subscriber_email text,
  subscriber_name text,
  subscriber_referral_source text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text := lower(btrim(coalesce(subscriber_email, '')));
  normalized_name text := btrim(coalesce(subscriber_name, ''));
  normalized_source text := lower(btrim(coalesce(subscriber_referral_source, '')));
begin
  if normalized_email = '' or length(normalized_email) > 254
     or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a valid email address.' using errcode = '22023';
  end if;
  if length(normalized_name) > 200 then
    raise exception 'Name must be at most 200 characters.' using errcode = '22023';
  end if;
  if normalized_source not in ('', 'georgia_tech_newsletter', 'gt_esports_alumni', 'gt_esports_member',
                               'gt_esports_event', 'social_media', 'friend', 'other') then
    raise exception 'Choose a listed option for how you heard about GT Esports.' using errcode = '22023';
  end if;

  insert into public.marketing_contacts (email, name, contact_group, status, referral_source)
  values (normalized_email, normalized_name, 'newsletter', 'active', normalized_source)
  on conflict (email) do nothing;
end;
$$;

revoke all on function public.subscribe_newsletter(text, text, text) from public;
grant execute on function public.subscribe_newsletter(text, text, text) to anon, authenticated, service_role;

-- Make the new function signature visible to the Supabase API immediately.
notify pgrst, 'reload schema';