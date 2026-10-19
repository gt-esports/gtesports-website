-- Run as postgres. Real content and temporary users are restored by rollback.
begin;
select set_config('test.admin_id', gen_random_uuid()::text, true);
select set_config('test.member_id', gen_random_uuid()::text, true);
insert into auth.users (id, raw_user_meta_data) values
  (current_setting('test.admin_id')::uuid, '{}'::jsonb),
  (current_setting('test.member_id')::uuid, '{"role":"admin"}'::jsonb);
insert into public.user_roles (user_id, role) values (current_setting('test.admin_id')::uuid, 'admin');
delete from public.site_content;

select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  insert into public.site_content (section, content) values ('faq', '[]'), ('about', '{}'), ('team', '{}');
  if (select count(*) from public.site_content) <> 3 then raise exception 'Admin insert or read denied'; end if;
  update public.site_content set content = '[{"id":"test","question":"Q","answer":"A"}]' where section = 'faq' and revision = 1;
  if not found then raise exception 'Admin update denied'; end if;
  if (select revision from public.site_content where section = 'faq') <> 2 then raise exception 'Version not incremented'; end if;
  update public.site_content set content = '[]' where section = 'faq' and revision = 1;
  if found then raise exception 'Stale edit overwrote newer content'; end if;
  begin
    update public.site_content set revision = 99 where section = 'faq';
    raise exception 'Version spoofing allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.site_content set section = 'team' where section = 'faq';
    raise exception 'Section reassignment allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.site_content set content = '{}' where section = 'faq';
    raise exception 'Malformed content allowed';
  exception when check_violation then null; end;
  begin
    update public.site_content set content = to_jsonb(repeat('x', 1048577)) where section = 'faq';
    raise exception 'Oversized content allowed';
  exception when check_violation then null; end;
end $$;

reset role;
-- Test both missing and explicit member role assignments.
delete from public.site_content where section = 'team';
select set_config('request.jwt.claim.sub', current_setting('test.member_id'), true);
set local role authenticated;
do $$
begin
  if (select count(*) from public.site_content) <> 2 then raise exception 'Member public read denied'; end if;
  begin
    insert into public.site_content (section, content) values ('team', '{}');
    raise exception 'Member insert allowed';
  exception when insufficient_privilege then null; end;
  update public.site_content set content = '[]' where section = 'faq';
  if found then raise exception 'Member update allowed'; end if;
  begin
    delete from public.site_content;
    raise exception 'Member delete allowed';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
update public.user_roles set role = 'member' where user_id = current_setting('test.admin_id')::uuid;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  update public.site_content set content = '[]' where section = 'faq';
  if found then raise exception 'Revoked admin update allowed'; end if;
  begin
    insert into public.site_content (section, content) values ('team', '{}');
    raise exception 'Revoked admin insert allowed';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
select set_config('request.jwt.claim.sub', '', true);
set local role anon;
do $$
begin
  if (select count(*) from public.site_content) <> 2 then raise exception 'Anonymous public read denied'; end if;
  begin
    insert into public.site_content (section, content) values ('team', '{}');
    raise exception 'Anonymous insert allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.site_content set content = '[]' where section = 'faq';
    raise exception 'Anonymous update allowed';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.site_content;
    raise exception 'Anonymous delete allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'Site content checks passed; fixtures rolled back' as result;
