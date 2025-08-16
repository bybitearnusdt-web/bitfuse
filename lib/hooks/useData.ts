'use client';

import { useState, useEffect } from 'react';
import { supabase, Balance, Transaction, Investment, InvestmentPlan } from '../supabase';
import { useAuth } from '../auth';

// Hook for fetching user balance
export function useBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) {
        setBalance(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('balances')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          setError(error.message);
          setBalance(null);
        } else {
          setBalance(data);
          setError(null);
        }
      } catch (error: unknown) {
        setError('Erro ao carregar saldo');
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user]);

  const refreshBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setBalance(data);
        setError(null);
      }
    } catch (error: unknown) {
      setError('Erro ao atualizar saldo');
    }
  };

  return { balance, loading, error, refreshBalance };
}

// Hook for fetching transactions
export function useTransactions(limit?: number) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let query = supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
          setError(error.message);
          setTransactions([]);
        } else {
          setTransactions(data || []);
          setError(null);
        }
      } catch (error: unknown) {
        setError('Erro ao carregar transações');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, limit]);

  return { transactions, loading, error };
}

// Hook for fetching investments
export function useInvestments() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) {
        setInvestments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('investments')
          .select(`
            *,
            investment_plans (
              name,
              daily_return
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
          setInvestments([]);
        } else {
          setInvestments(data || []);
          setError(null);
        }
      } catch (error: unknown) {
        setError('Erro ao carregar investimentos');
        setInvestments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [user]);

  return { investments, loading, error };
}

// Hook for fetching investment plans
export function useInvestmentPlans() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('investment_plans')
          .select('*')
          .eq('is_active', true)
          .order('min_amount', { ascending: true });

        if (error) {
          setError(error.message);
          setPlans([]);
        } else {
          setPlans(data || []);
          setError(null);
        }
      } catch (error: unknown) {
        setError('Erro ao carregar planos de investimento');
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
}

// Hook for fetching user's referrals
export function useReferrals() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Array<{
    id: string;
    level: number;
    commission_percentage: number;
    total_commission: number;
    created_at: string;
    referred_profile?: {
      username: string;
      name: string;
      status: string;
    };
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) {
        setReferrals([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('referrals')
          .select(`
            *,
            referred_profile:profiles!referrals_referred_user_id_fkey (
              username,
              name,
              status
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
          setReferrals([]);
        } else {
          setReferrals(data || []);
          setError(null);
        }
      } catch (error: unknown) {
        setError('Erro ao carregar indicações');
        setReferrals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [user]);

  return { referrals, loading, error };
}