# Local Setup

This repo is configured for a Next.js + Supabase stack. Follow these steps to get it running locally.

## 1) Environment variables

Create a `.env.local` at the repository root (this file is .gitignored) by copying the example:

```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Your Supabase service role key (never commit this)
- `NEXT_PUBLIC_APP_URL` — For local dev, use `http://localhost:3000`
- `NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE` — Optional, if used in UI

## 2) Install and run

```bash
npm install
npm run dev
# open http://localhost:3000
```

## 3) Database migration on Supabase

Run the initial migration in your Supabase project:

- Open Supabase Dashboard → SQL Editor.
- Paste the contents of `supabase/migrations/0001_init.sql` from this repository.
- Execute.

This sets up tables, enums, indexes, and policies.

## 4) Bootstrap an admin user

- Register a user in the app or create one in Supabase Auth.
- Open Supabase Dashboard → SQL Editor.
- Open `supabase/sql/grant_admin_by_email.sql`, replace the placeholder email with your admin’s email, and run it.

Now that user can access admin pages.

## 5) Next steps (optional)

- Verify `/admin` loads for the admin user.
- Adjust any plan or UI configuration in your code as needed.