-- Run as postgres after the subscribe_newsletter migration. All fixtures roll back.
begin;
select set_config('test.admin_id', gen_random_uuid()::text, true);
select set_config('test.signup_email', gen_random_uuid()::text || '@example.com', true);
select set_config('test.held_email', gen_random_uuid()::text || '@example.com', true);
insert into auth.users (id, raw_user_meta_data) values (current_setting('test.admin_id')::uuid, '{}'::jsonb);
insert into public.user_roles (user_id, role) values (current_setting('test.admin_id')::uuid, 'admin');

select set_config('request.jwt.claim.sub', '', true);
set local role anon;
do $$
begin
  perform public.subscribe_newsletter('  ' || upper(current_setting('test.signup_email')) || '  ', '  Joey  ');
  perform public.subscribe_newsletter(current_setting('test.signup_email'), 'Duplicate');
  begin
    perform public.subscribe_newsletter('invalid', 'Joey');
    raise exception 'Invalid email accepted';
  exception when others then
    if sqlstate <> '22023' then raise; end if;
  end;
  begin
    perform * from public.marketing_contacts;
    raise exception 'Anonymous read allowed';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
declare saved public.marketing_contacts;
begin
  select * into saved from public.marketing_contacts where email = current_setting('test.signup_email');
  if not found or saved.name <> 'Joey' or saved.contact_group <> 'newsletter' or saved.status <> 'active' then
    raise exception 'Public signup did not store a newsletter contact';
  end if;
  insert into public.marketing_contacts (email, name, contact_group, status)
  values (current_setting('test.held_email'), 'Held', 'newsletter', 'unsubscribed');
end $$;

reset role;
select set_config('request.jwt.claim.sub', '', true);
set local role anon;
do $$
begin
  perform public.subscribe_newsletter(current_setting('test.held_email'), 'Overwrite');
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  if (select status from public.marketing_contacts where email = current_setting('test.held_email')) <> 'unsubscribed'
     or (select name from public.marketing_contacts where email = current_setting('test.held_email')) <> 'Held' then
    raise exception 'Signup overwrote an existing suppression';
  end if;
end $$;
reset role;
rollback;
select 'Newsletter signup checks passed; all test data rolled back' as result;
