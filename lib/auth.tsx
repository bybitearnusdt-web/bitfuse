'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, User } from '@/lib/supabase';
import { DEFAULT_USER } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    if (!supabase) {
      // Fallback when Supabase is not available
      return {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || DEFAULT_USER.name,
        email: supabaseUser.email || DEFAULT_USER.email,
        username: supabaseUser.user_metadata?.username || DEFAULT_USER.username,
        country: DEFAULT_USER.country,
        status: 'active' as const,
        kycStatus: 'pending' as const,
        memberSince: new Date().toISOString().split('T')[0],
        balance: DEFAULT_USER.balance,
      };
    }

    try {
      // Fetch user profile from the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to using DEFAULT_USER structure with Supabase user data
        return {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || DEFAULT_USER.name,
          email: supabaseUser.email || DEFAULT_USER.email,
          username: supabaseUser.user_metadata?.username || DEFAULT_USER.username,
          country: DEFAULT_USER.country,
          status: 'active' as const,
          kycStatus: 'pending' as const,
          memberSince: new Date().toISOString().split('T')[0],
          balance: DEFAULT_USER.balance,
        };
      }

      // Fetch balance information
      const { data: balance } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      const userBalance = balance ? {
        total: balance.total as number,
        available: balance.available as number,
        invested: balance.invested as number,
        referralEarnings: balance.referral_earnings as number,
      } : DEFAULT_USER.balance;

      return {
        id: profile.user_id as string,
        name: profile.name as string,
        email: profile.email as string,
        username: profile.username as string,
        phone: profile.phone as string | undefined,
        cpf: profile.cpf as string | undefined,
        country: profile.country as string,
        status: profile.status as 'active' | 'suspended' | 'banned',
        kycStatus: profile.kyc_status as 'pending' | 'verified' | 'rejected',
        memberSince: profile.member_since as string,
        usdtWallet: profile.usdt_wallet as string | undefined,
        balance: userBalance,
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const checkAdminRole = async (userId: string) => {
    if (!supabase) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return data?.role === 'admin';
    } catch (error) {
      console.error('Error in checkAdminRole:', error);
      return false;
    }
  };

  const refreshUser = async () => {
    if (!session?.user) return;
    
    const userProfile = await fetchUserProfile(session.user);
    if (userProfile) {
      setUser(userProfile);
      const adminStatus = await checkAdminRole(session.user.id);
      setIsAdmin(adminStatus);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error signing out:', error);
        }
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user).then((userProfile) => {
          if (userProfile) {
            setUser(userProfile);
            checkAdminRole(session.user.id).then(setIsAdmin);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        if (userProfile) {
          setUser(userProfile);
          const adminStatus = await checkAdminRole(session.user.id);
          setIsAdmin(adminStatus);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAdmin,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}