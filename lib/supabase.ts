import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only throw error if we're not in build mode and the values are placeholders
if (typeof window !== 'undefined' && (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder'))) {
  console.warn('Supabase environment variables not configured properly. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Service role client for admin operations (server-side only)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database types (will be generated from Supabase CLI in production)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          name: string;
          email: string;
          username: string;
          phone: string | null;
          cpf: string | null;
          country: string;
          status: 'active' | 'suspended' | 'banned';
          kyc_status: 'pending' | 'verified' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          email: string;
          username: string;
          phone?: string | null;
          cpf?: string | null;
          country?: string;
          status?: 'active' | 'suspended' | 'banned';
          kyc_status?: 'pending' | 'verified' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          name?: string;
          email?: string;
          username?: string;
          phone?: string | null;
          cpf?: string | null;
          country?: string;
          status?: 'active' | 'suspended' | 'banned';
          kyc_status?: 'pending' | 'verified' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      balances: {
        Row: {
          user_id: string;
          total_balance: number;
          available_balance: number;
          invested_balance: number;
          referral_earnings: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          total_balance?: number;
          available_balance?: number;
          invested_balance?: number;
          referral_earnings?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          total_balance?: number;
          available_balance?: number;
          invested_balance?: number;
          referral_earnings?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          amount: number;
          start_date: string;
          end_date: string;
          status: 'active' | 'completed' | 'cancelled';
          daily_return_rate: number;
          total_returns: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          amount: number;
          start_date: string;
          end_date: string;
          status?: 'active' | 'completed' | 'cancelled';
          daily_return_rate: number;
          total_returns?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          amount?: number;
          start_date?: string;
          end_date?: string;
          status?: 'active' | 'completed' | 'cancelled';
          daily_return_rate?: number;
          total_returns?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'deposit' | 'withdrawal' | 'return' | 'commission' | 'adjustment' | 'investment';
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed' | 'cancelled';
          description: string;
          metadata: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'deposit' | 'withdrawal' | 'return' | 'commission' | 'adjustment' | 'investment';
          amount: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'cancelled';
          description: string;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'deposit' | 'withdrawal' | 'return' | 'commission' | 'adjustment' | 'investment';
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'cancelled';
          description?: string;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}