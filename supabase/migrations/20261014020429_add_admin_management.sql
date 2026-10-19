-- Only these checked operations can change roles. Direct table writes stay denied.
-- Privileged implementations live outside the exposed API schema.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create function private.list_admins()
returns table (user_id uuid, email text, full_name text)
language plpgsql stable security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Admin access is required.' using errcode = '42501';
  end if;
  return query
    select u.id, u.email::text, p.full_name
    from public.user_roles r
    join auth.users u on u.id = r.user_id
    left join public.profiles p on p.id = u.id
    where r.role = 'admin'
    order by lower(u.email), u.id;
end;
$$;

create function private.grant_admin(target_email text)
returns uuid
language plpgsql security definer
set search_path = ''
as $$
declare
  target_id uuid;
  confirmed_at timestamptz;
begin
  -- Check before locking, then recheck after any concurrent role change finishes.
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Admin access is required.' using errcode = '42501';
  end if;
  lock table public.user_roles in share row exclusive mode;
  if not public.is_admin() then
    raise exception 'Admin access is required.' using errcode = '42501';
  end if;
  if target_email is null or btrim(target_email) = '' then
    raise exception 'Enter a registered email address.' using errcode = '22023';
  end if;
  begin
    select u.id, u.email_confirmed_at into strict target_id, confirmed_at
    from auth.users u
    where lower(u.email) = lower(btrim(target_email));
  exception
    when no_data_found then
      raise exception 'No account found for that email. Ask them to sign up first.' using errcode = 'P0002';
    when too_many_rows then
      raise exception 'Multiple accounts match that email. Contact a developer.' using errcode = '22023';
  end;
  if confirmed_at is null then
    raise exception 'That account must verify its email before receiving admin access.' using errcode = '22023';
  end if;
  insert into public.user_roles (user_id, role) values (target_id, 'admin')
    on conflict (user_id) do update set role = excluded.role;
  return target_id;
end;
$$;

create function private.revoke_admin(target_user_id uuid)
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Admin access is required.' using errcode = '42501';
  end if;
  lock table public.user_roles in share row exclusive mode;
  if not public.is_admin() then
    raise exception 'Admin access is required.' using errcode = '42501';
  end if;
  if target_user_id is null then
    raise exception 'Choose an admin to remove.' using errcode = '22023';
  end if;
  -- Together with the lock and fresh permission check, this prevents all admins
  -- being removed, even when two admins try to revoke one another concurrently.
  if target_user_id = auth.uid() then
    raise exception 'You cannot remove your own admin access.' using errcode = '22023';
  end if;
  update public.user_roles set role = 'member'
    where user_id = target_user_id and role = 'admin';
  if not found then
    raise exception 'That account is no longer an admin. Refresh the list.' using errcode = 'P0002';
  end if;
end;
$$;

-- Exposed wrappers use caller permissions; helpers check the current auth.uid().
create function public.list_admins()
returns table (user_id uuid, email text, full_name text)
language sql stable security invoker set search_path = ''
as $$ select * from private.list_admins(); $$;

create function public.grant_admin(target_email text)
returns uuid
language sql security invoker set search_path = ''
as $$ select private.grant_admin(target_email); $$;

create function public.revoke_admin(target_user_id uuid)
returns void
language sql security invoker set search_path = ''
as $$ select private.revoke_admin(target_user_id); $$;

revoke all on function private.list_admins(), private.grant_admin(text), private.revoke_admin(uuid)
  from public, anon, authenticated;
revoke all on function public.list_admins(), public.grant_admin(text), public.revoke_admin(uuid)
  from public, anon, authenticated;
grant execute on function private.list_admins(), private.grant_admin(text), private.revoke_admin(uuid)
  to authenticated;
grant execute on function public.list_admins(), public.grant_admin(text), public.revoke_admin(uuid)
  to authenticated;
