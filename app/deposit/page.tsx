'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calculator, Info } from 'lucide-react';
import { formatCurrency, convertBRLToUSDT } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/constants';

export default function DepositPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const numericAmount = parseFloat(amount) || 0;
  const usdtAmount = convertBRLToUSDT(numericAmount);
  const isValidAmount = numericAmount >= APP_CONFIG.minDepositAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (numericAmount < APP_CONFIG.minDepositAmount) {
      newErrors.amount = `Valor mínimo: ${formatCurrency(APP_CONFIG.minDepositAmount)}`;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Redirect to deposit details page with amount
    router.push(`/deposit/details?amount=${numericAmount}`);
  };

  const handleInputChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
    setAmount(numericValue);
    
    if (errors.amount) {
      setErrors({ ...errors, amount: '' });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Depósito</h1>
          <p className="text-muted-foreground">
            Adicione fundos à sua carteira para começar a investir
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculadora de Depósito
            </CardTitle>
            <CardDescription>
              Digite o valor em reais que deseja depositar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              {numericAmount > 0 && (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium">Conversão</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor em BRL</p>
                      <p className="font-medium">{formatCurrency(numericAmount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Equivale a USDT (Taxa: {formatCurrency(APP_CONFIG.usdtRate)})
                      </p>
                      <p className="font-medium">${usdtAmount.toFixed(2)} USDT</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Info className="h-4 w-4 text-blue-600" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-600">
                      Valor mínimo: {formatCurrency(APP_CONFIG.minDepositAmount)}
                    </p>
                    <p className="text-blue-600/80">
                      Taxa de conversão atual: {formatCurrency(APP_CONFIG.usdtRate)} por USDT
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={!isValidAmount}
              >
                Continuar para Pagamento
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento Aceitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded"></div>
                  <div>
                    <p className="font-medium">PIX</p>
                    <p className="text-sm text-muted-foreground">Transferência instantânea</p>
                  </div>
                </div>
                <Badge variant="success">Recomendado</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
                  <div>
                    <p className="font-medium">Cartão de Crédito</p>
                    <p className="text-sm text-muted-foreground">Em breve</p>
                  </div>
                </div>
                <Badge variant="secondary">Em breve</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}