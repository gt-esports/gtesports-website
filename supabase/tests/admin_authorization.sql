-- Run in the SQL Editor as postgres. Everything, including test users, rolls back.
begin;
select set_config('test.admin_id', gen_random_uuid()::text, true);
select set_config('test.member_id', gen_random_uuid()::text, true);
insert into auth.users (id, raw_user_meta_data) values
  (current_setting('test.admin_id')::uuid, '{}'::jsonb),
  (current_setting('test.member_id')::uuid, '{"role":"admin"}'::jsonb);
insert into public.user_roles(user_id, role)
values (current_setting('test.admin_id')::uuid, 'admin');

-- Exercise the policy pattern that future content/contact tables will use.
create table public.authorization_test_probe (id integer primary key, value text);
alter table public.authorization_test_probe enable row level security;
revoke all on public.authorization_test_probe from public, anon, authenticated;
grant select, insert, update, delete on public.authorization_test_probe to authenticated;
create policy admin_only on public.authorization_test_probe
for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));
insert into public.authorization_test_probe values (1, 'private contact');

select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  if not public.is_admin() then raise exception 'Admin not recognized'; end if;
  if (select count(*) from public.user_roles) <> 1 then raise exception 'Own role invisible'; end if;
  if (select count(*) from public.authorization_test_probe) <> 1 then raise exception 'Admin read denied'; end if;
  insert into public.authorization_test_probe values (2, 'new');
  update public.authorization_test_probe set value = 'updated' where id = 2;
  if not found then raise exception 'Admin update denied'; end if;
  delete from public.authorization_test_probe where id = 2;
  if not found then raise exception 'Admin delete denied'; end if;
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.member_id'), true);
set local role authenticated;
do $$
begin
  if public.is_admin() then raise exception 'Unassigned user or metadata elevated'; end if;
  if exists(select 1 from public.user_roles) then raise exception 'Other user role leaked'; end if;
  if exists(select 1 from public.authorization_test_probe) then raise exception 'Private data leaked'; end if;
  begin
    insert into public.user_roles values (auth.uid(), 'admin');
    raise exception 'Self-promotion allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.user_roles set role = 'admin' where user_id = auth.uid();
    raise exception 'Role update allowed';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.user_roles;
    raise exception 'Role delete allowed';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.authorization_test_probe values (3, 'denied');
    raise exception 'Member insert allowed';
  exception when insufficient_privilege then null; end;
  update public.authorization_test_probe set value = 'denied';
  if found then raise exception 'Member update allowed'; end if;
  delete from public.authorization_test_probe;
  if found then raise exception 'Member delete allowed'; end if;
end $$;

reset role;
-- Explicit members are also denied; revocation takes effect without a JWT refresh.
update public.user_roles set role = 'member'
where user_id = current_setting('test.admin_id')::uuid;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  if public.is_admin() then raise exception 'Revoked admin retained access'; end if;
  if exists(select 1 from public.authorization_test_probe) then raise exception 'Revoked admin read allowed'; end if;
end $$;

reset role;
select set_config('request.jwt.claim.sub', '', true);
set local role anon;
do $$
begin
  begin
    perform * from public.user_roles;
    raise exception 'Anonymous role read allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform * from public.authorization_test_probe;
    raise exception 'Anonymous private read allowed';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.authorization_test_probe values (4, 'denied');
    raise exception 'Anonymous insert allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.authorization_test_probe set value = 'denied';
    raise exception 'Anonymous update allowed';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.authorization_test_probe;
    raise exception 'Anonymous delete allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'Authorization checks passed; test data rolled back' as result;
