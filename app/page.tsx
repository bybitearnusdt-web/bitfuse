'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBalance, useTransactions, useInvestments } from '@/lib/hooks/useData';
import { useAuth } from '@/lib/auth';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { TrendingUp, Wallet, Users, DollarSign, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { balance, loading: balanceLoading } = useBalance();
  const { transactions, loading: transactionsLoading } = useTransactions(5);
  const { investments, loading: investmentsLoading } = useInvestments();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {balanceLoading ? (
                <div className="text-2xl font-bold">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(balance?.total || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Disponível: {formatCurrency(balance?.available || 0)}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investido</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {balanceLoading ? (
                <div className="text-2xl font-bold">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(balance?.invested || 0)}
                  </div>
                  <p className="text-xs text-green-600">
                    {investments.length} investimento{investments.length !== 1 ? 's' : ''} ativo{investments.length !== 1 ? 's' : ''}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(0)} {/* This would need to be calculated from returns */}
              </div>
              <p className="text-xs text-muted-foreground">
                Retorno acumulado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Indicações</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {balanceLoading ? (
                <div className="text-2xl font-bold">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(balance?.referral_earnings || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Comissões de indicação
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trading Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Gráfico de trading (Em desenvolvimento)</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  Nenhuma transação encontrada
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {transaction.description || `${transaction.type} - ${transaction.currency}`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(transaction.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {formatCurrency(transaction.amount)}
                        </span>
                        <Badge
                          variant={transaction.status === 'completed' ? 'success' : 'secondary'}
                        >
                          {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Investments */}
          <Card>
            <CardHeader>
              <CardTitle>Investimentos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              {investmentsLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : investments.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  Nenhum investimento ativo
                </div>
              ) : (
                <div className="space-y-4">
                  {investments.filter(inv => inv.status === 'active').map((investment) => {
                    const daysRemaining = Math.max(0, Math.ceil(
                      (new Date(investment.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    ));
                    
                    return (
                      <div key={investment.id} className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {(investment as {investment_plans?: {name: string}}).investment_plans?.name || 'Plano de Investimento'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {daysRemaining} dias restantes
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium">
                            {formatCurrency(investment.amount)}
                          </span>
                          <span className="text-xs text-green-600">
                            +{formatCurrency(investment.daily_return)}/dia
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
