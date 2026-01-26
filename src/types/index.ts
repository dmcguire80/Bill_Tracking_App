export interface Account {
  id: string;
  name: string;
  order: number;
}

// REMOVED CONSTANT: ACCOUNTS is now managed in DataContext

export interface Bill {
  id: string;
  templateId?: string; // Link to the template it was generated from
  type: 'bill';
  date: number;
  month: string;
  name: string;
  paid: boolean;
  amounts: Partial<Record<string, number>>;
}

export interface Payday {
  id: string;
  templateId?: string; // Link to the template it was generated from
  type: 'payday';
  date: number;
  month: string;
  name: string; // "Payday" usually
  balances: Partial<Record<string, number>>;
}

export type RecurrenceType =
  | 'weekly'
  | 'bi-weekly'
  | 'semi-monthly'
  | 'monthly'
  | 'yearly'
  | 'custom-interval'
  | 'manual';

export interface BillTemplate {
  id: string;
  name: string;
  day: number; // Day of month (1-31) or starting day for bi-weekly/custom
  day2?: number; // Second day for semi-monthly
  month?: string; // For yearly bills
  startMonth?: string; // When to start generating
  endMonth?: string; // When to stop generating
  recurrence: RecurrenceType | 'one-time';
  intervalDays?: number; // For custom-interval
  manualDates?: { month: string; day: number }[]; // For manual recurrence
  amounts: Partial<Record<string, number>>;
  autoGenerate: boolean;
  isActive: boolean;
}

export interface PaydayTemplate {
  id: string;
  name: string;
  day: number;
  day2?: number;
  recurrence: RecurrenceType | 'one-time';
  month?: string;
  startMonth?: string; // When to start generating
  endMonth?: string; // When to stop generating
  balances: Partial<Record<string, number>>;
  autoGenerate: boolean;
  isActive: boolean; // Whether this template is currently active
}

export type Entry = (Bill | Payday) & {
  calculatedBalances?: Partial<Record<string, number>>;
  totalOwed?: Partial<Record<string, number>>;
};
