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
assignment and cannot insert, update, or delete assignments, including admins.

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

Reload the app after changing a role. Database policies read current assignments
on every request, so revocation does not depend on refreshing a JWT.

`useAuth()` exposes `role`, `isAdmin`, and `authorizationError`. `loading` includes
the permissions lookup. `/admin/*` is guarded by `RequireAdmin`; add future admin
pages under that guard. The navbar displays ADMIN only after admin access is verified.

### Future site content and contact management

The route guard controls the interface. Every new table, Storage bucket, or server
endpoint must also enforce authorization. No content editor or contact inbox is
implemented yet. Existing public contact submission remains separate from admin
contact management.

For an admin-only table, replace `contacts` with the actual table name:

```sql
alter table public.contacts enable row level security;
revoke all on public.contacts from public, anon, authenticated;
grant select, insert, update, delete on public.contacts to authenticated;
create policy "Admins manage contacts"
on public.contacts for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));
```

For site content, use the same admin policy and add a separate SELECT grant/policy
for published content visible to visitors. Contact records must not inherit public
SELECT access. Any public contact submission endpoint needs its own narrowly scoped
insert path and abuse controls. Never expose a service-role key in the browser.

### Verification

Run `supabase/tests/admin_authorization.sql` in the SQL Editor as postgres.
It tests admin CRUD, member/anonymous denials, role privacy, blocked self-promotion,
ignored user metadata, and immediate revocation. All fixtures roll back.

The authorization migration and SQL checks were applied successfully to the
`main-site` project. This does not deploy the frontend or grant a real account admin
access. The security advisor reported existing warnings for `handle_new_user`,
`rls_auto_enable`, and disabled leaked-password protection; no warning targeted the
new role table or helper.

Existing advisor remediation: [function search path](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable),
[anonymous function execution](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable),
[authenticated function execution](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable),
and [leaked-password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
