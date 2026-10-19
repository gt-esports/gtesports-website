-- Storage metadata fixtures only; no files are uploaded and all rows roll back.
begin;
select set_config('test.admin_id', gen_random_uuid()::text, true);
select set_config('test.member_id', gen_random_uuid()::text, true);
select set_config('test.photo_path', 'headshots/' || gen_random_uuid()::text || '.jpg', true);
insert into auth.users (id, raw_user_meta_data) values
  (current_setting('test.admin_id')::uuid, '{}'::jsonb),
  (current_setting('test.member_id')::uuid, '{"role":"admin"}'::jsonb);
insert into public.user_roles (user_id, role) values (current_setting('test.admin_id')::uuid, 'admin');
do $$
begin
  if not exists(select 1 from storage.buckets where id = 'team-headshots' and public
    and file_size_limit = 5242880 and allowed_mime_types = array['image/jpeg','image/png','image/webp'])
    then raise exception 'Headshot bucket configuration incorrect'; end if;
end $$;

select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  insert into storage.objects (bucket_id, name) values ('team-headshots', current_setting('test.photo_path'));
  if not exists(select 1 from storage.objects where bucket_id='team-headshots' and name=current_setting('test.photo_path')) then raise exception 'Admin insert/select denied'; end if;
  begin
    insert into storage.objects (bucket_id, name) values ('team-headshots', 'other-folder/test.jpg');
    raise exception 'Upload outside headshots folder allowed';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects (bucket_id, name) values ('team-headshots', 'headshots/test.svg');
    raise exception 'Unsupported extension allowed';
  exception when insufficient_privilege then null; end;
  update storage.objects set metadata='{}' where bucket_id='team-headshots' and name=current_setting('test.photo_path');
  if found then raise exception 'Overwriting published photos allowed'; end if;
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.member_id'), true);
set local role authenticated;
do $$
begin
  begin
    insert into storage.objects (bucket_id, name) values ('team-headshots', 'headshots/member.jpg');
    raise exception 'Member or metadata-elevated upload allowed';
  exception when insufficient_privilege then null; end;
  if exists(select 1 from storage.objects where bucket_id='team-headshots') then raise exception 'Member listing allowed'; end if;
end $$;

reset role;
update public.user_roles set role='member' where user_id=current_setting('test.admin_id')::uuid;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  begin
    insert into storage.objects (bucket_id, name) values ('team-headshots', 'headshots/revoked.jpg');
    raise exception 'Revoked admin upload allowed';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
select set_config('request.jwt.claim.sub', '', true);
set local role anon;
do $$
begin
  begin
    insert into storage.objects (bucket_id, name) values ('team-headshots', 'headshots/anonymous.jpg');
    raise exception 'Anonymous upload allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'Team headshot authorization checks passed; fixtures rolled back' as result;
