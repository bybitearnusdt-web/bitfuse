'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Clock, 
  QrCode, 
  MessageCircle, 
  CheckCircle,
  AlertTriangle 
} from 'lucide-react';
import { formatCurrency, convertBRLToUSDT, getTimeRemaining, formatCountdown } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/constants';

export default function DepositDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DepositDetailsContent />
    </Suspense>
  );
}

function DepositDetailsContent() {
  const searchParams = useSearchParams();
  const amount = parseFloat(searchParams.get('amount') || '0');
  const usdtAmount = convertBRLToUSDT(amount);
  
  // 90 minutes from now for deposit window
  const [expiryTime] = useState(new Date(Date.now() + 90 * 60 * 1000));
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(expiryTime));
  const [copied, setCopied] = useState<string | null>(null);

  // Mock wallet details
  const walletAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
  const pixKey = 'bitfuse@pix.com.br';
  const depositId = 'DEP-' + Date.now().toString().slice(-8);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(expiryTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsAppConfirmation = () => {
    const message = `Olá! Realizei um depósito de ${formatCurrency(amount)} (${usdtAmount.toFixed(2)} USDT) - ID: ${depositId}. Por favor, confirme o recebimento.`;
    const whatsappUrl = `https://wa.me/${APP_CONFIG.supportPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (amount === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Valor não especificado</h2>
              <p className="text-muted-foreground mb-4">
                Por favor, volte e selecione um valor para depósito.
              </p>
              <Button onClick={() => window.history.back()}>
                Voltar
              </Button>
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
          <h1 className="text-2xl font-bold">Finalizar Depósito</h1>
          <p className="text-muted-foreground">
            Complete o pagamento para adicionar fundos à sua carteira
          </p>
        </div>

        {/* Countdown Timer */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Tempo restante para pagamento</span>
            </div>
            <div className="text-2xl font-mono font-bold text-orange-500">
              {formatCountdown(timeRemaining)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              O link de pagamento expira automaticamente
            </p>
          </CardContent>
        </Card>

        {/* Deposit Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Depósito</CardTitle>
            <CardDescription>ID: {depositId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Valor em BRL</p>
                <p className="text-xl font-bold">{formatCurrency(amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equivale a USDT</p>
                <p className="text-xl font-bold">${usdtAmount.toFixed(2)} USDT</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PIX Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Pagamento via PIX
            </CardTitle>
            <CardDescription>
              Escaneie o QR Code ou copie a chave PIX
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code Placeholder */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white p-4 rounded-lg border">
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            </div>

            {/* PIX Key */}
            <div className="space-y-2">
              <Label>Chave PIX (Email)</Label>
              <div className="flex gap-2">
                <Input
                  value={pixKey}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(pixKey, 'pix')}
                >
                  {copied === 'pix' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Alternative: Solana Wallet */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Ou envie USDT via Solana</h4>
              <div className="space-y-2">
                <Label>Endereço da Carteira Solana</Label>
                <div className="flex gap-2">
                  <Input
                    value={walletAddress}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(walletAddress, 'wallet')}
                  >
                    {copied === 'wallet' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Envie exatamente ${usdtAmount.toFixed(2)} USDT
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle>Após o Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-600 mb-1">
                  Confirme via WhatsApp
                </p>
                <p className="text-blue-600/80">
                  Após realizar o pagamento, envie uma mensagem para nosso suporte
                  para agilizar a confirmação do depósito.
                </p>
              </div>
            </div>

            <Button 
              onClick={handleWhatsAppConfirmation}
              className="w-full"
              variant="outline"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Enviar Confirmação via WhatsApp
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Os depósitos são processados automaticamente em até 10 minutos
                após a confirmação do pagamento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}

function Input({ value, readOnly, className, ...props }: {
  value?: string;
  readOnly?: boolean;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <input
      value={value}
      readOnly={readOnly}
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}