'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  History,
  Banknote,
  Users,
  User,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MobileNavigation } from '@/lib/mobileNav';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Investimentos',
    href: '/investimentos',
    icon: TrendingUp,
  },
  {
    name: 'Histórico',
    href: '/historico',
    icon: History,
  },
  {
    name: 'Saques',
    href: '/withdrawal',
    icon: Banknote,
  },
  {
    name: 'Indicações',
    href: '/indicacoes',
    icon: Users,
  },
  {
    name: 'Perfil',
    href: '/perfil',
    icon: User,
  },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cleanupFocusTrap = useRef<(() => void) | null>(null);
  const cleanupEscHandler = useRef<(() => void) | null>(null);

  // Close drawer function
  const closeDrawer = () => {
    setIsMobileOpen(false);
  };

  // Setup accessibility when drawer opens/closes
  useEffect(() => {
    if (isMobileOpen) {
      // Prevent body scroll
      MobileNavigation.preventBodyScroll(true);
      
      // Setup focus trap
      if (drawerRef.current) {
        cleanupFocusTrap.current = MobileNavigation.trapFocus(drawerRef.current);
      }
      
      // Setup ESC key handler
      cleanupEscHandler.current = MobileNavigation.handleEscapeKey(closeDrawer);
      
      // Setup ARIA attributes
      if (buttonRef.current && drawerRef.current) {
        MobileNavigation.setupDrawerAria(
          buttonRef.current,
          drawerRef.current,
          true
        );
      }
    } else {
      // Restore body scroll
      MobileNavigation.preventBodyScroll(false);
      
      // Cleanup focus trap
      if (cleanupFocusTrap.current) {
        cleanupFocusTrap.current();
        cleanupFocusTrap.current = null;
      }
      
      // Cleanup ESC handler
      if (cleanupEscHandler.current) {
        cleanupEscHandler.current();
        cleanupEscHandler.current = null;
      }
      
      // Update ARIA attributes
      if (buttonRef.current && drawerRef.current) {
        MobileNavigation.setupDrawerAria(
          buttonRef.current,
          drawerRef.current,
          false
        );
      }
      
      // Return focus to button
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    }

    return () => {
      // Cleanup on unmount
      if (cleanupFocusTrap.current) {
        cleanupFocusTrap.current();
      }
      if (cleanupEscHandler.current) {
        cleanupEscHandler.current();
      }
      MobileNavigation.preventBodyScroll(false);
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          ref={buttonRef}
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-card border-border touch-target"
          aria-controls="mobile-drawer"
          aria-expanded={isMobileOpen}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 mobile-drawer mobile-drawer-content',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-primary">BITFUSE</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeDrawer}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors touch-target',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              BITFUSE © 2025
            </p>
          </div>
        </div>
      </div>
    </>
  );
}