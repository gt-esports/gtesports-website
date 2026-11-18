-- Run as postgres after the News migration. All fixtures roll back.
begin;
select set_config('test.admin_id', gen_random_uuid()::text, true);
select set_config('test.member_id', gen_random_uuid()::text, true);
select set_config('test.slug', 'news-check-' || gen_random_uuid()::text, true);
select set_config('test.cover', 'covers/' || gen_random_uuid()::text || '.png', true);
insert into auth.users (id, raw_user_meta_data) values
  (current_setting('test.admin_id')::uuid, '{}'::jsonb),
  (current_setting('test.member_id')::uuid, '{"role":"admin"}'::jsonb);
insert into public.user_roles (user_id, role) values (current_setting('test.admin_id')::uuid, 'admin');

do $$
begin
  if not exists (select 1 from storage.buckets where id = 'news-covers' and public
    and file_size_limit = 5242880 and allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'])
  then raise exception 'News cover bucket configuration is missing or incorrect'; end if;
end $$;

select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
declare saved public.news_posts;
begin
  insert into public.news_posts (title, slug, category, status)
    values ('News policy check', current_setting('test.slug'), 'Community', 'draft') returning * into saved;
  perform set_config('test.post_id', saved.id::text, true);
  if saved.revision <> 1 or saved.published_at is not null then raise exception 'Incorrect initial draft state'; end if;
  if not exists (select 1 from public.news_posts where id = saved.id) then raise exception 'Admin cannot read a draft'; end if;
  insert into storage.objects (bucket_id, name) values ('news-covers', current_setting('test.cover'));
  begin
    update public.news_posts set cover_path = current_setting('test.cover') where id = saved.id;
    raise exception 'Uploaded cover accepted without image description';
  exception when check_violation then null; end;
  begin
    update public.news_posts set cover_path = 'covers/invalid.png', cover_alt = 'Image description' where id = saved.id;
    raise exception 'Invalid cover path accepted';
  exception when check_violation then null; end;
  begin
    update public.news_posts set status = 'published' where id = saved.id;
    raise exception 'Incomplete draft published';
  exception when check_violation then null; end;
  begin
    update public.news_posts set revision = 999 where id = saved.id;
    raise exception 'Admin can write server revision';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
select set_config('request.jwt.claim.sub', '', true);
set local role anon;
do $$
begin
  if exists (select 1 from public.news_posts where id = current_setting('test.post_id')::uuid) then raise exception 'Anonymous draft read'; end if;
  begin
    insert into public.news_posts (title, slug, category) values ('Denied', current_setting('test.slug') || '-anon', 'Community');
    raise exception 'Anonymous write allowed';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
declare saved public.news_posts;
declare publication timestamptz;
declare post_id uuid := current_setting('test.post_id')::uuid;
begin
  update public.news_posts set status = 'published', excerpt = 'Preview', body = 'Article text', author = 'GT Esports',
    cover_path = current_setting('test.cover'), cover_alt = 'A test image'
    where id = post_id and revision = 1 returning * into saved;
  if not found or saved.revision <> 2 or saved.published_at is null then raise exception 'Publish failed'; end if;
  publication := saved.published_at;
  update public.news_posts set title = 'Edited headline' where id = post_id and revision = 2 returning * into saved;
  if not found or saved.revision <> 3 or saved.published_at is distinct from publication then raise exception 'Published edit failed'; end if;
  update public.news_posts set title = 'Stale edit' where id = post_id and revision = 1;
  if found then raise exception 'Stale edit accepted'; end if;
  delete from public.news_posts where id = post_id and revision = 2;
  if found then raise exception 'Stale deletion accepted'; end if;
end $$;

reset role;
select set_config('request.jwt.claim.sub', '', true);
set local role anon;
do $$
begin
  if not exists (select 1 from public.news_posts where id = current_setting('test.post_id')::uuid
    and title = 'Edited headline' and cover_path = current_setting('test.cover'))
    then raise exception 'Anonymous reader cannot see the edited published post'; end if;
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.member_id'), true);
set local role authenticated;
do $$
declare post_id uuid := current_setting('test.post_id')::uuid;
begin
  if not exists (select 1 from public.news_posts where id = post_id) then raise exception 'Member cannot read published post'; end if;
  if exists (select 1 from storage.objects where bucket_id = 'news-covers' and name = current_setting('test.cover'))
    then raise exception 'Member can list cover objects'; end if;
  begin
    insert into storage.objects (bucket_id, name) values ('news-covers', 'covers/' || gen_random_uuid()::text || '.png');
    raise exception 'Member upload allowed';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.news_posts (title, slug, category) values ('Denied', current_setting('test.slug') || '-member', 'Community');
    raise exception 'Member insert allowed';
  exception when insufficient_privilege then null; end;
  update public.news_posts set title = 'Denied' where id = post_id;
  if found then raise exception 'Member edit allowed'; end if;
  delete from public.news_posts where id = post_id;
  if found then raise exception 'Member delete allowed'; end if;
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
declare saved public.news_posts;
begin
  update public.news_posts set status = 'draft' where id = current_setting('test.post_id')::uuid and revision = 3 returning * into saved;
  if not found or saved.revision <> 4 or saved.published_at is not null then raise exception 'Move to draft failed'; end if;
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.member_id'), true);
set local role authenticated;
do $$
begin
  if exists (select 1 from public.news_posts where id = current_setting('test.post_id')::uuid)
    then raise exception 'Withdrawn post visible to a member'; end if;
end $$;

reset role;
update public.user_roles set role = 'member' where user_id = current_setting('test.admin_id')::uuid;
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
declare post_id uuid := current_setting('test.post_id')::uuid;
begin
  if exists (select 1 from public.news_posts where id = post_id) then raise exception 'Revoked admin can read draft'; end if;
  update public.news_posts set title = 'Denied' where id = post_id;
  if found then raise exception 'Revoked admin edit allowed'; end if;
  delete from public.news_posts where id = post_id;
  if found then raise exception 'Revoked admin delete allowed'; end if;
end $$;

reset role;
update public.user_roles set role = 'admin' where user_id = current_setting('test.admin_id')::uuid;
set local role authenticated;
do $$
begin
  delete from public.news_posts where id = current_setting('test.post_id')::uuid and revision = 4;
  if not found then raise exception 'Admin deletion failed'; end if;
end $$;
reset role;
rollback;
select 'News management checks passed; all fixtures rolled back' as result;
