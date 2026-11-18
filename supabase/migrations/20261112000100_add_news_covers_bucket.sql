-- News covers appear on public articles; uploads require current admin access.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-covers',
  'news-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

alter table public.news_posts
  add column if not exists cover_path text not null default '';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.news_posts'::regclass
      and conname = 'news_posts_cover_path_check'
  ) then
    alter table public.news_posts
      add constraint news_posts_cover_path_check
      check (
        (cover_path = '' or cover_path ~ '^covers/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(jpg|png|webp)$')
        and not (cover_path <> '' and cover_url <> '')
        and (cover_path = '' or length(btrim(cover_alt)) > 0)
      );
  end if;
end $$;

revoke all (cover_path) on public.news_posts from authenticated;
grant insert (cover_path), update (cover_path) on public.news_posts to authenticated;

-- Public URLs serve covers without granting visitors permission to list objects.
-- Upload/list authorization stays in the existing admin-only Storage policies.
