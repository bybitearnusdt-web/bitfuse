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

// Default user data
export const DEFAULT_USER = {
  id: "default-user-id",
  name: "Paul Stephen",
  email: "skiddylnx@gmail.com",
  username: "bybitearnusdt-web",
  country: "BR",
  cpf: "123.456.789-00",
  phone: "+5511987654321",
  memberSince: "2025-08-03",
  status: "active",
  kycStatus: "verified",
  usdtWallet: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
  balance: {
    total: 15420.50,
    available: 8320.50,
    invested: 7100.00,
    referralEarnings: 450.25,
  },
  activeInvestments: [
    {
      id: "inv-001",
      planId: "miner-cosmico",
      amount: 7100.00,
      dailyReturn: 177.50,
      startDate: "2025-08-10",
      endDate: "2025-10-09",
      status: "active",
      daysRemaining: 45,
    },
  ],
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

// Mock data for development
export const MOCK_TRANSACTIONS = [
  {
    id: "txn-001",
    type: TRANSACTION_TYPES.RETURN,
    amount: 177.50,
    currency: "BRL",
    status: TRANSACTION_STATUSES.COMPLETED,
    createdAt: "2025-08-14T10:00:00Z",
    description: "Retorno diário - Miner Cósmico",
  },
  {
    id: "txn-002",
    type: TRANSACTION_TYPES.DEPOSIT,
    amount: 5000.00,
    currency: "BRL",
    status: TRANSACTION_STATUSES.COMPLETED,
    createdAt: "2025-08-13T15:30:00Z",
    description: "Depósito via PIX",
  },
  {
    id: "txn-003",
    type: TRANSACTION_TYPES.COMMISSION,
    amount: 50.00,
    currency: "BRL",
    status: TRANSACTION_STATUSES.COMPLETED,
    createdAt: "2025-08-12T09:15:00Z",
    description: "Comissão de indicação - Nível 1",
  },
] as const;

export const MOCK_REFERRALS = [
  {
    id: "ref-001",
    username: "user123",
    level: 1,
    earnings: 250.00,
    registeredAt: "2025-08-05",
    status: "active",
  },
  {
    id: "ref-002",
    username: "investor456",
    level: 2,
    earnings: 125.00,
    registeredAt: "2025-08-08",
    status: "active",
  },
] as const;

export const MOCK_ADMIN_STATS = {
  totalUsers: 1247,
  activeInvestments: 856,
  totalInvested: 2450000.00,
  totalReturns: 345600.00,
  pendingWithdrawals: 15,
  newUsersToday: 23,
} as const;

export const MOCK_USERS = [
  {
    id: "user-001",
    name: "João Silva",
    email: "joao@example.com",
    username: "joaosilva",
    country: "BR",
    memberSince: "2025-07-15",
    status: "active",
    kycStatus: "verified",
    balance: 2500.00,
    invested: 5000.00,
  },
  {
    id: "user-002",
    name: "Maria Santos",
    email: "maria@example.com",
    username: "mariasantos",
    country: "BR",
    memberSince: "2025-08-01",
    status: "active",
    kycStatus: "pending",
    balance: 850.00,
    invested: 1000.00,
  },
] as const;