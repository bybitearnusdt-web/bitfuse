# Deployment Guide (Vercel + Supabase)

This app runs on Next.js with Supabase. Follow these steps to deploy to Vercel.

## Prerequisites
- Vercel account with access to this GitHub repo
- Supabase project (URL + keys)
- The database initialized with our migrations

## 1) Prepare Supabase
1. Open Supabase Dashboard → SQL Editor.
2. Run the initial migration from this repo:
   - File: `supabase/migrations/0001_init.sql`
3. Create an admin user:
   - Register a user through the app (or create one via Supabase Auth).
   - Run `supabase/sql/grant_admin_by_email.sql`, replacing the placeholder email with your admin’s email.

Optional but recommended:
- In Supabase → Authentication → URL Configuration:
  - Set “Site URL” to your production domain (e.g., `https://your-app.vercel.app`).
  - Add any redirect URLs used by your app as needed.

## 2) Create a Vercel Project
1. In Vercel, “New Project” → Import this GitHub repository.
2. Framework Preset: Next.js (defaults are OK).
3. Build & Output:
   - Build Command: `next build` (default)
   - Output Directory: `.vercel/output` (handled by Next.js)
   - Install Command: `npm install` (default)

## 3) Environment Variables (Production & Preview)
Add the following environment variables in Vercel → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-only; never exposed client-side)
- `NEXT_PUBLIC_APP_URL` — Your deployed URL (e.g., `https://your-app.vercel.app`)
- `NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE` — Optional

Tips:
- Set variables for both “Production” and “Preview” environments.
- Mark `SUPABASE_SERVICE_ROLE_KEY` as “Encrypted” and use it only on server-side.

## 4) First Deployment
- Trigger the first deployment from the main branch or via “Deploy” in Vercel.
- Verify logs for a clean build.

## 5) Post-Deploy Checks
- Log in with your admin user and access `/admin`.
- Validate key flows (auth, data reads/writes).
- If you use Supabase Auth redirects, confirm redirect URLs are set in Supabase.

## 6) Maintenance
- Use PRs to deploy changes; Vercel creates Preview deployments for each PR.
- Keep `.env*` files out of version control. Only commit `.env.example`.
- Rotate keys periodically and update Vercel env vars accordingly.

Troubleshooting:
- 401/403 errors: Check RLS policies created by `0001_init.sql`.
- Admin access issues: Re-run `supabase/sql/grant_admin_by_email.sql` with the correct email.
- Missing env vars: Recheck Vercel environment variables for Production/Preview.