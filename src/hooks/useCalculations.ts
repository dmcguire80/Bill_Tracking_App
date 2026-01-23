import { useMemo } from 'react';
import { ACCOUNTS } from '../types';
import type { Entry, Bill, Payday, Account } from '../types';

export const useCalculations = (data: Entry[]) => {
    const calculations = useMemo(() => {
        // Sort data by date/month to ensure correct order
        const sortedData = [...data].sort((a, b) => {
            // Very basic sort for now - assuming same month/year or chronological order in input
            if (a.month !== b.month) return 0; // TODO: Implement proper date sorting across months
            return a.date - b.date;
        });

        // Group by Payday period
        const periods: { payday: Payday; bills: Bill[] }[] = [];
        let currentPeriod: { payday: Payday; bills: Bill[] } | null = null;
        const orphans: Bill[] = []; // Bills before the first payday

        sortedData.forEach(entry => {
            if (entry.type === 'payday') {
                if (currentPeriod) periods.push(currentPeriod);
                currentPeriod = { payday: entry as Payday, bills: [] };
            } else {
                if (currentPeriod) {
                    currentPeriod.bills.push(entry as Bill);
                } else {
                    orphans.push(entry as Bill);
                }
            }
        });
        if (currentPeriod) periods.push(currentPeriod);

        // Calculate balances for each period
        const processedPeriods = periods.map(period => {
            const { payday, bills } = period;
            const currentBalances = { ...payday.balances } as Record<Account, number>;

            // Ensure all accounts exist
            ACCOUNTS.forEach(acc => {
                if (currentBalances[acc] === undefined) currentBalances[acc] = 0;
            });

            // Calculate remaining balance by subtracting PAID bills
            bills.forEach(bill => {
                if (bill.paid) {
                    ACCOUNTS.forEach(acc => {
                        const amount = bill.amounts[acc];
                        if (amount) {
                            currentBalances[acc] = (currentBalances[acc] || 0) - amount;
                        }
                    });
                }
            });

            return {
                payday: { ...payday, calculatedBalances: { ...currentBalances } },
                bills: bills.map(bill => ({ ...bill, calculatedBalances: { ...currentBalances } })) // Pass remaining balance to bills too? Or previous logic?
                // Actually, let's pass the *Remaining* balance to all bills in the period for now, 
                // or just leave them empty if we only care about the Payday row.
                // The BillTable logic I wrote for Bills uses `bill.amounts` mostly.
            };
        });

        // Flatten back to list
        const result: Entry[] = [
            ...orphans,
            ...processedPeriods.flatMap(p => [p.payday, ...p.bills])
        ];

        return result;
    }, [data]);

    return calculations;
};
