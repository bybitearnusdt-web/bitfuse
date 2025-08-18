'use client';

import { User, LogOut, Settings, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DEFAULT_USER } from '@/lib/constants';
import { getInitials } from '@/lib/utils';

export function UserDropdown() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Implement logout logic with authentication provider
    // Example integrations:
    // - Supabase: supabaseClient.auth.signOut()
    // - Firebase: signOut(auth)
    // - Custom API: await fetch('/api/auth/logout', { method: 'POST' })
    console.log('Logout clicked');
  };

  const handleProfileClick = () => {
    router.push('/perfil');
  };

  const handleAdminClick = () => {
    router.push('/admin');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="Menu do usuário">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {getInitials(DEFAULT_USER.name)}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{DEFAULT_USER.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {DEFAULT_USER.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAdminClick}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Administração</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}