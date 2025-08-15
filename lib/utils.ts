import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { APP_CONFIG } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency value to BRL format
 */
export function formatCurrency(
  value: number,
  currency: string = APP_CONFIG.currency
): string {
  if (currency === 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format date to Brazilian format
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
}

/**
 * Format date and time to Brazilian format
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format time only
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(dateObj);
}

/**
 * Get user initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format phone number to Brazilian format
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Format CPF to Brazilian format
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
}

/**
 * Truncate wallet address for display
 */
export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Calculate time remaining from a date
 */
export function getTimeRemaining(endDate: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  const total = end.getTime() - now.getTime();
  
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return { days, hours, minutes, seconds, total };
}

/**
 * Format countdown time display
 */
export function formatCountdown(timeRemaining: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}): string {
  const { days, hours, minutes, seconds } = timeRemaining;
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * Generate referral link
 */
export function generateReferralLink(username: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://bitfuse.com';
  return `${baseUrl}/auth/register?ref=${username}`;
}

/**
 * Calculate investment returns
 */
export function calculateReturns(
  amount: number,
  dailyRate: number,
  days: number
): {
  dailyReturn: number;
  totalReturn: number;
  totalAmount: number;
} {
  const dailyReturn = amount * dailyRate;
  const totalReturn = dailyReturn * days;
  const totalAmount = amount + totalReturn;
  
  return { dailyReturn, totalReturn, totalAmount };
}

/**
 * Calculate withdrawal fee
 */
export function calculateWithdrawalFee(amount: number): {
  fee: number;
  finalAmount: number;
} {
  const fee = amount * APP_CONFIG.withdrawalFee;
  const finalAmount = amount - fee;
  
  return { fee, finalAmount };
}

/**
 * Validate CPF (basic validation)
 */
export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11 && !/^(\d)\1{10}$/.test(cleaned);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Brazilian format)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Convert BRL to USDT
 */
export function convertBRLToUSDT(brlAmount: number): number {
  return brlAmount / APP_CONFIG.usdtRate;
}

/**
 * Convert USDT to BRL
 */
export function convertUSDTToBRL(usdtAmount: number): number {
  return usdtAmount * APP_CONFIG.usdtRate;
}