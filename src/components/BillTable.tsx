import { useData } from '../context/DataContext';
import type { Bill, Entry } from '../types';
import { formatCurrency } from '../utils/format';
import { Check, Circle, Edit2, Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface BillTableProps {
    data: Entry[];
    onTogglePaid: (id: string) => void;
    onEdit: (entry: Entry) => void;
    onDelete: (id: string) => void;
}

export const BillTable = ({ data, onTogglePaid, onEdit, onDelete }: BillTableProps) => {
    const { accounts } = useData();
    return (
        <div className="overflow-auto max-h-[calc(100vh-180px)] rounded-xl border border-white/10 shadow-2xl backdrop-blur-md bg-white/5">
            <table className="w-full text-sm text-left text-neutral-300">
                <thead className="text-xs uppercase bg-[#1e293b] text-neutral-100 font-bold tracking-wider sticky top-0 z-20">
                    <tr>
                        <th className="px-4 py-3 sticky left-0 z-10 bg-[#1e293b]/90 backdrop-blur-md min-w-[120px]">Month</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 min-w-[200px]">Bill</th>
                        <th className="px-4 py-3 text-center">Paid</th>
                        {accounts.map((account) => (
                            <th key={account.id} className="px-4 py-3 text-right min-w-[100px] text-emerald-400">
                                {account.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry) => (
                        <Row
                            key={entry.id}
                            entry={entry}
                            onTogglePaid={onTogglePaid}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Row = ({ entry, onTogglePaid, onEdit, onDelete }: {
    entry: Entry;
    onTogglePaid: (id: string) => void;
    onEdit: (entry: Entry) => void;
    onDelete: (id: string) => void;
}) => {
    const { accounts } = useData();
    const isPayday = entry.type === 'payday';

    if (isPayday) {
        return (
            <tr className="bg-emerald-500/10 border-y border-emerald-500/20 font-bold text-white relative group">
                <td className="px-4 py-3 sticky left-0 bg-[#0f1d18]/90 backdrop-blur-md border-r border-emerald-500/20">
                    <div className="flex items-center justify-between gap-2">
                        <span>{entry.month}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(entry)} className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white">
                                <Edit2 size={14} />
                            </button>
                            <button onClick={() => onDelete(entry.id)} className="p-1 hover:bg-red-500/20 rounded text-neutral-400 hover:text-red-400">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3 text-emerald-400">{entry.date}</td>
                <td className="px-4 py-3 text-lg text-emerald-300 uppercase tracking-wide">
                    {entry.name}
                </td>
                <td className="px-4 py-3 text-center text-emerald-500/50">-</td>
                {accounts.map((account) => {
                    const owed = entry.totalOwed?.[account.name] || 0;
                    const remaining = entry.calculatedBalances?.[account.name] ?? 0;

                    return (
                        <td key={account.id} className="px-4 py-3 text-right">
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex flex-col items-end text-[10px] font-mono opacity-60 leading-tight">
                                    <span>Start:</span>
                                    <span className="mb-1">{formatCurrency(owed)}</span>
                                </div>
                                <span className="px-2 py-1 rounded shadow-sm font-bold min-w-[70px] text-center bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    {formatCurrency(remaining)}
                                </span>
                            </div>
                        </td>
                    );
                })}
            </tr>
        );
    }

    const bill = entry as Bill;
    return (
        <tr className={clsx(
            "border-b border-white/5 transition-colors hover:bg-white/5 group",
            bill.paid && "opacity-50 grayscale-[0.5]"
        )}>
            <td className="px-4 py-3 sticky left-0 bg-[#0f172a] border-r border-white/5">
                <div className="flex items-center justify-between gap-2">
                    <span>{entry.month}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(entry)} className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white">
                            <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(entry.id)} className="p-1 hover:bg-red-500/20 rounded text-neutral-400 hover:text-red-400">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 font-mono text-neutral-400">{entry.date}</td>
            <td className="px-4 py-3 font-medium text-white">{entry.name}</td>
            <td className="px-4 py-3 text-center">
                <button
                    onClick={() => onTogglePaid(entry.id)}
                    className={clsx(
                        "p-1.5 rounded-md transition-all duration-300 shadow-lg",
                        bill.paid
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 ring-1 ring-emerald-500/50"
                            : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 ring-2 ring-orange-500/50 animate-pulse"
                    )}
                >
                    {bill.paid ? <Check size={16} strokeWidth={3} /> : <Circle size={16} />}
                </button>
            </td>
            {accounts.map((account) => {
                const amount = bill.amounts[account.name];
                return (
                    <td key={account.id} className="px-4 py-3 text-right font-mono text-neutral-300">
                        {amount !== undefined ? formatCurrency(amount) : <span className="text-white/10">-</span>}
                    </td>
                );
            })}
        </tr>
    );
};
