export type DebtAccountType =
  | 'CREDIT_CARD'
  | 'AUTO_LOAN'
  | 'MORTGAGE'
  | 'STUDENT_LOAN'
  | 'PERSONAL_LOAN'
  | 'MEDICAL'
  | 'OTHER';

export interface DebtAccount {
  id: string;
  userId: string;
  name: string;
  accountType: DebtAccountType;
  creditLimit?: number; // For credit cards
  interestRate?: number; // Optional, for display/info only
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BalanceEntry {
  id: string;
  accountId: string;
  userId: string;
  value: number; // Current debt balance
  entryDate: Date;
  note?: string;
  createdAt: Date;
}

export interface DashboardSummary {
  totalDebt: number;
  previousDebt: number;
  change: number;
  changePercent: number;
  accountCount: number;
  lastUpdated: Date | null;
}

export interface ChartDataPoint {
  date: string;
  total: number;
  [accountId: string]: number | string; // Dynamic account keys
}

export interface TimeFilter {
  label: string;
  value: string;
  days?: number;
}
