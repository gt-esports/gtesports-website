# gtesports-website

This is the repository for the Georgia Tech Esports Organization Website.

This app is developed using React, Tailwind, and Vite.

Added functionality with backend server-side logic with Node.js, Express hosted on Render.
## Quick Setup for Developers

Clone the repository and run the following command:

```
npm i
```

or 

```
npm install
```


To run the application, use:

```
npm run dev
```

Happy coding! 

## Central API integration: account permissions and marketing contacts

This change is a staged migration to [APIservice](https://github.com/gt-esports/APIservice).
Supabase still owns sign-up, password and Discord sign-in, session refresh, and
sign-out. The frontend sends the current access token to `GET /v1/me` to load
the account profile and role. It never grants admin access when this request
fails or returns a different identity. A later access denial clears cached
permissions immediately; reload or sign in again to recheck access.

Marketing contacts use `/v1/main/marketing-contacts` through the same API.
List pages use the current session token, edits and deletes carry the loaded
revision, and CSV imports retain the existing preview and duplicate-skipping
behavior. These flows have no direct database fallback. A failed or timed-out
write may already have completed: refresh the list before retrying. The client
does not automatically retry writes.
Lists use offset pagination rather than a database snapshot. Avoid concurrent
contact edits during large exports, and refresh the list if records change.

For local development, use Node.js 22. Copy `.env.example` to the ignored
`.env.local`, retain the existing Supabase public configuration, and add the
central API URL:

```dotenv
VITE_SUPABASE_URL=https://YOUR_MAIN_SITE_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_OR_ANON_KEY
VITE_ESPORTS_API_URL=http://127.0.0.1:8000
```

The API URL must use HTTPS, except that HTTP is allowed for localhost,
127.0.0.1, or ::1. An optional base path is supported; credentials, query
parameters, and fragments are rejected. Never put a service-role key or other
secret in a `VITE_*` variable. The Supabase key must be a
[`sb_publishable_...` or legacy `anon` key](https://supabase.com/docs/guides/getting-started/api-keys).
Secret, service-role, and user-session keys are rejected. This local check
validates the key type, not whether the key is active or belongs to the URL.
Missing or invalid configuration now fails the production build before assets
are emitted, with variable names in the error and no configuration values.
During local development, missing API configuration leaves permissions and
private contacts unavailable. Vite reads these settings at startup/build time;
restart or rebuild after changing them.

Start APIservice separately with its documented main-site Supabase settings
and allow the exact frontend origin in its CORS configuration. Run the frontend
with `npm run dev`. Check the printed Vite origin when configuring CORS.

Run the existing CSV checks and new transport/permission tests without a live
account or database:

```bash
npm ci
npm run lint
npm run test:contacts
npm run test:api
npm run test:config
node --test tests/*.test.mjs
npm run build
```

The tests cover identity races, sign-out and unmount, access revocation,
configuration failures, fresh tokens, pagination beyond 500 contacts,
optimistic revisions, malformed responses, cancellation, and uncertain writes.

`.github/workflows/checks.yml` runs repository-wide lint, all Node test suites,
and the production build on pull requests and pushes to `main`. The build uses
public fixtures and makes no live database requests. The configuration tests
also invoke the actual Vite build configuration in an isolated directory to
check missing variables, unsafe URLs, and privileged keys without loading a
developer's environment files. AuthProvider is separated from the shared
context and hook so React Fast Refresh and the zero-warning lint gate remain
compatible.

Deployment remains a separate stage. Review the paired APIservice PR, prepare
its main-site configuration and allowed origins, deploy and verify the API in
staging, then set `VITE_ESPORTS_API_URL` for a frontend preview. Verify real
sign-in, member denial, admin CRUD, conflict handling, and CSV import in that
preview before production rollout. Keep this PR unmerged until the API is
available and the required review is complete. No deployment or merge is
performed by this implementation. The existing deployment workflow runs on
pushes to `main`.

Preview and production hosting environments must each define all three
variables in `.env.example`; they do not inherit local `.env.local` settings.
Set the preview's API URL to the deployed staging API, allow the exact preview
origin in API CORS, and include its `/auth/callback` URL in Supabase's redirect
allowlist. Rebuild the preview after updating these values. A hosting build
that reports a required variable is intentionally blocked by the configuration
gate; a green fixture-based CI build does not establish deployed API access.
Do not substitute the CI fixtures for real hosting configuration.

Please use the [Project Board](https://github.com/orgs/gt-esports/projects/1/views/1) to see what needs to be done and in general follow the Figma below. Anyone can assign/create any issues just make sure @longxiangchen reviews any pull request before merging.

Figma: https://www.figma.com/file/lqyGW7bjN0K86VaIV4JyE4/GA-TECH-ESPORTS?type=design&node-id=0%3A1&mode=design&t=91dz9g2kvXODFPip-1

If you have any suggestions for the Figma feel free to discuss them in the GT Esports Organization administration discord under the development department tab.
