import type { BillTemplate, Entry, Bill } from '../types';

export interface BillAnalytics {
  templateId: string;
  templateName: string;
  ytdPaid: number;
  ytdPlanned: number;
  paidCount: number;
  plannedCount: number;
  currentAmount: number;
  averagePaidAmount: number;
  hasChange: boolean;
  changeType: 'increase' | 'decrease' | 'none';
  changeAmount: number;
  changePercentage: number;
}

/**
 * Calculate year-to-date analytics for all bill templates
 */
export const calculateBillAnalytics = (
  templates: BillTemplate[],
  entries: Entry[],
  year: number = new Date().getFullYear()
): BillAnalytics[] => {
  // Support multiple year formats to handle data inconsistencies
  // Examples: "Jan '26", "Jan 26", "Jan 2026"
  const yearSuffix = `'${year.toString().slice(-2)}`; // '26
  const yearShort = ` ${year.toString().slice(-2)}`; // " 26"
  const yearFull = year.toString(); // "2026"

  return templates.map(template => {
    // Filter entries for this template in the current year (flexible format matching)
    // Include both template-generated entries AND one-time payments with matching names
    const templateEntries = entries.filter(e => {
      // Skip non-bill entries
      if (e.type !== 'bill') return false;

      // Check if year matches (support multiple formats)
      const yearMatches =
        e.month.includes(yearSuffix) || e.month.includes(yearShort) || e.month.includes(yearFull);

      if (!yearMatches) return false;

      // Match by templateId (template-generated entries)
      if (e.templateId === template.id) return true;

      // Match by name (one-time payments with same name)
      if (e.name === template.name && !e.templateId) return true;

      return false;
    }) as Bill[];

    // Get paid entries
    const paidEntries = templateEntries.filter(e => e.paid);

    // Calculate YTD paid (sum of actual paid amounts)
    const ytdPaid = paidEntries.reduce((sum, entry) => {
      // Sum amounts across all accounts for this entry
      const entryTotal = Object.values(entry.amounts).reduce((a, b) => (a || 0) + (b || 0), 0) || 0;
      return sum + entryTotal;
    }, 0);

    // Calculate YTD planned (all generated entries for this year)
    const plannedCount = templateEntries.length;
    const currentAmount =
      Object.values(template.amounts).reduce((a, b) => (a || 0) + (b || 0), 0) || 0;
    const ytdPlanned = plannedCount * currentAmount;

    // Calculate average paid amount to detect changes
    const averagePaidAmount = paidEntries.length > 0 ? ytdPaid / paidEntries.length : 0;

    // Detect changes (only if we have paid history)
    let hasChange = false;
    let changeType: 'increase' | 'decrease' | 'none' = 'none';
    let changeAmount = 0;
    let changePercentage = 0;

    if (paidEntries.length > 0 && averagePaidAmount > 0) {
      const diff = currentAmount - averagePaidAmount;
      const threshold = 0.01; // Ignore changes less than 1 cent

      if (Math.abs(diff) > threshold) {
        hasChange = true;
        changeAmount = diff;
        changePercentage = (diff / averagePaidAmount) * 100;
        changeType = diff > 0 ? 'increase' : 'decrease';
      }
    }

    return {
      templateId: template.id,
      templateName: template.name,
      ytdPaid,
      ytdPlanned,
      paidCount: paidEntries.length,
      plannedCount,
      currentAmount,
      averagePaidAmount,
      hasChange,
      changeType,
      changeAmount,
      changePercentage,
    };
  });
};

/**
 * Get templates that have amount changes
 */
export const getChangedBills = (analytics: BillAnalytics[]): BillAnalytics[] => {
  return analytics.filter(a => a.hasChange);
};
