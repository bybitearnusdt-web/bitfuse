import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEFAULT_USER, MOCK_TRANSACTIONS } from '@/lib/constants';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { TrendingUp, Wallet, Users, DollarSign } from 'lucide-react';

export default function Dashboard() {
  // TODO: Replace with dynamic user data fetching
  // Example implementations:
  // - Supabase: const { data: user } = await supabaseClient.from('users').select('*').single()
  // - Firebase: const user = await getDoc(doc(db, 'users', userId))
  // - Custom API: const user = await fetch('/api/user').then(res => res.json())
  // - React Query: const { data: user } = useQuery('user', fetchUser)
  const { balance, activeInvestments } = DEFAULT_USER;

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
              <div className="text-2xl font-bold">{formatCurrency(balance.total)}</div>
              <p className="text-xs text-muted-foreground">
                Disponível: {formatCurrency(balance.available)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investido</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(balance.invested)}</div>
              <p className="text-xs text-green-600">
                +12.5% este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(2450.75)}
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
              <div className="text-2xl font-bold">{formatCurrency(balance.referralEarnings)}</div>
              <p className="text-xs text-muted-foreground">
                2 indicados ativos
              </p>
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
              <div className="space-y-4">
                {/* TODO: Replace with dynamic transaction data fetching
                    Example implementations:
                    - Supabase: const { data: transactions } = await supabaseClient.from('transactions').select('*').order('created_at', { ascending: false }).limit(5)
                    - Firebase: const transactions = await getDocs(query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(5)))
                    - Custom API: const transactions = await fetch('/api/transactions').then(res => res.json())
                    - React Query: const { data: transactions } = useQuery('transactions', fetchTransactions)
                */}
                {MOCK_TRANSACTIONS.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{transaction.description}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(transaction.createdAt)}
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
            </CardContent>
          </Card>

          {/* Active Investments */}
          <Card>
            <CardHeader>
              <CardTitle>Investimentos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeInvestments.map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{investment.planId}</span>
                      <span className="text-xs text-muted-foreground">
                        {investment.daysRemaining} dias restantes
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">
                        {formatCurrency(investment.amount)}
                      </span>
                      <span className="text-xs text-green-600">
                        +{formatCurrency(investment.dailyReturn)}/dia
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
