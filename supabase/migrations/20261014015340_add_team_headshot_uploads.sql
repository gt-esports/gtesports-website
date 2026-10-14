-- Team photos are public assets. Uploads require the current database admin role.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('team-headshots', 'team-headshots', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

-- Unique paths avoid overwriting an image already used by published content.
create policy "Admins upload team headshots"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'team-headshots'
  and (storage.foldername(name))[1] = 'headshots'
  and lower(storage.extension(name)) in ('jpg', 'png', 'webp')
  and (select public.is_admin())
);

create policy "Admins list team headshots"
on storage.objects for select to authenticated
using (bucket_id = 'team-headshots' and (select public.is_admin()));

-- No browser UPDATE or DELETE policy: published image URLs remain stable.
