-- Outreach records are private and independent of website accounts/submissions.
create table public.marketing_contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  name text not null default '' check (length(name) <= 200),
  organization text not null default '' check (length(organization) <= 200),
  category text not null default '' check (length(category) <= 100),
  status text not null default 'new' check (status in ('new', 'contacted', 'follow_up', 'confirmed', 'do_not_contact')),
  last_contacted date,
  notes text not null default '' check (length(notes) <= 5000),
  revision integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marketing_contacts enable row level security;
revoke all on public.marketing_contacts from public, anon, authenticated;
grant select, insert, update, delete on public.marketing_contacts to authenticated;
grant all on public.marketing_contacts to service_role;
create policy "Admins manage marketing contacts"
on public.marketing_contacts for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create function public.prepare_marketing_contact()
returns trigger language plpgsql security invoker set search_path = ''
as $$
begin
  new.email := lower(btrim(new.email));
  new.name := btrim(new.name);
  new.organization := btrim(new.organization);
  new.category := btrim(new.category);
  new.notes := btrim(new.notes);
  if tg_op = 'INSERT' then
    new.revision := 1;
    new.created_at := now();
  else
    new.id := old.id;
    new.created_at := old.created_at;
    new.revision := old.revision + 1;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.prepare_marketing_contact() from public, anon, authenticated;
create trigger prepare_marketing_contact
before insert or update on public.marketing_contacts
for each row execute function public.prepare_marketing_contact();
