'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/constants';

export function WhatsAppSupport() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Olá! Preciso de ajuda com a plataforma BITFUSE.');
    const whatsappUrl = `https://wa.me/${APP_CONFIG.supportPhone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
}