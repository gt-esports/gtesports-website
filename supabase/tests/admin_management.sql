-- Run as postgres after the admin-management migration. All fixtures roll back.
begin;
select set_config('test.admin_id', gen_random_uuid()::text, true);
select set_config('test.member_id', gen_random_uuid()::text, true);
select set_config('test.unverified_id', gen_random_uuid()::text, true);
select set_config('test.member_email', 'admin-test-' || gen_random_uuid() || '@example.com', true);
select set_config('test.unverified_email', 'unverified-test-' || gen_random_uuid() || '@example.com', true);
insert into auth.users (id, email, email_confirmed_at, raw_user_meta_data) values
  (current_setting('test.admin_id')::uuid, 'admin-test-' || gen_random_uuid() || '@example.com', now(), '{}'),
  (current_setting('test.member_id')::uuid, current_setting('test.member_email'), now(), '{"role":"admin"}'),
  (current_setting('test.unverified_id')::uuid, current_setting('test.unverified_email'), null, '{}');
insert into public.user_roles (user_id, role) values (current_setting('test.admin_id')::uuid, 'admin');

-- Existing admins can list admins, but cannot directly write role assignments.
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  if not exists (select 1 from public.list_admins() where user_id = auth.uid()) then
    raise exception 'Admin missing from list';
  end if;
  if exists (select 1 from public.list_admins() where user_id = current_setting('test.member_id')::uuid) then
    raise exception 'Non-admin included in list';
  end if;
  begin
    insert into public.user_roles values (current_setting('test.member_id')::uuid, 'admin');
    raise exception 'Direct role insert allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.user_roles set role = 'member';
    raise exception 'Direct role update allowed';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.user_roles;
    raise exception 'Direct role delete allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.revoke_admin(auth.uid());
    raise exception 'Self-removal allowed';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.grant_admin(null);
    raise exception 'Null email accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.grant_admin('   ');
    raise exception 'Blank email accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.grant_admin('missing-' || gen_random_uuid() || '@example.com');
    raise exception 'Unknown email accepted';
  exception when no_data_found then null; end;
  begin
    perform public.grant_admin(current_setting('test.unverified_email'));
    raise exception 'Unverified email accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.revoke_admin(null);
    raise exception 'Null removal accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.revoke_admin(current_setting('test.member_id')::uuid);
    raise exception 'Non-admin removal accepted';
  exception when no_data_found then null; end;
end $$;

-- Members cannot use either the exposed wrappers or private helpers, even with
-- forged user metadata or another admin's email/ID.
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.member_id'), true);
set local role authenticated;
do $$
begin
  if public.is_admin() then raise exception 'Metadata elevated member'; end if;
  begin
    perform * from public.list_admins();
    raise exception 'Member listed admins';
  exception when insufficient_privilege then null; end;
  begin
    perform public.grant_admin(current_setting('test.member_email'));
    raise exception 'Member self-promotion allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.revoke_admin(current_setting('test.admin_id')::uuid);
    raise exception 'Member removed admin';
  exception when insufficient_privilege then null; end;
  begin
    perform * from private.list_admins();
    raise exception 'Member bypassed list wrapper';
  exception when insufficient_privilege then null; end;
  begin
    perform private.grant_admin(current_setting('test.member_email'));
    raise exception 'Member bypassed grant wrapper';
  exception when insufficient_privilege then null; end;
  begin
    perform private.revoke_admin(current_setting('test.admin_id')::uuid);
    raise exception 'Member bypassed revoke wrapper';
  exception when insufficient_privilege then null; end;
end $$;

-- Granting is case-insensitive, trims whitespace, and is safe to repeat.
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  if public.grant_admin('  ' || upper(current_setting('test.member_email')) || '  ')
    <> current_setting('test.member_id')::uuid then raise exception 'Grant returned wrong user'; end if;
  perform public.grant_admin(current_setting('test.member_email'));
  if (select count(*) from public.list_admins() where user_id = current_setting('test.member_id')::uuid) <> 1 then
    raise exception 'Grant missing or duplicated';
  end if;
end $$;

-- Newly promoted users have immediate access without token refresh.
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.member_id'), true);
set local role authenticated;
do $$
begin
  if not public.is_admin() then raise exception 'Granted user still a member'; end if;
  perform * from public.list_admins();
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
select public.revoke_admin(current_setting('test.member_id')::uuid);
do $$
begin
  if exists (select 1 from public.list_admins() where user_id = current_setting('test.member_id')::uuid) then
    raise exception 'Revoked user still listed';
  end if;
end $$;

-- Revoked admins cannot manage roles with their still-current JWT.
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.member_id'), true);
set local role authenticated;
do $$
begin
  if public.is_admin() then raise exception 'Revoked user retains access'; end if;
  if (select role from public.user_roles where user_id = auth.uid()) <> 'member' then
    raise exception 'Revoked account did not remain a member';
  end if;
  begin
    perform * from public.list_admins();
    raise exception 'Revoked admin listed admins';
  exception when insufficient_privilege then null; end;
  begin
    perform public.grant_admin(current_setting('test.member_email'));
    raise exception 'Revoked admin restored access';
  exception when insufficient_privilege then null; end;
  begin
    perform public.revoke_admin(current_setting('test.admin_id')::uuid);
    raise exception 'Revoked admin removed another admin';
  exception when insufficient_privilege then null; end;
end $$;

-- Also cover explicit members and subsequent re-granting.
reset role;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
select public.grant_admin(current_setting('test.member_email'));
select public.revoke_admin(current_setting('test.member_id')::uuid);

reset role;
select set_config('request.jwt.claim.sub', '', true);
set local role anon;
do $$
begin
  begin
    perform * from public.list_admins();
    raise exception 'Anonymous list allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.grant_admin(current_setting('test.member_email'));
    raise exception 'Anonymous grant allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.revoke_admin(current_setting('test.admin_id')::uuid);
    raise exception 'Anonymous removal allowed';
  exception when insufficient_privilege then null; end;
end $$;

-- Empty auth.uid() is denied even if an authenticated DB role is used.
reset role;
set local role authenticated;
do $$
begin
  begin
    perform * from public.list_admins();
    raise exception 'Missing identity list allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.grant_admin(current_setting('test.member_email'));
    raise exception 'Missing identity grant allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.revoke_admin(current_setting('test.admin_id')::uuid);
    raise exception 'Missing identity removal allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'Admin management checks passed; test data rolled back' as result;
