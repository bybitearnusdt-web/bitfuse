# BITFUSE

![BITFUSE Logo](https://img.shields.io/badge/BITFUSE-Investment%20Platform-22c55e?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

## 🚀 Overview

BITFUSE is a production-ready cryptocurrency investment platform built with Next.js 15, featuring a complete admin dashboard, multi-level referral system, Brazilian payment integration (PIX), and comprehensive investment management.

### ✨ Key Features

- **🔐 Authentication System**: Complete login/register with Brazilian CPF/phone validation
- **💰 Investment Management**: Multiple investment plans with daily returns
- **🏦 Payment Integration**: PIX and cryptocurrency (USDT TRC20) support
- **👥 Referral System**: 5-level commission structure (10%, 5%, 3%, 2%, 1%)
- **📊 Admin Dashboard**: Full user management and balance control
- **📱 Responsive Design**: Mobile-first approach with dark theme
- **🛡️ Security**: Row Level Security (RLS) with Supabase
- **⚡ Real-time**: Live balance updates and transaction tracking
- **🌍 Brazilian Localization**: Currency formatting, date formats, and business logic

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** for components
- **React Hook Form** for form handling
- **Zod** for validation

### Backend & Database
- **Supabase** for database and authentication
- **PostgreSQL** with advanced SQL features
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates

### DevOps & Deployment
- **Vercel** for hosting and deployment
- **GitHub Actions** for CI/CD
- **ESLint & Prettier** for code quality
- **TypeScript** strict mode

## 📋 Prerequisites

- Node.js 20+ 
- npm or pnpm
- Supabase account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bitfuse.git
cd bitfuse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and configure your variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE=+5511999999999
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the migration file in the SQL editor:

```sql
-- Copy and paste the contents of supabase/migrations/0001_init.sql
```

3. Enable Row Level Security (RLS) on all tables
4. Configure authentication settings in Supabase

### 5. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
bitfuse/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── deposit/                  # Deposit flow
│   │   └── details/              # Deposit details with QR code
│   ├── withdrawal/               # Withdrawal flow
│   │   └── confirm/              # Withdrawal confirmation
│   ├── admin/                    # Admin dashboard (planned)
│   ├── investimentos/            # Investment pages (planned)
│   ├── indicacoes/               # Referral pages (planned)
│   ├── historico/                # Transaction history (planned)
│   ├── perfil/                   # User profile (planned)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Dashboard homepage
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI components (Shadcn)
│   └── layout/                   # Layout components
├── lib/                          # Utility functions and configurations
│   ├── constants.ts              # App constants and configuration
│   └── utils.ts                  # Utility functions
├── supabase/                     # Database and backend
│   └── migrations/               # SQL migration files
├── .github/                      # GitHub Actions workflows
└── public/                       # Static assets
```

## 🗄️ Database Schema

The platform uses a comprehensive PostgreSQL schema with the following key tables:

### Core Tables
- **profiles**: User information and KYC status
- **balances**: Consolidated user balance information
- **wallets**: Individual wallet balances by type/currency
- **investment_plans**: Available investment opportunities
- **investments**: User investments and their status
- **returns**: Daily returns generated from investments

### Financial Tables
- **transactions**: All financial transactions
- **withdrawals**: Withdrawal requests and processing
- **referrals**: User referral relationships
- **referral_commissions**: Commission tracking

### Admin Tables
- **admin_roles**: Role-based access control
- **admin_logs**: Audit trail of admin actions
- **system_alerts**: Platform-wide notifications

### Key Features
- **Row Level Security (RLS)**: User data isolation
- **Automated triggers**: Balance updates and commission distribution
- **Referral system**: 5-level commission structure
- **Investment protection**: Prevents withdrawal during active investments

## 🔧 Configuration

### Investment Plans

The platform includes three pre-configured investment plans:

```typescript
{
  "miner-start": {
    dailyReturn: 1.5%,
    minAmount: R$ 200,
    maxAmount: R$ 5,000,
    duration: 30 days
  },
  "miner-cosmico": {
    dailyReturn: 2.5%,
    minAmount: R$ 5,000,
    maxAmount: R$ 50,000,
    duration: 60 days
  },
  "miner-cosmico-plus": {
    dailyReturn: 3.5%,
    minAmount: R$ 50,000,
    maxAmount: R$ 500,000,
    duration: 90 days
  }
}
```

### Referral System

5-level commission structure:
- Level 1: 10%
- Level 2: 5%
- Level 3: 3%
- Level 4: 2%
- Level 5: 1%

### Payment Configuration

- **Currency**: BRL (Brazilian Real)
- **USDT Rate**: R$ 5.45 per USDT
- **Minimum Deposit**: R$ 200
- **Withdrawal Fee**: 2%

## 🚀 Deployment

### Deploy to Vercel

1. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

2. **Configure Environment Variables**:
   In your Vercel project settings, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Database Migration

1. **Create Supabase Project**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project
   - Note your project URL and keys

2. **Run Migration**:
   - Open SQL Editor in Supabase
   - Copy and paste contents of `supabase/migrations/0001_init.sql`
   - Execute the migration

3. **Enable RLS**:
   - All tables have RLS enabled by default
   - Policies are configured for user data isolation

## 👨‍💼 Admin Setup

### Bootstrap Admin User

1. **Create Admin in Auth**:
   - Register a user through the normal flow
   - Note the user ID from Supabase Auth

2. **Grant Admin Role**:
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO admin_roles (user_id, role)
   VALUES ('your-user-id-here', 'admin');
   ```

3. **Verify Admin Access**:
   - Log in with the admin user
   - Access `/admin` route
   - Manage users and system settings

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run format       # Format code with Prettier
```

### Code Quality

- **ESLint**: Configured with Next.js recommended rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict mode enabled
- **Husky**: Git hooks for quality checks (optional)

### Testing Strategy

The application is built with manual testing and browser testing in mind:
- Component testing with visual verification
- End-to-end flow testing
- Mobile responsiveness testing
- Brazilian locale testing

## 🔒 Security

### Authentication
- Supabase Auth with email/password
- Row Level Security (RLS) for data isolation
- JWT token-based authentication
- Admin role-based access control

### Data Protection
- All user data isolated by RLS policies
- Encrypted passwords and sensitive data
- Audit logging for admin actions
- Input validation and sanitization

### Financial Security
- Transaction integrity with database constraints
- Balance validation and double-entry accounting
- Withdrawal restrictions during active investments
- Commission calculation with audit trails

## 🌍 Brazilian Integration

### Localization
- **Currency**: Brazilian Real (R$) formatting
- **Dates**: DD/MM/YYYY format
- **Phone**: Brazilian phone number formatting
- **CPF**: Brazilian tax ID validation and formatting

### Payment Methods
- **PIX**: Instant payment system integration
- **Cryptocurrency**: USDT TRC20 support
- **QR Codes**: For payment processing
- **WhatsApp**: Customer support integration

## 📊 Features Overview

### User Features
- ✅ **Dashboard**: Balance overview, recent transactions, investments
- ✅ **Authentication**: Login/register with Brazilian validation
- ✅ **Deposits**: PIX and crypto deposit options with QR codes
- ✅ **Withdrawals**: PIX and crypto withdrawal with fee calculation
- 🔄 **Investments**: Multiple investment plans (in development)
- 🔄 **Referrals**: 5-level referral system (in development)
- 🔄 **History**: Transaction history (in development)
- 🔄 **Profile**: User profile management (in development)

### Admin Features
- 🔄 **User Management**: Complete user administration (in development)
- 🔄 **Balance Management**: Manual balance adjustments (in development)
- 🔄 **System Monitoring**: Platform statistics (in development)
- 🔄 **Transaction Oversight**: Transaction management (in development)

### Technical Features
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Dark Theme**: Professional dark theme with green accents
- ✅ **Real-time Clock**: System time synchronization
- ✅ **WhatsApp Integration**: Floating support widget
- ✅ **Form Validation**: Comprehensive Brazilian format validation
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Loading States**: Proper loading and success feedback

## 🚦 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and configuration
- [x] UI components and layout
- [x] Authentication system
- [x] Basic dashboard
- [x] Deposit/withdrawal flows

### Phase 2: Core Features 🔄
- [ ] Investment system implementation
- [ ] Referral system activation
- [ ] Transaction history
- [ ] User profile management

### Phase 3: Admin & Advanced ⏳
- [ ] Complete admin dashboard
- [ ] User management system
- [ ] Advanced reporting
- [ ] System monitoring

### Phase 4: Enhancement ⏳
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Ensure responsive design
- Test Brazilian locale features
- Maintain dark theme consistency

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🆘 Support

For support and questions:
- **WhatsApp**: [Support Line](https://wa.me/5511999999999)
- **Email**: support@bitfuse.com
- **Documentation**: [View Docs](https://docs.bitfuse.com)

## 🏢 Business Information

**BITFUSE** - Advanced Cryptocurrency Investment Platform
- **Currency**: Brazilian Real (BRL)
- **Primary Market**: Brazil
- **Regulation**: Compliance with Brazilian financial regulations
- **Support**: Portuguese language support

---

Made with ❤️ by the BITFUSE team
