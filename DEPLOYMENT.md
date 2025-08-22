# BITFUSE Deployment Guide

## Prerequisites

- [Vercel](https://vercel.com) account
- [Supabase](https://supabase.com) account
- GitHub repository (this repository)

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization and enter project details:
   - **Name**: `bitfuse-production` (or your preferred name)
   - **Database Password**: Use a strong password
   - **Region**: Choose closest to your users
4. Wait for the project to be created (2-3 minutes)

## Step 2: Configure Database

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase/migrations/0001_init.sql` from this repository
3. Paste the SQL into the editor and click **Run** to execute the migration
4. This will create all necessary tables, functions, and policies

## Step 3: Get Supabase Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://...supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Import Project**
3. Import from your GitHub repository
4. Vercel will auto-detect the Next.js configuration
5. Before deploying, click **Environment Variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE=+5511999999999
NODE_ENV=production
```

6. Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel --prod

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE

# Redeploy with environment variables
vercel --prod
```

## Step 5: Create Admin User

1. Register a user through your deployed application
2. Note the user ID from Supabase Auth dashboard
3. In Supabase SQL Editor, run:

```sql
INSERT INTO admin_roles (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

## Step 6: Verify Deployment

1. Visit your deployed application URL
2. Test user registration and login
3. Check that the dashboard loads correctly
4. Test the admin panel with your admin user

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL | ✅ |
| `NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE` | Support WhatsApp number | ❌ |
| `NODE_ENV` | Environment (production) | ❌ |

## Security Notes

- Never commit the `.env.local` file with real credentials
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret and only use it server-side
- Enable RLS (Row Level Security) policies in Supabase for data protection
- Consider enabling 2FA for your Supabase and Vercel accounts

## Monitoring and Maintenance

- Monitor your Supabase dashboard for database usage
- Check Vercel analytics for application performance
- Regularly backup your database
- Keep dependencies updated

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Ensure your Supabase project is active and accessible

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check that email confirmations are configured in Supabase

### Database Connection Issues
- Ensure your Supabase project is not paused
- Check that migrations were run successfully

## Support

For issues specific to this application, please check the repository issues or create a new one.