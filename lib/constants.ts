// System configuration
export const SYSTEM_TIME = "2025-08-14T20:18:00Z";

// Investment plans configuration
export const INVESTMENT_PLANS = {
  "miner-start": {
    id: "miner-start",
    name: "Miner Start",
    dailyReturn: 0.015, // 1.5%
    minAmount: 200,
    maxAmount: 5000,
    durationDays: 30,
  },
  "miner-cosmico": {
    id: "miner-cosmico",
    name: "Miner Cósmico",
    dailyReturn: 0.025, // 2.5%
    minAmount: 5000,
    maxAmount: 50000,
    durationDays: 60,
  },
  "miner-cosmico-plus": {
    id: "miner-cosmico-plus",
    name: "Miner Cósmico Plus",
    dailyReturn: 0.035, // 3.5%
    minAmount: 50000,
    maxAmount: 500000,
    durationDays: 90,
  },
} as const;

// App configuration
export const APP_CONFIG = {
  currency: "BRL",
  currencySymbol: "R$",
  usdtRate: 5.45,
  minDepositAmount: 200,
  withdrawalFee: 0.02, // 2%
  referralLevels: [0.1, 0.05, 0.03, 0.02, 0.01], // 10%, 5%, 3%, 2%, 1%
  supportPhone: "+5511999999999",
  investmentPlans: Object.values(INVESTMENT_PLANS),
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  RETURN: "return",
  COMMISSION: "commission",
  ADJUSTMENT: "adjustment",
  INVESTMENT: "investment",
} as const;

// Transaction statuses
export const TRANSACTION_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

// Investment statuses
export const INVESTMENT_STATUSES = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// KYC statuses
export const KYC_STATUSES = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

// User statuses
export const USER_STATUSES = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  BANNED: "banned",
} as const;

// Withdrawal methods
export const WITHDRAWAL_METHODS = {
  CRYPTO: "crypto",
  PIX: "pix",
} as const;