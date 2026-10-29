SET local check_function_bodies = off;

CREATE TABLE "public"."news_posts" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "title"        text                     NOT NULL,
  "slug"         text                     NOT NULL,
  "excerpt"      text                     NOT NULL DEFAULT ''::text,
  "body"         text                     NOT NULL DEFAULT ''::text,
  "author"       text                     NOT NULL DEFAULT 'GT Esports'::text,
  "category"     text                     NOT NULL,
  "cover_url"    text                     NOT NULL DEFAULT ''::text,
  "cover_alt"    text                     NOT NULL DEFAULT ''::text,
  "featured"     boolean                  NOT NULL DEFAULT false,
  "status"       text                     NOT NULL DEFAULT 'draft'::text,
  "revision"     integer                  NOT NULL DEFAULT 1,
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "published_at" timestamp with time zone,
  CONSTRAINT "news_posts_author_check" CHECK ((length(author) <= 100)),
  CONSTRAINT "news_posts_body_check" CHECK ((length(body) <= 100000)),
  CONSTRAINT "news_posts_category_check" CHECK ((category = ANY (ARRAY['Community'::text, 'Competition'::text, 'Events'::text, 'Announcements'::text]))),
  CONSTRAINT "news_posts_check1" CHECK (((status <> 'published'::text) OR ((length(btrim(excerpt)) > 0) AND (length(btrim(body)) > 0) AND (length(btrim(author)) > 0)))),
  CONSTRAINT "news_posts_check" CHECK (((cover_url = ''::text) OR (length(btrim(cover_alt)) > 0))),
  CONSTRAINT "news_posts_cover_alt_check" CHECK ((length(cover_alt) <= 300)),
  CONSTRAINT "news_posts_cover_url_check" CHECK (((length(cover_url) <= 2000) AND ((cover_url = ''::text) OR (cover_url ~ '^https://[^[:space:]\\]+$'::text)))),
  CONSTRAINT "news_posts_excerpt_check" CHECK ((length(excerpt) <= 400)),
  CONSTRAINT "news_posts_pkey" PRIMARY KEY (id),
  CONSTRAINT "news_posts_slug_check" CHECK ((((length(slug) >= 1) AND (length(slug) <= 120)) AND (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::text))),
  CONSTRAINT "news_posts_slug_key" UNIQUE (slug),
  CONSTRAINT "news_posts_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text]))),
  CONSTRAINT "news_posts_title_check" CHECK (((length(btrim(title)) >= 1) AND (length(btrim(title)) <= 180)))
);

ALTER TABLE "public"."news_posts"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog'
  AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.subscribe_newsletter (
  subscriber_email text,
  subscriber_name  text DEFAULT ''::text
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  normalized_email text := lower(btrim(coalesce(subscriber_email, '')));
  normalized_name text := btrim(coalesce(subscriber_name, ''));
begin
  if normalized_email = '' or length(normalized_email) > 254
     or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a valid email address.' using errcode = '22023';
  end if;
  if length(normalized_name) > 200 then
    raise exception 'Name must be at most 200 characters.' using errcode = '22023';
  end if;
  insert into public.marketing_contacts (email, name, contact_group, status)
  values (normalized_email, normalized_name, 'newsletter', 'active')
  on conflict (email) do nothing;
end;
$function$;

CREATE OR REPLACE FUNCTION public.version_news_post()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
  if TG_OP = 'INSERT' then
    new.revision := 1;
    new.created_at := now();
    new.published_at := case when new.status = 'published' then now() else null end;
  else
    new.id := old.id;
    new.created_at := old.created_at;
    new.revision := old.revision + 1;
    new.published_at := case when new.status = 'published' then coalesce(old.published_at, now()) else null end;
  end if;
  new.updated_at := now();
  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."version_news_post"() FROM PUBLIC, "anon", "authenticated";

CREATE OR REPLACE FUNCTION public.version_site_content()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
 if TG_OP = 'INSERT' then new.revision := 1;
 else new.section := old.section; new.revision := old.revision + 1;
 end if;
 new.updated_at := now(); return new;
end; $function$;

CREATE INDEX news_posts_publication ON public.news_posts USING btree (published_at DESC)
  WHERE (status = 'published'::text);

CREATE TRIGGER version_news_post
  BEFORE INSERT OR UPDATE ON public.news_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.version_news_post();

CREATE POLICY "Admins create news" ON "public"."news_posts"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT public.is_admin() AS is_admin));

CREATE POLICY "Admins delete news" ON "public"."news_posts"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT public.is_admin() AS is_admin));

CREATE POLICY "Admins edit news" ON "public"."news_posts"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT public.is_admin() AS is_admin))
  WITH CHECK (( SELECT public.is_admin() AS is_admin));

CREATE POLICY "Admins read drafts" ON "public"."news_posts"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.is_admin() AS is_admin));

CREATE POLICY "Visitors read published news" ON "public"."news_posts"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((status = 'published'::text));

CREATE POLICY "Admins list news covers" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'news-covers'::text) AND ( SELECT public.is_admin() AS is_admin)));

CREATE POLICY "Admins upload news covers" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'news-covers'::text) AND ( SELECT public.is_admin() AS is_admin) AND (name ~ '^covers/[0-9a-f-]+\.(jpg|png|webp)$'::text)));

CREATE EVENT TRIGGER "ensure_rls"
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION "public"."rls_auto_enable"();

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "service_role";

REVOKE ALL ON FUNCTION "public"."subscribe_newsletter"(text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."subscribe_newsletter"(text, text) TO "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."subscribe_newsletter"(text, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."subscribe_newsletter"(text, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."subscribe_newsletter"(text, text) TO "service_role";

REVOKE ALL ON FUNCTION "public"."version_news_post"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."version_news_post"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."version_news_post"() TO "service_role";

REVOKE ALL ON TABLE "public"."news_posts" FROM "anon";

GRANT SELECT ON TABLE "public"."news_posts" TO "anon";

REVOKE ALL ON TABLE "public"."news_posts" FROM "authenticated";

REVOKE ALL ("author") ON TABLE "public"."news_posts" FROM "authenticated";

GRANT INSERT ("author"), UPDATE ("author") ON TABLE "public"."news_posts" TO "authenticated";

REVOKE ALL ("body") ON TABLE "public"."news_posts" FROM "authenticated";

GRANT INSERT ("body"), UPDATE ("body") ON TABLE "public"."news_posts" TO "authenticated";

REVOKE ALL ("category") ON TABLE "public"."news_posts" FROM "authenticated";

GRANT INSERT ("category"), UPDATE ("category") ON TABLE "public"."news_posts" TO "authenticated";

REVOKE ALL ("cover_alt") ON TABLE "public"."news_posts" FROM "authenticated";

GRANT INSERT ("cover_alt"), UPDATE ("cover_alt") ON TABLE "public"."news_posts" TO "authenticated";

REVOKE ALL ("cover_url") ON TABLE "public"."news_posts" FROM "authenticated";

GRANT INSERT ("cover_url"), UPDATE ("cover_url") ON TABLE "public"."news_posts" TO "authenticated";

REVOKE ALL ("excerpt") ON TABLE "public"."news_posts" FROM "authenticated";

GRANT INSERT ("excerpt"), UPDATE ("excerpt") ON TABLE "public"."news_posts" TO "authenticated";

REVOKE ALL ("featured") ON TABLE "public"."news_posts" FROM "authenticated";

GRANT INSERT ("featured"), UPDATE ("featured") ON TABLE "public"."news_posts" TO "authenticated";

REVOKE ALL ("slug") ON TABLE "public"."news_posts" FROM "authenticated";

GRANT INSERT ("slug"), UPDATE ("slug") ON TABLE "public"."news_posts" TO "authenticated";

REVOKE ALL ("status") ON TABLE "public"."news_posts" FROM "authenticated";

GRANT INSERT ("status"), UPDATE ("status") ON TABLE "public"."news_posts" TO "authenticated";

REVOKE ALL ("title") ON TABLE "public"."news_posts" FROM "authenticated";

GRANT INSERT ("title"), UPDATE ("title") ON TABLE "public"."news_posts" TO "authenticated";

GRANT DELETE, SELECT ON TABLE "public"."news_posts" TO "authenticated";

REVOKE ALL ON TABLE "public"."news_posts" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."news_posts" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."news_posts" TO "service_role";

