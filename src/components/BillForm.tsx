import { useState } from 'react';
import { ACCOUNTS } from '../types';
import type { Bill } from '../types';
import { X } from 'lucide-react';

interface BillFormProps {
    initialData?: Bill;
    onSave: (bill: Omit<Bill, 'id' | 'type' | 'paid'>) => void;
    onClose: () => void;
}

export const BillForm = ({ initialData, onSave, onClose }: BillFormProps) => {
    const [name, setName] = useState(initialData?.name || '');
    const [date, setDate] = useState(initialData?.date || new Date().getDate());
    const [month, setMonth] = useState(initialData?.month || "Jan '26");
    const [amounts, setAmounts] = useState<Record<string, number>>(initialData?.amounts || {});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            date: Number(date),
            month,
            amounts
        });
        onClose();
    };

    const handleAmountChange = (account: string, value: string) => {
        const numValue = parseFloat(value);
        setAmounts(prev => {
            const next = { ...prev };
            if (isNaN(numValue) || numValue === 0) {
                delete next[account as any];
            } else {
                next[account as any] = numValue;
            }
            return next;
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Bill' : 'Add New Bill'}</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Bill Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Date (Day)</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                value={date}
                                onChange={(e) => setDate(Number(e.target.value))}
                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Month</label>
                            <input
                                type="text"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Amounts per Account</label>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {ACCOUNTS.map(account => (
                                <div key={account} className="flex items-center gap-3">
                                    <label className="w-24 text-sm text-neutral-300 truncate">{account}</label>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={amounts[account] || ''}
                                            onChange={(e) => handleAmountChange(account, e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded px-3 pl-7 py-1.5 text-white focus:outline-none focus:border-emerald-500 text-right"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-neutral-300 hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                        >
                            Save Bill
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
