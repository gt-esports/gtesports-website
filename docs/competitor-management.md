# Competitor management MVP

Staff use **Administration → Competitors & rosters** (`/admin/competitors`).

1. Create a team with its game, team name, and season. Seasons have separate rosters, so previous assignments remain available.
2. Add an existing competitor with their preferred name, email, and position. They do not need an account yet. Use the email they will verify with the site's authentication provider.
3. Open **Manage**, create a personal invitation link, and copy it into your usual Discord message or email. Creating a link does not send a message. The link is displayed only when created; creating another link replaces it.
4. The competitor opens the link, signs in or creates an account, verifies their email, and accepts the invitation. Email/password and Discord sign-in both return to onboarding in the same browser tab. If email verification opens a different tab/device, reopen the invitation there.
5. The player completes their preferred name, Discord contact, and game account. Staff can filter onboarding progress in the directory.
6. Change a membership to inactive or former to keep history. This also revokes any unclaimed invitation. Reactivating an unclaimed membership requires a new invitation.

Competitor information can be reopened at `/competitors/onboarding`. Players can edit their own active membership information after completing onboarding. Staff control competitive status and roster position.

## Install and validate

Apply `supabase/migrations/20261118000100_competitor_management.sql` after the existing migrations, using the normal Supabase migration workflow. Do not paste frontend service-role credentials into this feature. The page reports a clear unavailable message until the migration is applied.

- `npm run build`
- `node --test tests/competitors.test.mjs`
- `npx eslint src/features/competitors --ext ts,tsx --max-warnings 0`
- Run `supabase/tests/competitor_management.sql` as postgres against a local/test Supabase database after migrations. All test fixtures roll back. For example: `psql "$TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/competitor_management.sql`.

The SQL suite covers admin authorization, RLS, direct-write denial, private invitation storage, wrong and unverified recipients, replaced/expired/revoked links, replay prevention, own-profile changes, roster history, and stale writes.

Manual acceptance: use one admin account and a different verified competitor account. Create a team/entry, copy and accept an invitation, finish onboarding, verify the staff directory, then mark the entry former. Also try the invitation with a third account, and check mobile layout and clipboard fallback.

## Permissions and scope

This first version uses existing **website admins** for management. Being a captain or competitor never grants website admin access. Team-specific manager permissions are a later extension.

Invitation tokens expire after seven days, are stored only as SHA-256 hashes in a private table, and are single-use. The browser receives the raw token only when staff generate it. Invitation URLs carry the token in the fragment; the onboarding page removes it from the address bar and temporarily keeps it in same-tab session storage for sign-in. Tokens must match both a currently active roster entry and the authenticated account's verified email. Revocation and reissue invalidate older links. Acceptance and reissue lock the same roster entry to serialize concurrent requests.

Database RLS restricts roster reads to admins and each linked player. All mutations go through permission-checked database functions. Account email verification comes from `auth.users`, never editable user metadata. Competitor data is private and is not published on public team pages.

Roster updates use a version timestamp to avoid overwriting a concurrent change. Onboarding state is independent of active/inactive/former membership status. Awaiting acceptance includes expired invitations, which also have their own filter.

The MVP does not send emails, handle tryout applications, verify league eligibility, publish public rosters, bulk-import spreadsheets, or automatically synchronize Discord roles. Players provide contact details per membership. If staff entered an incorrect email, mark that unclaimed entry former and create a corrected entry with a new invitation.

## Validation in this checkout

The production build, focused ESLint check, and offline unit tests pass. Full Supabase integration and browser validation still need a running local/test stack: Docker was unavailable; the installed Supabase CLI rejected existing config keys; the sandbox denied local server sockets and PostgreSQL shared memory. No production migration has been applied.

Work was created on `feat/competitor-management` from the existing local checkout. Git fetch was blocked by DNS resolution, so rebase onto the latest `origin/main` before opening or merging a PR. The admin navigation may need adapting if the upstream dashboard layout has changed.
