create function public.submit_leadership_application(
  first_name text,
  last_name text,
  email text,
  year text,
  major text,
  first_choice text,
  second_choice text,
  portfolio_url text,
  why_join text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.leadership_applications (
    first_name, last_name, email, year, major, first_choice, second_choice, portfolio_url, why_join
  ) values (
    btrim(first_name),
    btrim(last_name),
    lower(btrim(email)),
    btrim(year),
    btrim(coalesce(major, '')),
    btrim(first_choice),
    btrim(coalesce(second_choice, '')),
    btrim(coalesce(portfolio_url, '')),
    btrim(coalesce(why_join, ''))
  );
end;
$$;

revoke all on function public.submit_leadership_application(text, text, text, text, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_leadership_application(text, text, text, text, text, text, text, text, text)
  to anon, authenticated;
