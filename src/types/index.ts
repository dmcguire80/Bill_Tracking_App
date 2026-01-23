export type Account =
    | 'CFCU'
    | 'Apple'
    | 'Venmo'
    | 'Cap1'
    | 'Ally'
    | 'Biz'
    | 'Mom Auto'
    | 'Mom Manual';

export const ACCOUNTS: Account[] = [
    'CFCU', 'Apple', 'Venmo', 'Cap1', 'Ally', 'Biz', 'Mom Auto', 'Mom Manual'
];

export interface Bill {
    id: string;
    type: 'bill';
    date: number;
    month: string;
    name: string;
    paid: boolean;
    amounts: Partial<Record<Account, number>>;
}

export interface Payday {
    id: string;
    type: 'payday';
    date: number;
    month: string;
    name: string; // "Payday" usually
    balances: Partial<Record<Account, number>>;
}

export type Entry = (Bill | Payday) & {
    calculatedBalances?: Partial<Record<Account, number>>;
};
