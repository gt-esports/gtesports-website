alter table public.leadership_applications
  add column if not exists resume_path text not null default ''
  check (length(resume_path) <= 500);

drop function if exists public.submit_leadership_application(text, text, text, text, text, text, text, text, text);
drop function if exists public.submit_leadership_application(text, text, text, text, text, text, text, text, text, text);

create function public.submit_leadership_application(
  first_name text,
  last_name text,
  email text,
  year text,
  major text,
  first_choice text,
  second_choice text,
  portfolio_url text,
  why_join text,
  resume_path text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  stored_resume_path text := btrim(coalesce(resume_path, ''));
begin
  if stored_resume_path <> '' and stored_resume_path !~ '^resumes/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$' then
    raise exception 'Invalid resume path.' using errcode = '22023';
  end if;
  insert into public.leadership_applications (
    first_name, last_name, email, year, major, first_choice, second_choice, portfolio_url, why_join, resume_path
  ) values (
    btrim(first_name),
    btrim(last_name),
    lower(btrim(email)),
    btrim(year),
    btrim(coalesce(major, '')),
    btrim(first_choice),
    btrim(coalesce(second_choice, '')),
    btrim(coalesce(portfolio_url, '')),
    btrim(coalesce(why_join, '')),
    stored_resume_path
  );
end;
$$;

revoke all on function public.submit_leadership_application(text, text, text, text, text, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_leadership_application(text, text, text, text, text, text, text, text, text, text)
  to anon, authenticated;
