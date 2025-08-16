'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from './supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (signInError: unknown) {
      console.error('Sign in error:', signInError);
      return { error: 'Erro inesperado durante o login' };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // Create profile if user was created
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            email,
            name: userData.name || '',
            username: userData.username || '',
            phone: userData.phone,
            cpf: userData.cpf,
            country: userData.country || 'BR',
            usdt_wallet: userData.usdt_wallet,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return { error: 'Erro ao criar perfil do usuário' };
        }

        // Create initial balance record
        const { error: balanceError } = await supabase
          .from('balances')
          .insert({
            user_id: data.user.id,
            total: 0,
            available: 0,
            invested: 0,
            referral_earnings: 0,
          });

        if (balanceError) {
          console.error('Error creating balance:', balanceError);
        }
      }

      return {};
    } catch (signUpError: unknown) {
      console.error('Sign up error:', signUpError);
      return { error: 'Erro inesperado durante o registro' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (signOutError: unknown) {
      console.error('Error signing out:', signOutError);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Refresh profile
      await fetchProfile(user.id);
      return {};
    } catch (updateError: unknown) {
      console.error('Update profile error:', updateError);
      return { error: 'Erro ao atualizar perfil' };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
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