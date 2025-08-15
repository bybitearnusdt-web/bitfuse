-- BITFUSE Database Schema
-- This migration creates all necessary tables, indexes, RLS policies, and helper functions

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'return', 'commission', 'adjustment', 'investment');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE investment_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE withdrawal_method AS ENUM ('crypto', 'pix');
CREATE TYPE wallet_type AS ENUM ('default', 'incentive');
CREATE TYPE alert_level AS ENUM ('info', 'warning', 'critical');

-- =========================================
-- PROFILES TABLE (User information)
-- =========================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    cpf VARCHAR(14),
    country VARCHAR(3) DEFAULT 'BR',
    usdt_wallet VARCHAR(255),
    status user_status DEFAULT 'active',
    kyc_status kyc_status DEFAULT 'pending',
    member_since DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT profiles_user_id_unique UNIQUE (user_id),
    CONSTRAINT profiles_email_unique UNIQUE (email),
    CONSTRAINT profiles_username_unique UNIQUE (username)
);

-- =========================================
-- WALLETS TABLE (User wallet balances)
-- =========================================
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type wallet_type DEFAULT 'default',
    currency VARCHAR(3) DEFAULT 'BRL',
    balance NUMERIC(15,2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT wallets_user_type_currency_unique UNIQUE (user_id, type, currency)
);

-- =========================================
-- BALANCES TABLE (Consolidated user balances)
-- =========================================
CREATE TABLE balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total NUMERIC(15,2) DEFAULT 0.00,
    available NUMERIC(15,2) DEFAULT 0.00,
    invested NUMERIC(15,2) DEFAULT 0.00,
    referral_earnings NUMERIC(15,2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- INVESTMENT PLANS TABLE
-- =========================================
CREATE TABLE investment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    daily_return NUMERIC(5,4) NOT NULL, -- e.g., 0.0150 for 1.5%
    min_amount NUMERIC(15,2) NOT NULL,
    max_amount NUMERIC(15,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default investment plans
INSERT INTO investment_plans (name, daily_return, min_amount, max_amount, duration_days) VALUES
('Miner Start', 0.0150, 200.00, 5000.00, 30),
('Miner Cósmico', 0.0250, 5000.00, 50000.00, 60),
('Miner Cósmico Plus', 0.0350, 50000.00, 500000.00, 90);

-- =========================================
-- INVESTMENTS TABLE
-- =========================================
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES investment_plans(id) ON DELETE RESTRICT,
    amount NUMERIC(15,2) NOT NULL,
    daily_return NUMERIC(15,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE GENERATED ALWAYS AS (start_date + INTERVAL '1 day' * duration_days) STORED,
    status investment_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- RETURNS TABLE (Daily investment returns)
-- =========================================
CREATE TABLE returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
    amount NUMERIC(15,2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT returns_investment_date_unique UNIQUE (investment_id, date)
);

-- =========================================
-- REFERRALS TABLE
-- =========================================
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT referrals_user_referred_unique UNIQUE (user_id, referred_user_id)
);

-- =========================================
-- REFERRAL COMMISSIONS TABLE
-- =========================================
CREATE TABLE referral_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    source_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
    amount NUMERIC(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- TRANSACTIONS TABLE
-- =========================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    meta JSONB DEFAULT '{}',
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- WITHDRAWALS TABLE
-- =========================================
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    method withdrawal_method NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    fee NUMERIC(15,2) NOT NULL,
    final_amount NUMERIC(15,2) NOT NULL,
    details JSONB NOT NULL,
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- ADMIN LOGS TABLE
-- =========================================
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- SYSTEM ALERTS TABLE
-- =========================================
CREATE TABLE system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level alert_level DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- =========================================
-- ADMIN ROLES TABLE (for role-based access)
-- =========================================
CREATE TABLE admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- INDEXES for performance
-- =========================================

-- Profiles indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_status ON profiles(status);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Investments indexes
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_plan_id ON investments(plan_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_dates ON investments(start_date, end_date);

-- Returns indexes
CREATE INDEX idx_returns_investment_id ON returns(investment_id);
CREATE INDEX idx_returns_date ON returns(date);

-- Referrals indexes
CREATE INDEX idx_referrals_user_id ON referrals(user_id);
CREATE INDEX idx_referrals_referred_user_id ON referrals(referred_user_id);

-- Withdrawals indexes
CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_withdrawals_created_at ON withdrawals(created_at);

-- =========================================
-- HELPER FUNCTIONS
-- =========================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_roles 
        WHERE user_id = uid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's referral chain
CREATE OR REPLACE FUNCTION get_referral_chain(target_user_id UUID)
RETURNS TABLE(user_id UUID, level INTEGER) AS $$
WITH RECURSIVE referral_chain AS (
    -- Base case: direct referrer
    SELECT r.user_id, 1 as level
    FROM referrals r
    WHERE r.referred_user_id = target_user_id
    
    UNION ALL
    
    -- Recursive case: go up the chain
    SELECT r.user_id, rc.level + 1
    FROM referrals r
    JOIN referral_chain rc ON r.referred_user_id = rc.user_id
    WHERE rc.level < 5
)
SELECT * FROM referral_chain;
$$ LANGUAGE SQL;

-- Function to calculate and distribute referral commissions
CREATE OR REPLACE FUNCTION distribute_referral_commissions(investment_amount NUMERIC, investor_id UUID)
RETURNS VOID AS $$
DECLARE
    commission_rates NUMERIC[] := ARRAY[0.10, 0.05, 0.03, 0.02, 0.01]; -- 10%, 5%, 3%, 2%, 1%
    referrer_record RECORD;
BEGIN
    -- Get referral chain and distribute commissions
    FOR referrer_record IN 
        SELECT user_id, level FROM get_referral_chain(investor_id)
    LOOP
        IF referrer_record.level <= 5 THEN
            INSERT INTO referral_commissions (user_id, source_user_id, level, amount)
            VALUES (
                referrer_record.user_id,
                investor_id,
                referrer_record.level,
                investment_amount * commission_rates[referrer_record.level]
            );
            
            -- Update referrer's balance
            UPDATE balances 
            SET 
                referral_earnings = referral_earnings + (investment_amount * commission_rates[referrer_record.level]),
                total = total + (investment_amount * commission_rates[referrer_record.level]),
                available = available + (investment_amount * commission_rates[referrer_record.level]),
                updated_at = NOW()
            WHERE user_id = referrer_record.user_id;
            
            -- Create transaction record
            INSERT INTO transactions (user_id, type, amount, meta, status)
            VALUES (
                referrer_record.user_id,
                'commission',
                investment_amount * commission_rates[referrer_record.level],
                jsonb_build_object(
                    'source_user_id', investor_id,
                    'level', referrer_record.level,
                    'investment_amount', investment_amount
                ),
                'completed'
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to process daily returns
CREATE OR REPLACE FUNCTION process_daily_returns()
RETURNS INTEGER AS $$
DECLARE
    investment_record RECORD;
    return_count INTEGER := 0;
BEGIN
    FOR investment_record IN 
        SELECT i.id, i.user_id, i.daily_return
        FROM investments i
        WHERE i.status = 'active'
        AND CURRENT_DATE <= i.end_date
        AND NOT EXISTS (
            SELECT 1 FROM returns r 
            WHERE r.investment_id = i.id 
            AND r.date = CURRENT_DATE
        )
    LOOP
        -- Insert daily return
        INSERT INTO returns (investment_id, amount)
        VALUES (investment_record.id, investment_record.daily_return);
        
        -- Update user's balance
        UPDATE balances 
        SET 
            total = total + investment_record.daily_return,
            available = available + investment_record.daily_return,
            updated_at = NOW()
        WHERE user_id = investment_record.user_id;
        
        -- Create transaction record
        INSERT INTO transactions (user_id, type, amount, meta, status)
        VALUES (
            investment_record.user_id,
            'return',
            investment_record.daily_return,
            jsonb_build_object('investment_id', investment_record.id),
            'completed'
        );
        
        return_count := return_count + 1;
    END LOOP;
    
    -- Mark completed investments
    UPDATE investments 
    SET status = 'completed', updated_at = NOW()
    WHERE status = 'active' 
    AND end_date < CURRENT_DATE;
    
    RETURN return_count;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- TRIGGERS
-- =========================================

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_balances_updated_at BEFORE UPDATE ON balances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investment_plans_updated_at BEFORE UPDATE ON investment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create initial balance record when user profile is created
CREATE OR REPLACE FUNCTION create_initial_balance()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO balances (user_id) VALUES (NEW.user_id);
    INSERT INTO wallets (user_id, type, currency) VALUES (NEW.user_id, 'default', 'BRL');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_initial_balance_trigger 
AFTER INSERT ON profiles 
FOR EACH ROW EXECUTE FUNCTION create_initial_balance();

-- Trigger to prevent withdrawal when user has active investments
CREATE OR REPLACE FUNCTION check_active_investments()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM investments 
        WHERE user_id = NEW.user_id 
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Cannot withdraw funds while having active investments';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_active_investments_trigger 
BEFORE INSERT ON withdrawals 
FOR EACH ROW EXECUTE FUNCTION check_active_investments();

-- Trigger to distribute referral commissions on first investment
CREATE OR REPLACE FUNCTION handle_investment_commissions()
RETURNS TRIGGER AS $$
BEGIN
    -- Only distribute commissions for the first investment
    IF NOT EXISTS (
        SELECT 1 FROM investments 
        WHERE user_id = NEW.user_id 
        AND id != NEW.id
    ) THEN
        PERFORM distribute_referral_commissions(NEW.amount, NEW.user_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_investment_commissions_trigger 
AFTER INSERT ON investments 
FOR EACH ROW EXECUTE FUNCTION handle_investment_commissions();

-- =========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================

-- Enable RLS on all user-facing tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (is_admin(auth.uid()));

-- Balances policies
CREATE POLICY "Users can view own balance" ON balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all balances" ON balances FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "System can update balances" ON balances FOR UPDATE USING (true); -- For system operations

-- Wallets policies
CREATE POLICY "Users can view own wallets" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all wallets" ON wallets FOR ALL USING (is_admin(auth.uid()));

-- Investments policies
CREATE POLICY "Users can view own investments" ON investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own investments" ON investments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all investments" ON investments FOR ALL USING (is_admin(auth.uid()));

-- Returns policies
CREATE POLICY "Users can view own returns" ON returns FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM investments WHERE id = investment_id)
);
CREATE POLICY "Admins can view all returns" ON returns FOR ALL USING (is_admin(auth.uid()));

-- Referrals policies
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (auth.uid() = user_id OR auth.uid() = referred_user_id);
CREATE POLICY "Users can create referrals" ON referrals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all referrals" ON referrals FOR ALL USING (is_admin(auth.uid()));

-- Referral commissions policies
CREATE POLICY "Users can view own commissions" ON referral_commissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all commissions" ON referral_commissions FOR ALL USING (is_admin(auth.uid()));

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON transactions FOR ALL USING (is_admin(auth.uid()));

-- Withdrawals policies
CREATE POLICY "Users can view own withdrawals" ON withdrawals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own withdrawals" ON withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all withdrawals" ON withdrawals FOR ALL USING (is_admin(auth.uid()));

-- Admin logs policies
CREATE POLICY "Admins can view admin logs" ON admin_logs FOR ALL USING (is_admin(auth.uid()));

-- Investment plans (public read access)
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view investment plans" ON investment_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage investment plans" ON investment_plans FOR ALL USING (is_admin(auth.uid()));

-- System alerts (public read access for active alerts)
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view unresolved alerts" ON system_alerts FOR SELECT USING (resolved_at IS NULL);
CREATE POLICY "Admins can manage system alerts" ON system_alerts FOR ALL USING (is_admin(auth.uid()));

-- =========================================
-- SEED DATA FOR DEVELOPMENT
-- =========================================

-- Create a default admin user profile (this would typically be done through the application)
-- Note: This assumes you have a user in auth.users with this ID
-- INSERT INTO profiles (user_id, name, email, username, status, kyc_status)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Admin User', 'admin@bitfuse.com', 'admin', 'active', 'verified');

-- Insert admin role
-- INSERT INTO admin_roles (user_id, role)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin');

-- Insert sample system alerts
INSERT INTO system_alerts (level, title, message) VALUES
('info', 'Sistema Online', 'Plataforma funcionando normalmente'),
('warning', 'Manutenção Agendada', 'Manutenção programada para domingo às 02:00'),
('critical', 'Atualização de Segurança', 'Nova versão de segurança implementada');

-- =========================================
-- COMMENTS FOR DOCUMENTATION
-- =========================================

COMMENT ON TABLE profiles IS 'User profile information and KYC status';
COMMENT ON TABLE balances IS 'Consolidated user balance information';
COMMENT ON TABLE investment_plans IS 'Available investment plans with returns and limits';
COMMENT ON TABLE investments IS 'User investments and their status';
COMMENT ON TABLE returns IS 'Daily returns generated from investments';
COMMENT ON TABLE referrals IS 'User referral relationships';
COMMENT ON TABLE referral_commissions IS 'Commissions earned from referrals';
COMMENT ON TABLE transactions IS 'All financial transactions in the system';
COMMENT ON TABLE withdrawals IS 'User withdrawal requests and their status';
COMMENT ON TABLE admin_logs IS 'Audit log of admin actions';
COMMENT ON TABLE system_alerts IS 'System-wide alerts and notifications';

COMMENT ON FUNCTION is_admin(UUID) IS 'Check if a user has admin privileges';
COMMENT ON FUNCTION get_referral_chain(UUID) IS 'Get the referral chain for a user up to 5 levels';
COMMENT ON FUNCTION distribute_referral_commissions(NUMERIC, UUID) IS 'Distribute commissions to referrers on first investment';
COMMENT ON FUNCTION process_daily_returns() IS 'Process daily returns for all active investments';