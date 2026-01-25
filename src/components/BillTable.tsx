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
        <div className="overflow-auto max-h-[calc(100vh-140px)] rounded-xl border border-white/10 shadow-2xl backdrop-blur-md bg-white/5 mx-[-16px] md:mx-0">
            <table className="w-full text-sm text-left text-neutral-300">
                <thead className="text-xs uppercase bg-[#1e293b] text-neutral-100 font-bold tracking-wider sticky top-0 z-20 shadow-md">
                    <tr>
                        <th className="px-2 py-3 sticky left-0 z-30 bg-[#1e293b] w-12 text-center border-r border-white/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">Mo</th>
                        <th className="px-3 py-3 sticky left-12 z-30 bg-[#1e293b] min-w-[60px] border-r border-white/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">Date</th>
                        <th className="px-4 py-3 min-w-[140px]">Bill</th>
                        <th className="px-2 py-3 text-center w-12">Paid</th>
                        {accounts.map((account, index) => (
                            <th
                                key={account.id}
                                className={`px-4 py-3 text-right min-w-[100px] text-emerald-400 ${index > 0 ? 'hidden md:table-cell' : ''}`}
                            >
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
                <td className="px-2 py-3 sticky left-0 z-20 bg-[#0f1d18] border-r border-emerald-500/20 text-center text-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                    {entry.month}
                </td>
                <td className="px-3 py-3 sticky left-12 z-20 bg-[#0f1d18] border-r border-emerald-500/20 text-emerald-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                    {entry.date}
                </td>
                <td className="px-4 py-3 text-base md:text-lg text-emerald-300 uppercase tracking-wide truncate max-w-[140px] md:max-w-none">
                    <div className="flex items-center justify-between">
                        <span>{entry.name}</span>
                        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(entry)} className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white">
                                <Edit2 size={14} />
                            </button>
                            <button onClick={() => onDelete(entry.id)} className="p-1 hover:bg-red-500/20 rounded text-neutral-400 hover:text-red-400">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                </td>
                <td className="px-2 py-3 text-center text-emerald-500/50">-</td>
                {accounts.map((account, index) => {
                    const owed = entry.totalOwed?.[account.name] || 0;
                    const remaining = entry.calculatedBalances?.[account.name] ?? 0;

                    return (
                        <td key={account.id} className={`px-4 py-3 text-right ${index > 0 ? 'hidden md:table-cell' : ''}`}>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex flex-col items-end text-[10px] font-mono opacity-60 leading-tight">
                                    <span>Start:</span>
                                    <span className="mb-1">{formatCurrency(owed)}</span>
                                </div>
                                <span className="px-2 py-1 rounded shadow-sm font-bold min-w-[70px] text-center bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs md:text-sm">
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
            <td className="px-2 py-3 sticky left-0 z-10 bg-[#0f172a] border-r border-white/10 text-center text-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                {entry.month}
            </td>
            <td className="px-3 py-3 sticky left-12 z-10 bg-[#0f172a] border-r border-white/10 font-mono text-neutral-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                {entry.date}
            </td>
            <td className="px-4 py-3 font-medium text-white truncate max-w-[140px] md:max-w-none">
                <div className="flex items-center justify-between">
                    <span className="truncate">{entry.name}</span>
                    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(entry)} className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white">
                            <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(entry.id)} className="p-1 hover:bg-red-500/20 rounded text-neutral-400 hover:text-red-400">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </td>
            <td className="px-2 py-3 text-center">
                <button
                    onClick={() => onTogglePaid(entry.id)}
                    className={clsx(
                        "p-1.5 rounded-md transition-all duration-300 shadow-lg",
                        bill.paid
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 ring-1 ring-emerald-500/50"
                            : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 ring-2 ring-orange-500/50"
                    )}
                >
                    {bill.paid ? <Check size={14} strokeWidth={3} /> : <Circle size={14} />}
                </button>
            </td>
            {accounts.map((account, index) => {
                const amount = bill.amounts[account.name];
                return (
                    <td key={account.id} className={`px-4 py-3 text-right font-mono text-neutral-300 ${index > 0 ? 'hidden md:table-cell' : ''}`}>
                        {amount !== undefined ? formatCurrency(amount) : <span className="text-white/10">-</span>}
                    </td>
                );
            })}
        </tr>
    );
};
