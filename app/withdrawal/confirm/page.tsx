'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  Banknote
} from 'lucide-react';
import { formatCurrency, calculateWithdrawalFee, truncateAddress } from '@/lib/utils';

export default function WithdrawalConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WithdrawalConfirmContent />
    </Suspense>
  );
}

function WithdrawalConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const method = searchParams.get('method') as 'crypto' | 'pix';
  const amount = parseFloat(searchParams.get('amount') || '0');
  const walletAddress = searchParams.get('wallet') || '';
  const pixKey = searchParams.get('pixKey') || '';
  const pixKeyType = searchParams.get('pixKeyType') || '';
  
  const { fee, finalAmount } = calculateWithdrawalFee(amount);
  const withdrawalId = 'WTH-' + Date.now().toString().slice(-8);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 2000);
  };

  const handleBack = () => {
    router.back();
  };

  const handleGoToDashboard = () => {
    router.push('/');
  };

  if (amount === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Dados incompletos</h2>
              <p className="text-muted-foreground mb-4">
                Por favor, volte e preencha todos os dados necessários.
              </p>
              <Button onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (isCompleted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Saque Solicitado com Sucesso!</h1>
              <p className="text-muted-foreground mb-6">
                Sua solicitação de saque foi registrada e está sendo processada.
              </p>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-left">
                      <p className="text-muted-foreground">ID da Transação:</p>
                      <p className="font-mono font-medium">{withdrawalId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Valor Líquido:</p>
                      <p className="font-bold text-green-600">{formatCurrency(finalAmount)}</p>
                    </div>
                  </div>
                </div>
                
                <Badge variant="secondary" className="px-4 py-2">
                  <Clock className="mr-2 h-4 w-4" />
                  Processamento: 1-3 dias úteis
                </Badge>
              </div>

              <div className="mt-8 space-y-3">
                <Button onClick={handleGoToDashboard} className="w-full">
                  Voltar ao Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/historico')}
                  className="w-full"
                >
                  Ver Histórico de Transações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Confirmar Saque</h1>
          <p className="text-muted-foreground">
            Revise os dados antes de confirmar a solicitação
          </p>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Solicitação</CardTitle>
            <CardDescription>ID: {withdrawalId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Valor Solicitado</p>
                <p className="text-lg font-semibold">{formatCurrency(amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Método</p>
                <div className="flex items-center gap-2">
                  {method === 'crypto' ? (
                    <Banknote className="h-4 w-4" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {method === 'crypto' ? 'Crypto (USDT)' : 'PIX'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Valor solicitado:</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxa de saque (2%):</span>
                <span className="text-red-500">-{formatCurrency(fee)}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Valor líquido:</span>
                <span className="text-green-600">{formatCurrency(finalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destination Details */}
        <Card>
          <CardHeader>
            <CardTitle>Destino do Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {method === 'crypto' ? (
              <div>
                <p className="text-sm text-muted-foreground">Endereço da Carteira USDT (TRC20)</p>
                <p className="font-mono text-sm bg-muted p-2 rounded">
                  {truncateAddress(walletAddress, 10, 10)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Verifique cuidadosamente o endereço antes de confirmar
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">
                  Chave PIX ({pixKeyType.charAt(0).toUpperCase() + pixKeyType.slice(1)})
                </p>
                <p className="font-mono text-sm bg-muted p-2 rounded">
                  {pixKey}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200">
              Informações Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              <li>• O processamento do saque leva de 1 a 3 dias úteis</li>
              <li>• Verifique cuidadosamente os dados de destino</li>
              <li>• Não é possível cancelar após a confirmação</li>
              <li>• Uma notificação será enviada quando processado</li>
              {method === 'crypto' && (
                <li>• Use apenas endereços TRC20 compatíveis com USDT</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Processando...' : 'Confirmar Saque'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}