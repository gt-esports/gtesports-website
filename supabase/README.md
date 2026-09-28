# Supabase Setup

This folder contains SQL migrations for the project's Supabase database.

## Running Migrations

Migrations are numbered sequentially and should be run in order against your Supabase project.

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

## Environment Variables

The app requires these environment variables (see `.env.example`):

- `VITE_SUPABASE_URL` — Your Supabase project URL (e.g. `https://abc123.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` — Your Supabase anon/public key

Copy `.env.example` to `.env` and fill in the values from your Supabase project settings → API.

## Email Verification

Supabase is configured to require email verification on sign up. After a user signs up, they receive a confirmation email with a link. The redirect URL for this link should be configured in your Supabase project:

1. Go to **Authentication → URL Configuration** in the Supabase Dashboard
2. Set the **Site URL** to your production domain (e.g. `https://gatesports.com`)
3. Add `https://your-domain.com/auth/callback` to **Redirect URLs**
4. For local development, also add `http://localhost:5173/auth/callback`
