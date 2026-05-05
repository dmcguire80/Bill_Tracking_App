import type { DebtAccount, BalanceEntry, DashboardSummary, ChartDataPoint } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFilterDays(filter: string): number | null {
  const daysMap: Record<string, number | null> = {
    '1M': 30,
    '3M': 90,
    '6M': 180,
    'YTD': getDaysSinceYearStart(),
    '1Y': 365,
    '3Y': 1095,
    '5Y': 1825,
    'Max': null,
    'latest': null,
  };
  return daysMap[filter] ?? null;
}

function getDaysSinceYearStart(): number {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - yearStart.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function calculateDashboardSummary(
  accounts: DebtAccount[],
  entries: BalanceEntry[],
  days: number | null
): DashboardSummary {
  const now = new Date();
  const cutoffDate = days ? new Date(now.getTime() - days * 24 * 60 * 60 * 1000) : null;

  // Filter entries by date if needed
  const filteredEntries = cutoffDate
    ? entries.filter((e) => e.entryDate >= cutoffDate)
    : entries;

  if (filteredEntries.length === 0) {
    return {
      totalDebt: 0,
      previousDebt: 0,
      change: 0,
      changePercent: 0,
      accountCount: accounts.length,
      lastUpdated: null,
    };
  }

  // Get latest entry date
  const sortedEntries = [...filteredEntries].sort(
    (a, b) => b.entryDate.getTime() - a.entryDate.getTime()
  );
  const latestDate = sortedEntries[0].entryDate;
  const lastUpdated = latestDate;

  // Calculate current total (latest entry for each account)
  const latestByAccount = new Map<string, number>();
  for (const entry of sortedEntries) {
    if (!latestByAccount.has(entry.accountId)) {
      latestByAccount.set(entry.accountId, entry.value);
    }
  }

  const totalDebt = Array.from(latestByAccount.values()).reduce((sum, val) => sum + val, 0);

  // Calculate previous total (second-to-last unique date)
  const uniqueDates = Array.from(new Set(sortedEntries.map((e) => e.entryDate.getTime()))).sort(
    (a, b) => b - a
  );

  let previousDebt = totalDebt;
  if (uniqueDates.length > 1) {
    const previousDate = new Date(uniqueDates[1]);
    const previousByAccount = new Map<string, number>();

    for (const entry of sortedEntries) {
      if (
        entry.entryDate.getTime() === previousDate.getTime() &&
        !previousByAccount.has(entry.accountId)
      ) {
        previousByAccount.set(entry.accountId, entry.value);
      }
    }

    if (previousByAccount.size > 0) {
      previousDebt = Array.from(previousByAccount.values()).reduce((sum, val) => sum + val, 0);
    }
  }

  const change = totalDebt - previousDebt;
  const changePercent = previousDebt !== 0 ? (change / previousDebt) * 100 : 0;

  return {
    totalDebt,
    previousDebt,
    change,
    changePercent,
    accountCount: accounts.length,
    lastUpdated,
  };
}

export function generateChartData(
  entries: BalanceEntry[],
  accounts: DebtAccount[],
  days: number | null
): ChartDataPoint[] {
  if (entries.length === 0) return [];

  const now = new Date();
  const cutoffDate = days ? new Date(now.getTime() - days * 24 * 60 * 60 * 1000) : null;

  // Filter entries by date
  const filteredEntries = cutoffDate
    ? entries.filter((e) => e.entryDate >= cutoffDate)
    : entries;

  if (filteredEntries.length === 0) return [];

  // Group by date
  const entriesByDate = new Map<string, Map<string, number>>();

  for (const entry of filteredEntries) {
    const dateStr = formatDateInput(entry.entryDate);
    if (!entriesByDate.has(dateStr)) {
      entriesByDate.set(dateStr, new Map());
    }
    entriesByDate.get(dateStr)!.set(entry.accountId, entry.value);
  }

  // Sort dates
  const sortedDates = Array.from(entriesByDate.keys()).sort();

  // Build chart data
  const chartData: ChartDataPoint[] = [];
  const accountIds = accounts.map((a) => a.id);

  for (const dateStr of sortedDates) {
    const dataPoint: ChartDataPoint = {
      date: dateStr,
      total: 0,
    };

    const dateMap = entriesByDate.get(dateStr)!;

    for (const accountId of accountIds) {
      const value = dateMap.get(accountId) || 0;
      dataPoint[accountId] = value;
      dataPoint.total += value;
    }

    chartData.push(dataPoint);
  }

  return chartData;
}

export function getAccountTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    CREDIT_CARD: 'Credit Card',
    AUTO_LOAN: 'Auto Loan',
    MORTGAGE: 'Mortgage',
    STUDENT_LOAN: 'Student Loan',
    PERSONAL_LOAN: 'Personal Loan',
    MEDICAL: 'Medical',
    OTHER: 'Other',
  };
  return labels[type] || type;
}

export function getAccountTypeColor(type: string): string {
  const colors: Record<string, string> = {
    CREDIT_CARD: '#ef4444', // red
    AUTO_LOAN: '#f97316', // orange
    MORTGAGE: '#8b5cf6', // purple
    STUDENT_LOAN: '#3b82f6', // blue
    PERSONAL_LOAN: '#10b981', // green
    MEDICAL: '#ec4899', // pink
    OTHER: '#6b7280', // gray
  };
  return colors[type] || '#6b7280';
}
