import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only create the client if we have proper environment variables
let supabase: ReturnType<typeof createClient> | null = null;

try {
  if (supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key') {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
} catch (error) {
  console.warn('Supabase client could not be initialized:', error);
}

// Export a mock client if the real one couldn't be created
export { supabase };

// Types based on the database schema
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  cpf?: string;
  country: string;
  status: 'active' | 'suspended' | 'banned';
  kycStatus: 'pending' | 'verified' | 'rejected';
  memberSince: string;
  usdtWallet?: string;
  balance?: {
    total: number;
    available: number;
    invested: number;
    referralEarnings: number;
  };
}

export interface AdminRole {
  id: string;
  userId: string;
  role: string;
  createdAt: string;
}