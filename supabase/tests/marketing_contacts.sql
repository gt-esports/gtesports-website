-- Run as postgres after the contacts migration. All fixtures roll back.
begin;
select set_config('test.admin_id', gen_random_uuid()::text, true);
select set_config('test.member_id', gen_random_uuid()::text, true);
select set_config('test.contact_id', gen_random_uuid()::text, true);
select set_config('test.contact_email', gen_random_uuid()::text || '@example.com', true);
insert into auth.users (id, raw_user_meta_data) values
  (current_setting('test.admin_id')::uuid, '{}'::jsonb),
  (current_setting('test.member_id')::uuid, '{"role":"admin"}'::jsonb);
insert into public.user_roles (user_id, role) values (current_setting('test.admin_id')::uuid, 'admin');

select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
declare saved public.marketing_contacts;
begin
  insert into public.marketing_contacts (id, email, name, revision, created_at)
  values (current_setting('test.contact_id')::uuid, '  ' || upper(current_setting('test.contact_email')) || '  ', '  Outreach  ', 900, '2000-01-01')
  returning * into saved;
  if saved.email <> current_setting('test.contact_email') or saved.name <> 'Outreach' or saved.revision <> 1 or saved.created_at <> now() then
    raise exception 'Normalization or server-owned fields failed';
  end if;
  if not exists(select 1 from public.marketing_contacts where id = saved.id) then raise exception 'Admin read denied'; end if;
  begin
    insert into public.marketing_contacts(email) values (upper(saved.email));
    raise exception 'Case-insensitive duplicate accepted';
  exception when unique_violation then null; end;
  begin
    insert into public.marketing_contacts(email) values ('invalid');
    raise exception 'Invalid email accepted';
  exception when check_violation then null; end;
  begin
    update public.marketing_contacts set status = 'invalid' where id = saved.id;
    raise exception 'Invalid status accepted';
  exception when check_violation then null; end;
  begin
    update public.marketing_contacts set notes = repeat('x', 5001) where id = saved.id;
    raise exception 'Oversize notes accepted';
  exception when check_violation then null; end;
  begin
    update public.marketing_contacts set contact_group = 'invalid' where id = saved.id;
    raise exception 'Invalid contact group accepted';
  exception when check_violation then null; end;
  update public.marketing_contacts set status = 'unsubscribed', contact_group = 'both', last_contacted = '2026-10-13', revision = 900, created_at = '2000-01-01'
  where id = saved.id and revision = 1 returning * into saved;
  if not found or saved.revision <> 2 or saved.created_at <> now() or saved.updated_at <> now() or saved.contact_group <> 'both' then raise exception 'Admin update or revision failed'; end if;
  -- Import never overwrites an existing record or its do-not-contact flag.
  insert into public.marketing_contacts(email, status, contact_group) values (upper(saved.email), 'active', 'newsletter') on conflict (email) do nothing;
  if found then raise exception 'Duplicate import inserted'; end if;
  if (select status from public.marketing_contacts where id = saved.id) <> 'unsubscribed' or (select contact_group from public.marketing_contacts where id = saved.id) <> 'both' then raise exception 'Import overwrote suppression or group'; end if;
  update public.marketing_contacts set notes = 'stale save' where id = saved.id and revision = 1;
  if found then raise exception 'Stale update allowed'; end if;
  delete from public.marketing_contacts where id = saved.id and revision = 1;
  if found then raise exception 'Stale delete allowed'; end if;
  insert into public.marketing_contacts(email) values (gen_random_uuid()::text || '@example.com') returning * into saved;
  delete from public.marketing_contacts where id = saved.id and revision = saved.revision;
  if not found then raise exception 'Admin delete denied'; end if;
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.member_id'), true);
set local role authenticated;
do $$
begin
  if exists(select 1 from public.marketing_contacts) then raise exception 'Contact data leaked to member'; end if;
  begin
    insert into public.marketing_contacts(email) values (gen_random_uuid()::text || '@example.com');
    raise exception 'Member insert allowed';
  exception when insufficient_privilege then null; end;
  update public.marketing_contacts set notes = 'member overwrite';
  if found then raise exception 'Member update allowed'; end if;
  delete from public.marketing_contacts;
  if found then raise exception 'Member delete allowed'; end if;
end $$;

reset role;
update public.user_roles set role = 'member' where user_id = current_setting('test.admin_id')::uuid;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  if exists(select 1 from public.marketing_contacts) then raise exception 'Revoked admin read allowed'; end if;
  begin
    insert into public.marketing_contacts(email) values (gen_random_uuid()::text || '@example.com');
    raise exception 'Revoked admin insert allowed';
  exception when insufficient_privilege then null; end;
  update public.marketing_contacts set notes = 'revoked overwrite';
  if found then raise exception 'Revoked admin update allowed'; end if;
  delete from public.marketing_contacts;
  if found then raise exception 'Revoked admin delete allowed'; end if;
end $$;

reset role;
select set_config('request.jwt.claim.sub', '', true);
set local role anon;
do $$
begin
  begin perform * from public.marketing_contacts;
    raise exception 'Anonymous read allowed';
  exception when insufficient_privilege then null; end;
  begin insert into public.marketing_contacts(email) values (gen_random_uuid()::text || '@example.com');
    raise exception 'Anonymous insert allowed';
  exception when insufficient_privilege then null; end;
  begin update public.marketing_contacts set notes = 'anonymous overwrite';
    raise exception 'Anonymous update allowed';
  exception when insufficient_privilege then null; end;
  begin delete from public.marketing_contacts;
    raise exception 'Anonymous delete allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'Marketing contact checks passed; all test data rolled back' as result;
