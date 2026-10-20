-- Published documents; an absent document uses the app's existing bundled content.
create table public.site_content (
  section text primary key check (section in ('about', 'faq', 'team')),
  content jsonb not null,
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  constraint site_content_shape check (
    jsonb_typeof(content) = case when section = 'faq' then 'array' else 'object' end
    and octet_length(content::text) <= 1048576
  )
);

alter table public.site_content enable row level security;
revoke all on public.site_content from public, anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant insert (section, content), update (content) on public.site_content to authenticated;
grant all on public.site_content to service_role;

create policy "Everyone reads published content"
on public.site_content for select to anon, authenticated using (true);
create policy "Admins publish new content"
on public.site_content for insert to authenticated
with check ((select public.is_admin()));
create policy "Admins update published content"
on public.site_content for update to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

-- Server-owned versions support optimistic concurrency checks in the editor.
create function public.version_site_content()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if TG_OP = 'INSERT' then
    new.revision := 1;
  else
    new.section := old.section;
    new.revision := old.revision + 1;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.version_site_content() from public, anon, authenticated;
create trigger version_site_content before insert or update on public.site_content
for each row execute function public.version_site_content();
