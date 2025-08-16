'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Banknote, 
  Wallet, 
  AlertTriangle, 
  Calculator,
  Info,
  CreditCard,
  Loader2
} from 'lucide-react';
import { formatCurrency, calculateWithdrawalFee, formatCPF } from '@/lib/utils';
import { useBalance, useInvestments } from '@/lib/hooks/useData';
import { APP_CONFIG } from '@/lib/constants';

export default function WithdrawalPage() {
  const router = useRouter();
  const { balance, loading: balanceLoading } = useBalance();
  const { investments, loading: investmentsLoading } = useInvestments();
  const [selectedMethod, setSelectedMethod] = useState<'crypto' | 'pix'>('crypto');
  const [amount, setAmount] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState<'cpf' | 'email' | 'phone' | 'random'>('cpf');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const numericAmount = parseFloat(amount) || 0;
  const { fee, finalAmount } = calculateWithdrawalFee(numericAmount);
  
  // Check for active investments
  const activeInvestments = investments.filter(inv => inv.status === 'active');
  const hasActiveInvestments = activeInvestments.length > 0;
  const canWithdraw = !hasActiveInvestments;
  const hasBalance = balance ? numericAmount <= balance.available : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!canWithdraw) {
      newErrors.amount = 'Não é possível sacar com investimentos ativos';
    }
    
    if (numericAmount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
    
    if (!hasBalance && balance) {
      newErrors.amount = `Saldo insuficiente. Disponível: ${formatCurrency(balance.available)}`;
    }
    
    if (selectedMethod === 'crypto' && !walletAddress.trim()) {
      newErrors.walletAddress = 'Endereço da carteira é obrigatório';
    }
    
    if (selectedMethod === 'pix' && !pixKey.trim()) {
      newErrors.pixKey = 'Chave PIX é obrigatória';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Redirect to confirmation page
    const params = new URLSearchParams({
      method: selectedMethod,
      amount: numericAmount.toString(),
      ...(selectedMethod === 'crypto' && { wallet: walletAddress }),
      ...(selectedMethod === 'pix' && { pixKey, pixKeyType }),
    });
    
    router.push(`/withdrawal/confirm?${params.toString()}`);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'amount') {
      const numericValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
      setAmount(numericValue);
    } else if (field === 'pixKey' && pixKeyType === 'cpf') {
      setPixKey(formatCPF(value));
    } else {
      if (field === 'walletAddress') setWalletAddress(value);
      if (field === 'pixKey') setPixKey(value);
    }
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Saque</h1>
          <p className="text-muted-foreground">
            Retire seus fundos da plataforma
          </p>
        </div>

        {/* Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Saldo Disponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando saldo...</span>
              </div>
            ) : balance ? (
              <>
                <div className="text-2xl font-bold">{formatCurrency(balance.available)}</div>
                <p className="text-sm text-muted-foreground">
                  Saldo total: {formatCurrency(balance.total)}
                </p>
              </>
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(0)}</div>
            )}
          </CardContent>
        </Card>

        {/* Active Investments Warning */}
        {investmentsLoading ? (
          <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verificando investimentos...</span>
              </div>
            </CardContent>
          </Card>
        ) : hasActiveInvestments && (
          <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Investimentos Ativos Detectados
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Você possui {activeInvestments.length} investimento{activeInvestments.length > 1 ? 's' : ''} ativo{activeInvestments.length > 1 ? 's' : ''}. 
                    Para realizar saques, é necessário aguardar o término dos investimentos ou cancelá-los 
                    (sujeito a penalidades).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Valor do Saque
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor em Reais (BRL)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                    disabled={!canWithdraw}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              {numericAmount > 0 && (
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium">Cálculo da Taxa</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Valor solicitado:</span>
                      <span>{formatCurrency(numericAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa ({(APP_CONFIG.withdrawalFee * 100).toFixed(1)}%):</span>
                      <span className="text-red-500">-{formatCurrency(fee)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Valor líquido:</span>
                      <span className="text-green-600">{formatCurrency(finalAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Método de Recebimento</CardTitle>
              <CardDescription>
                Escolha como deseja receber seus fundos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as 'crypto' | 'pix')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="crypto">
                    <Banknote className="w-4 h-4 mr-2" />
                    Crypto (USDT)
                  </TabsTrigger>
                  <TabsTrigger value="pix">
                    <CreditCard className="w-4 h-4 mr-2" />
                    PIX
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="crypto" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletAddress">Endereço da Carteira USDT (TRC20)</Label>
                    <Input
                      id="walletAddress"
                      placeholder="TRX... ou TR..."
                      value={walletAddress}
                      onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                      className={errors.walletAddress ? 'border-red-500' : ''}
                    />
                    {errors.walletAddress && (
                      <p className="text-sm text-red-500">{errors.walletAddress}</p>
                    )}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-600">
                        <p className="font-medium">Importante:</p>
                        <p>Use apenas endereços TRC20 (Tron). Outros tipos podem resultar em perda dos fundos.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pix" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipo de Chave PIX</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'cpf', label: 'CPF' },
                          { value: 'email', label: 'Email' },
                          { value: 'phone', label: 'Telefone' },
                          { value: 'random', label: 'Aleatória' },
                        ].map((type: { value: string; label: string }) => (
                          <Button
                            key={type.value}
                            type="button"
                            variant={pixKeyType === type.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPixKeyType(type.value as 'cpf' | 'email' | 'phone' | 'random')}
                          >
                            {type.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pixKey">Chave PIX</Label>
                      <Input
                        id="pixKey"
                        placeholder={
                          pixKeyType === 'cpf' ? '000.000.000-00' :
                          pixKeyType === 'email' ? 'seu@email.com' :
                          pixKeyType === 'phone' ? '(11) 99999-9999' :
                          'Chave aleatória'
                        }
                        value={pixKey}
                        onChange={(e) => handleInputChange('pixKey', e.target.value)}
                        className={errors.pixKey ? 'border-red-500' : ''}
                      />
                      {errors.pixKey && (
                        <p className="text-sm text-red-500">{errors.pixKey}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!canWithdraw || numericAmount <= 0 || !hasBalance}
          >
            Continuar para Confirmação
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}