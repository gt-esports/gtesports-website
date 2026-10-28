-- Missing assignments intentionally mean member access; only trusted database
-- administrators can grant or revoke explicit roles.
create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'admin'))
);

alter table public.user_roles enable row level security;
revoke all on public.user_roles from public, anon, authenticated;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

create policy "Users can read their own role"
  on public.user_roles for select to authenticated
  using ((select auth.uid()) = user_id);

-- Invoker permissions preserve RLS: only the caller's own role is visible.
-- No caller-supplied user ID and no user-editable metadata are trusted.
create function public.is_admin()
returns boolean
language sql stable security invoker
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated, service_role;
