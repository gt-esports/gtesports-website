# Supabase Setup

This folder contains SQL migrations for the project's Supabase database.

## Running Migrations

Run migrations in filename order. The original migration uses a numeric prefix;
new migrations use CLI-generated timestamps.

### Option A: Supabase Dashboard (recommended for quick setup)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy the contents of each migration file (in order) and run them

### Option B: Supabase CLI

If you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed:

```bash
supabase db push
```

## Migrations

| File | Description |
|------|-------------|
| `00001_create_profiles.sql` | Creates the `profiles` table, auto-sync trigger from `auth.users`, and RLS policies |
| `20261014012336_add_admin_authorization.sql` | Adds protected role assignments and the `is_admin()` policy helper |
| `20261014013944_add_site_content.sql` | Adds public content documents with admin-only publishing and server-owned revisions |
| `20261014015340_add_team_headshot_uploads.sql` | Adds the public headshot bucket with admin-only uploads |
| `20261014020429_add_admin_management.sql` | Adds checked admin listing, grants, and removals for the admin dashboard |
| `20261014025403_add_marketing_contacts.sql` | Adds private marketing contacts, unique normalized emails, and server-owned revisions |
| `20261014025827_add_marketing_contact_groups.sql` | Adds Newsletter/Alumni/Both groups and active/unsubscribed/do-not-contact statuses |

## Environment Variables

The app requires these environment variables (see `.env.example`):

- `VITE_SUPABASE_URL` — Your Supabase project URL (e.g. `https://abc123.supabase.co`)
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Your Supabase publishable key

Copy `.env.example` to `.env` and fill in the values from your Supabase project settings → API.

## Email Verification

Supabase is configured to require email verification on sign up. After a user signs up, they receive a confirmation email with a link. The redirect URL for this link should be configured in your Supabase project:

1. Go to **Authentication → URL Configuration** in the Supabase Dashboard
2. Set the **Site URL** to your production domain (e.g. `https://gatesports.com`)
3. Add `https://your-domain.com/auth/callback` to **Redirect URLs**
4. For local development, also add `http://localhost:5173/auth/callback`

## Authorization

Signed-in users are members unless `public.user_roles` explicitly assigns them
`admin`. A missing assignment is a normal member; a failed role lookup denies admin
access. Signup metadata cannot grant permissions. Clients can read only their own
assignment and cannot directly insert, update, or delete assignments, including admins.

Grant the first admin through the SQL Editor using the registered account email:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'REPLACE_WITH_REGISTERED_EMAIL'
on conflict (user_id) do update set role = excluded.role
returning user_id, role;
```

Ensure this returns exactly one row. To revoke access:

```sql
update public.user_roles set role = 'member'
where user_id = 'REPLACE_WITH_USER_UUID';
```

After the first admin is assigned, use the separate **Admin access** card on the
administration dashboard and choose **Manage admin access**. This opens
`/admin/access`, a dedicated page for granting or removing other admins, with a
link back to administration. Content editor tabs only switch between website pages;
visiting admin access and returning preserves unpublished content drafts.
Grants require an existing account with a verified email address;
email lookup ignores case and surrounding whitespace. The dashboard lists current
admins with their names and emails. Removing access requires confirmation and
leaves the account as a member. Admins cannot remove themselves, preventing lockout.

The `list_admins()`, `grant_admin(target_email)`, and
`revoke_admin(target_user_id)` RPCs require current database admin access. Their
privileged implementations are in the unexposed `private` schema; public wrappers
use invoker permissions. Keep `private` out of the Data API's exposed schemas.
No role-table write permissions or broader profile-reading policies are granted
to browser clients. Role mutations serialize and recheck the caller's permissions
after acquiring the lock, so simultaneous removals cannot revoke every admin.

Reload the app after changing a role. Database policies read current assignments
on every request, so revocation does not depend on refreshing a JWT.

`useAuth()` exposes `role`, `isAdmin`, and `authorizationError`. `loading` includes
the permissions lookup. `/admin/*` is guarded by `RequireAdmin`; add future admin
pages under that guard. The navbar displays ADMIN only after admin access is verified.

### Site content editing

The admin dashboard has separate About Us, FAQs, and Our Team editors. Admins can
edit About Us body text and the team introduction; add, remove, and reorder FAQs;
and manage members, roles, headshot uploads, and LinkedIn links within the existing
executive and department rosters. Page headings, button labels, and department
sections (including their names and order) are defined in code. FAQ answers support
`[label](https://example.com)` and same-site links such as `[Games](/games)`.
HTML is rendered as text. Headshots are managed through upload, preview, and remove
controls; their URLs are stored internally. Empty headshots use the existing avatar.
Bundled headshots use stable `/headshots/` paths
so publishing a roster does not save build-specific asset filenames.

To upload a headshot, open **Admin → Our Team**, expand a member, and choose an image
under **Upload headshot**. JPG, PNG, and WebP files up to 5 MB are supported. The
uploaded image previews immediately and its URL is saved internally; click
**Publish changes** to attach it to the public roster. Uploading locks the team
editor until the request finishes so publishing or replacing a draft cannot race
the upload. An upload error preserves the previous headshot.
The uploader detects JPG/PNG/WebP from the file contents, including images with
missing browser MIME types or misleading filename extensions. Stored paths and
content types match the detected format. Unsupported bytes are rejected even if
the filename ends in `.webp`. Storage failures display the actual error message.
Run `npm run test:headshots` to check format detection, upload metadata, limits,
and error feedback without writing files to the live bucket.

The `team-headshots` Storage bucket is public so visitors can view roster photos.
Only current database admins can upload or list objects. Bucket limits enforce file
size and MIME types; the app additionally checks file signatures. Each upload has
a unique filename. Browser clients cannot overwrite or delete uploaded files.
**Remove headshot** restores the avatar after publishing; it does not delete the
stored image. Replaced and discarded uploads are retained and can be cleaned up
through the Storage dashboard once they are no longer referenced by the roster.

Each section has its own **Publish changes** button. Switching editor tabs preserves
drafts; **Discard edits and reload published content** replaces the local draft.
Public pages fetch published documents on mount. Reload an already-open public page
to see a new publication. Until the first publication, or if loading fails, public
pages use the bundled content. A failed admin load requires a retry rather than
silently editing fallback content.

`public.site_content` stores one JSON document per section (`about`, `faq`, `team`).
Visitors and members can read published content. Only accounts recognized by
`is_admin()` can insert or update it. Clients cannot delete documents or change
sections, timestamps, or revisions. Removing an FAQ or member edits
the relevant document. Content shape and size are constrained in the database;
the app validates required fields and URL schemes before saving or rendering.

Server-owned revisions prevent stale edits from overwriting newer publications.
On a conflict, copy any edits you want to preserve before reloading the published
content. Browser close/reload warns when there are unpublished changes.

### Marketing contacts

Open **Admin → Manage contacts** (`/admin/contacts`) to manage newsletter subscribers
and alumni. Each email has one record with a **Newsletter**, **Alumni**, or
**Newsletter + Alumni** group. Newsletter and Alumni filters each include contacts
belonging to both groups. Email status is **Active**, **Unsubscribed**, or
**Do not contact**; these labels track eligibility and do not send emails.
Optional fields include name, organization, category, last-contacted date, and notes.
Admins can add/edit records, search all text fields, filter by group/status, and
delete after confirmation. Concurrent edits/deletions check the loaded revision;
a stale change requires refreshing and reopening the record.

To migrate an existing spreadsheet, export it as CSV with an `email` header.
Optional headers are `name`, `organization`, `category`, `contact_group`, `status`,
`last_contacted`, and `notes`. Headers ignore case and spaces become underscores.
Groups use `newsletter`, `alumni`, or `both`; statuses use `active`, `unsubscribed`,
or `do_not_contact`; dates use `YYYY-MM-DD`. Missing group/status values default to
`newsletter`/`active`, so include those columns to retain alumni membership and
unsubscribes. Files must be under 1 MB with at most 500 contact rows. Quoted commas,
quotes, multiline notes, UTF-8 BOMs, and Windows line endings are supported.

The import shows a preview before saving. Invalid records reject the entire
preview. Duplicate emails ignore case/whitespace; the first CSV record wins within
a file. Existing database records are skipped, preserving their group, unsubscribe
status, and notes. Change existing records through **Edit**. The import is one
atomic database request. **Export shown contacts** downloads exactly the current
search/group/status results, including status and group columns; filter to Active
when preparing a mailing list. Formula prefixes are neutralized for spreadsheet
safety. There is no automatic account signup, newsletter signup form, mailing
provider integration, or email sending in this feature. Public contact submissions
remain separate.

`public.marketing_contacts` enforces admin-only CRUD using current `is_admin()`
assignments and RLS. Visitors have no table grants; signed-in members cannot read
or mutate records. The database normalizes emails, enforces uniqueness/field limits,
and owns record IDs on update, creation timestamps, update timestamps, and revisions.

Both migrations and `supabase/tests/marketing_contacts.sql` passed on `main-site`.
SQL checks cover admin CRUD, member/visitor/revoked-admin denials, group/status
validation, normalization, duplicate imports preserving unsubscribes, server-owned
fields, and stale edits/deletions. All fixtures rolled back. Run
`npm run test:contacts` for CSV and validation checks. Browser flows were verified
locally with mock accounts/data; real account flows require frontend deployment.
No security advisor finding targeted the contacts table or trigger function.

### Verification

Run `supabase/tests/admin_authorization.sql` in the SQL Editor as postgres.
It tests admin CRUD, member/anonymous denials, role privacy, blocked self-promotion,
ignored user metadata, and immediate revocation. All fixtures roll back.

Run `supabase/tests/admin_management.sql` for admin listing, normalized email
grants, repeated grants, verified-email requirements, removal, self-removal
protection, direct-table write denials, and member/anonymous/revoked-caller denials.
The migration and transactional checks were applied successfully to `main-site`;
all fixtures rolled back and existing account roles were preserved. Concurrent
mutual revocation was also tested in a temporary local Postgres database: only the
first removal succeeds and one admin remains. Browser grant, removal, and error
feedback were checked with local mock accounts; real account flows still require
verification after frontend deployment.

Run `supabase/tests/site_content.sql` for admin publishing, public reads,
member/anonymous write denials, immediate revocation, version tampering, content
constraints, and stale-save protection. This migration and its SQL checks were
applied successfully to `main-site`; fixtures rolled back and no page content was
published during verification. The frontend still requires deployment.

Run `supabase/tests/team_headshots.sql` to verify bucket settings, admin uploads,
member/visitor denials, revocation, allowed paths/extensions, and overwrite protection.
It uses transactional Storage metadata fixtures without uploading actual files.
The bucket migration and permission checks were applied successfully to `main-site`.
An authenticated admin upload through the browser still needs verification after
frontend deployment.

The authorization migration and SQL checks were applied successfully to the
`main-site` project. This does not deploy the frontend or grant a real account admin
access. The security advisor reported existing warnings for `handle_new_user`,
`rls_auto_enable`, and disabled leaked-password protection; no warning targeted the
new role table or helper.

Existing advisor remediation: [function search path](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable),
[anonymous function execution](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable),
[authenticated function execution](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable),
and [leaked-password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Central API staging prerequisite

Apply `migrations/20261026000100_grant_profile_reads.sql` after the existing
profile migration when preparing the central API integration. It explicitly
grants profile reads to the `authenticated` database role. It preserves the
existing row-level policy that permits only the user's own profile, and gives
no new permission to anonymous users. Older projects often already have this
grant; the migration is safe to reapply. New projects must not depend on legacy
Supabase default table grants.

The APIservice PR's disposable database integration suite runs the profile,
admin-role, contact and group migrations plus this grant against local GoTrue,
PostgreSQL and PostgREST. It also runs the existing admin-authorization and
marketing-contact SQL checks. These tests do not apply migrations or create
accounts in the hosted Supabase project.
