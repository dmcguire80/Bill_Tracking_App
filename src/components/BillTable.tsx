import { ACCOUNTS } from '../types';
import type { Bill, Entry, Payday } from '../types';
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
    return (
        <div className="overflow-x-auto rounded-xl border border-white/10 shadow-2xl backdrop-blur-md bg-white/5">
            <table className="w-full text-sm text-left text-neutral-300">
                <thead className="text-xs uppercase bg-white/10 text-neutral-100 font-bold tracking-wider">
                    <tr>
                        <th className="px-4 py-3 sticky left-0 z-10 bg-[#1e293b]/90 backdrop-blur-md">Month</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 min-w-[200px]">Bill</th>
                        <th className="px-4 py-3 text-center">Paid</th>
                        {ACCOUNTS.map((account) => (
                            <th key={account} className="px-4 py-3 text-right min-w-[100px] text-emerald-400">
                                {account}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-right">Actions</th>
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
    const isPayday = entry.type === 'payday';

    if (isPayday) {
        return (
            <tr className="bg-emerald-500/10 border-y border-emerald-500/20 font-bold text-white relative group">
                <td className="px-4 py-3 sticky left-0 bg-[#0f1d18]/90 backdrop-blur-md border-r border-emerald-500/20">
                    {entry.month}
                </td>
                <td className="px-4 py-3 text-emerald-400">{entry.date}</td>
                <td className="px-4 py-3 text-lg text-emerald-300 uppercase tracking-wide">
                    {entry.name}
                </td>
                <td className="px-4 py-3 text-center text-emerald-500/50">-</td>
                {ACCOUNTS.map((account) => {
                    const amount = (entry as Payday).balances[account]; // Original amount (Income)
                    const remaining = entry.calculatedBalances?.[account]; // Remaining after paid bills

                    return (
                        <td key={account} className="px-4 py-3 text-right">
                            {amount !== undefined ? (
                                <div className="flex flex-col items-end gap-1">
                                    <span className={clsx(
                                        "px-2 py-0.5 rounded text-[10px] font-mono opacity-60",
                                        "bg-white/5 text-white"
                                    )}>
                                        Start: {formatCurrency(amount)}
                                    </span>
                                    <span className={clsx(
                                        "px-2 py-1 rounded shadow-sm font-bold min-w-[70px] text-center",
                                        (remaining || 0) < 0 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    )}>
                                        {formatCurrency(remaining ?? amount)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-white/20">-</span>
                            )}
                        </td>
                    );
                })}
                <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(entry)} className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white">
                            <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(entry.id)} className="p-1 hover:bg-red-500/20 rounded text-neutral-400 hover:text-red-400">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </td>
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
                {entry.month}
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
                            : "bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-white ring-1 ring-white/10"
                    )}
                >
                    {bill.paid ? <Check size={16} strokeWidth={3} /> : <Circle size={16} />}
                </button>
            </td>
            {ACCOUNTS.map((account) => {
                const amount = bill.amounts[account];
                return (
                    <td key={account} className="px-4 py-3 text-right font-mono text-neutral-300">
                        {amount !== undefined ? formatCurrency(amount) : <span className="text-white/10">-</span>}
                    </td>
                );
            })}
            <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(entry)} className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white">
                        <Edit2 size={14} />
                    </button>
                    <button onClick={() => onDelete(entry.id)} className="p-1 hover:bg-red-500/20 rounded text-neutral-400 hover:text-red-400">
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
};
