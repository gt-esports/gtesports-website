-- Public newsletter signup writes one marketing_contacts row without exposing the table.
create or replace function public.subscribe_newsletter(subscriber_email text, subscriber_name text default '')
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text := lower(btrim(coalesce(subscriber_email, '')));
  normalized_name text := btrim(coalesce(subscriber_name, ''));
begin
  if normalized_email = '' or length(normalized_email) > 254
     or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a valid email address.' using errcode = '22023';
  end if;
  if length(normalized_name) > 200 then
    raise exception 'Name must be at most 200 characters.' using errcode = '22023';
  end if;

  insert into public.marketing_contacts (email, name, contact_group, status)
  values (normalized_email, normalized_name, 'newsletter', 'active')
  on conflict (email) do nothing;
end;
$$;

revoke all on function public.subscribe_newsletter(text, text) from public, anon, authenticated;
grant execute on function public.subscribe_newsletter(text, text) to anon, authenticated;
