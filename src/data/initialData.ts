import type { Entry } from '../types';

export const initialData: Entry[] = [
    {
        id: '1',
        type: 'bill',
        month: "Jan '26",
        date: 4,
        name: 'United Health Care',
        paid: false,
        amounts: {
            'Mom Auto': 312
        }
    },
    {
        id: '2',
        type: 'payday',
        month: "Jan '26",
        date: 7,
        name: 'Payday',
        balances: {
            'CFCU': 1164,
            'Apple': 20,
            'Venmo': 0,
            'Cap1': 683,
            'Ally': 0,
            'Biz': 0,
            'Mom Auto': 102,
            'Mom Manual': 244
        }
    },
    {
        id: '3',
        type: 'bill',
        month: "Jan '26",
        date: 8,
        name: 'Wowway',
        paid: true,
        amounts: {
            'CFCU': 297
        }
    },
    {
        id: '4',
        type: 'bill',
        month: "Jan '26",
        date: 8,
        name: 'Apple Card CC',
        paid: true,
        amounts: {
            'CFCU': 150,
            'Cap1': 150
        }
    },
    {
        id: '5',
        type: 'bill',
        month: "Jan '26",
        date: 11,
        name: 'Venmo CC',
        paid: false,
        amounts: {
            'CFCU': 0
        }
    },
    {
        id: '6',
        type: 'bill',
        month: "Jan '26",
        date: 14,
        name: 'LendingClub',
        paid: false,
        amounts: {
            'Cap1': 513
        }
    },
    {
        id: '7',
        type: 'bill',
        month: "Jan '26",
        date: 14,
        name: 'Canva',
        paid: true,
        amounts: {
            'Biz': 0
        }
    },
    {
        id: '8',
        type: 'bill',
        month: "Jan '26",
        date: 15,
        name: 'Planet Dave',
        paid: true,
        amounts: {
            'CFCU': 20
        }
    },
    {
        id: '9',
        type: 'bill',
        month: "Jan '26",
        date: 15,
        name: 'Linda Car',
        paid: false,
        amounts: {
            'Mom Manual': 244
        }
    }
];
