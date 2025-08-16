import { createClient } from '@supabase/supabase-js';

// These would normally come from environment variables
// For now, using placeholder values - users will need to configure these
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on the schema
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  cpf?: string;
  country: string;
  usdt_wallet?: string;
  status: 'active' | 'suspended' | 'banned';
  kyc_status: 'pending' | 'verified' | 'rejected';
  member_since: string;
  created_at: string;
  updated_at: string;
}

export interface Balance {
  id: string;
  user_id: string;
  total: number;
  available: number;
  invested: number;
  referral_earnings: number;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'return' | 'commission' | 'adjustment' | 'investment';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  daily_return: number;
  duration_days: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  daily_return: number;
  min_amount: number;
  max_amount: number;
  duration_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}