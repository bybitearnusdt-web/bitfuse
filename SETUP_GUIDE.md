# BITFUSE Setup Guide

This guide provides step-by-step instructions for setting up the BITFUSE cryptocurrency investment platform for both local development and production deployment.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 20+** installed ([Download](https://nodejs.org/))
- [ ] **npm** or **pnpm** package manager
- [ ] **Git** for version control
- [ ] **Supabase account** ([Sign up](https://supabase.com/))
- [ ] **Vercel account** for deployment ([Sign up](https://vercel.com/))
- [ ] **Code editor** (VS Code recommended)

## 🚀 Local Development Setup

### Step 1: Repository Setup
- [ ] Clone the repository:
  ```bash
  git clone https://github.com/bybitearnusdt-web/bitfuse.git
  cd bitfuse
  ```

- [ ] Install dependencies:
  ```bash
  npm install
  ```

### Step 2: Environment Configuration
- [ ] Copy the environment template:
  ```bash
  cp .env.example .env.local
  ```

- [ ] Edit `.env.local` with your configuration (see Environment Variables section below)

- [ ] Verify environment file is in `.gitignore` (should be there by default)

### Step 3: Supabase Database Setup
- [ ] **Create Supabase Project**:
  - Go to [Supabase Dashboard](https://supabase.com/dashboard)
  - Click "New project"
  - Choose organization and set project name (e.g., "bitfuse-dev")
  - Set database password (save this securely)
  - Choose region (closest to your users)
  - Wait for project creation (~2 minutes)

- [ ] **Get Supabase Credentials**:
  - Go to Settings → API
  - Copy Project URL (format: `https://xxx.supabase.co`)
  - Copy `anon/public` key
  - Copy `service_role` key (keep this secret!)

- [ ] **Run Database Migration**:
  - Go to SQL Editor in Supabase dashboard
  - Open `supabase/migrations/0001_init.sql` from your project
  - Copy and paste the entire contents
  - Click "Run" to execute the migration
  - Verify tables are created in the Table Editor

- [ ] **Configure Authentication**:
  - Go to Authentication → Settings
  - Enable email confirmation if desired
  - Set site URL to `http://localhost:3000`
  - Configure redirect URLs for auth flows

### Step 4: Environment Variables Configuration

Update your `.env.local` file with the actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE=+5511999999999
```

### Step 5: Start Development Server
- [ ] Run the development server:
  ```bash
  npm run dev
  ```

- [ ] Open [http://localhost:3000](http://localhost:3000) in your browser

- [ ] Verify the application loads correctly

- [ ] Test basic functionality:
  - [ ] Navigation works
  - [ ] Dark theme is applied
  - [ ] WhatsApp support widget appears

### Step 6: Code Quality Setup
- [ ] Run linting:
  ```bash
  npm run lint
  ```

- [ ] Run type checking:
  ```bash
  npm run typecheck
  ```

- [ ] Format code:
  ```bash
  npm run format
  ```

## 🏭 Production Deployment

### Step 1: Production Supabase Setup
- [ ] **Create Production Project**:
  - Create a new Supabase project for production
  - Use a different name (e.g., "bitfuse-prod")
  - Choose appropriate region for your target market
  - Set strong database password

- [ ] **Run Production Migration**:
  - Execute the same migration as development
  - Verify all tables and policies are created
  - Test RLS policies are working correctly

- [ ] **Configure Production Auth**:
  - Set production site URL
  - Configure custom SMTP for emails (optional)
  - Set up proper redirect URLs

### Step 2: Vercel Deployment
- [ ] **Import to Vercel**:
  - Go to [Vercel Dashboard](https://vercel.com/dashboard)
  - Click "New Project"
  - Import your GitHub repository
  - Vercel will auto-detect Next.js configuration

- [ ] **Configure Environment Variables**:
  In Vercel project settings → Environment Variables, add:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
  NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
  NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE=+5511999999999
  ```

- [ ] **Deploy**:
  - Click "Deploy" or use CLI:
    ```bash
    npx vercel --prod
    ```
  - Wait for deployment to complete
  - Verify deployment at provided URL

### Step 3: Post-Deployment Configuration
- [ ] **Update Supabase Settings**:
  - Add production domain to allowed origins
  - Update auth redirect URLs
  - Test authentication flows

- [ ] **Test Production Environment**:
  - [ ] Application loads correctly
  - [ ] Authentication works
  - [ ] Database connections are successful
  - [ ] All environment variables are properly set

## 👨‍💼 Admin User Setup

### Step 1: Create First Admin User
- [ ] Register a user through the normal registration flow
- [ ] Note the user ID from Supabase Auth dashboard

### Step 2: Grant Admin Privileges
- [ ] Go to Supabase SQL Editor
- [ ] Run the following query:
  ```sql
  INSERT INTO admin_roles (user_id, role)
  VALUES ('your-user-id-here', 'admin');
  ```

### Step 3: Verify Admin Access
- [ ] Log in with the admin user
- [ ] Verify admin dashboard access
- [ ] Test admin functionality

## 🔧 Development Workflow

### Daily Development
- [ ] Pull latest changes: `git pull origin main`
- [ ] Install new dependencies: `npm install`
- [ ] Start development server: `npm run dev`
- [ ] Run linting before commits: `npm run lint`

### Before Committing
- [ ] Run all checks:
  ```bash
  npm run lint
  npm run typecheck
  npm run build
  ```
- [ ] Test core functionality
- [ ] Ensure no sensitive data in commits

## 🚨 Troubleshooting

### Common Issues

**❌ "Supabase client not found" error**
- [ ] Verify environment variables are set correctly
- [ ] Check `.env.local` file exists and has correct values
- [ ] Restart development server after env changes

**❌ "Authentication failed" error**
- [ ] Verify Supabase project is active
- [ ] Check anon key is correct
- [ ] Ensure site URL is configured in Supabase auth settings

**❌ "Build failed" error**
- [ ] Run `npm run typecheck` to find TypeScript errors
- [ ] Check all imports are correct
- [ ] Verify environment variables are set in deployment

**❌ "Database connection failed"**
- [ ] Verify Supabase project is running
- [ ] Check service role key is correct
- [ ] Ensure RLS policies allow your operations

### Getting Help

**Development Issues:**
- Check the console for error messages
- Verify environment variables in browser dev tools
- Check Supabase logs for database issues

**Deployment Issues:**
- Check Vercel deployment logs
- Verify all environment variables are set in Vercel
- Test build locally with `npm run build`

**Database Issues:**
- Check Supabase logs
- Verify RLS policies
- Test queries in Supabase SQL editor

## 📞 Support

If you need help:
- **WhatsApp**: +5511999999999
- **Email**: support@bitfuse.com
- **Documentation**: Check README.md for additional details

## 🔐 Security Checklist

### Environment Security
- [ ] `.env.local` is in `.gitignore`
- [ ] Service role keys are never exposed to client
- [ ] Production and development use different Supabase projects
- [ ] Strong database passwords are used

### Application Security
- [ ] RLS policies are properly configured
- [ ] Authentication is working correctly
- [ ] Admin access is restricted to authorized users
- [ ] All user inputs are validated

---

✅ **Setup Complete!** Your BITFUSE installation should now be ready for development or production use.

For additional configuration options and advanced features, refer to the main [README.md](./README.md) file.