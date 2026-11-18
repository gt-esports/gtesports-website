# Competitor management MVP

Staff use **Administration → Competitors & rosters** (`/admin/competitors`).

1. Open an existing roster from **Team rosters**, or select **Create roster** and enter the game, team name, and season. The roster list includes teams with zero competitors. Each season has a separate roster.
2. Select **Add competitor** on the roster and enter their preferred name, email, and position. They do not need an account yet. Use the email they will verify with the site's authentication provider.
3. The membership editor opens when you add a competitor. For existing entries, select **Manage**. Create a personal invitation link and copy it into your usual Discord message or email. Creating a link does not send a message. The link is displayed only when created; creating another link replaces it.
4. The competitor opens the link, signs in or creates an account, verifies their email, and accepts the invitation. Email/password and Discord sign-in both return to onboarding in the same browser tab. If email verification opens a different tab/device, reopen the invitation there.
5. The player enters their preferred name and game account. Their Discord username is read from the linked account and is read-only. Staff can filter onboarding progress on a team roster or across teams in **All competitors**.
6. Change a membership to inactive or former to keep history. This also revokes any unclaimed invitation. Reactivating an unclaimed membership requires a new invitation.

Use **Edit roster** to change the team name, game, or season, or permanently delete the roster. Deleting a roster removes its memberships and invitations. **Manage** lets staff edit competitor details or permanently delete a single membership and its invitation. Website accounts and memberships on other teams are retained.

Competitor information can be reopened at `/competitors/onboarding`. Players can edit their own active membership information after completing onboarding. Staff control competitive status and roster position.

## Install and validate

Apply the competitor-management migrations in timestamp order, using the normal Supabase migration workflow. Do not paste frontend service-role credentials into this feature. The page shows a retryable error if it cannot load the roster directory.

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

Roster updates use a version timestamp to avoid overwriting a concurrent change. Onboarding state is independent of active/inactive/former membership status. Expired invitations have their own onboarding filter.

The MVP does not send emails, handle tryout applications, verify league eligibility, publish public rosters, bulk-import spreadsheets, or automatically synchronize Discord roles. Players provide in-game account details per membership. Staff can correct the email of an unclaimed entry. Changing it invalidates the previous invitation.
