import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Navigation } from '../components/Navigation';
import { SettingsNav } from '../components/SettingsNav';
import { Plus, Trash2, Calendar, RefreshCw, Edit2 } from 'lucide-react';
import type { BillTemplate, RecurrenceType } from '../types';

export const ManageBills = () => {
    const { templates, accounts, addTemplate, deleteTemplate, updateTemplate } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [recurrence, setRecurrence] = useState<RecurrenceType | 'one-time'>('monthly');
    const [day, setDay] = useState(1);
    const [day2, setDay2] = useState<number>(15);
    const [month, setMonth] = useState('Jan');
    const [startMonth, setStartMonth] = useState('Jan');
    const [endMonth, setEndMonth] = useState<string | undefined>(undefined);
    const [isActive, setIsActive] = useState(true);
    const [amounts, setAmounts] = useState<Partial<Record<string, number>>>({});

    const handleOpenForm = () => {
        setIsFormOpen(true);
        setEditingId(null);
        // Reset form
        setName('');
        setRecurrence('monthly');
        setDay(1);
        setStartMonth('Jan');
        setEndMonth(undefined);
        setIsActive(true);
        setAmounts({});
    };

    const handleEdit = (template: BillTemplate) => {
        setEditingId(template.id);
        setName(template.name);
        setRecurrence(template.recurrence);
        setDay(template.day);
        if (template.day2) setDay2(template.day2);
        if (template.month) setMonth(template.month);
        setStartMonth(template.startMonth || 'Jan');
        setEndMonth(template.endMonth);
        setIsActive(template.isActive);
        setAmounts(template.amounts);
        setIsFormOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const templateData = {
            name,
            recurrence,
            day: Number(day),
            day2: recurrence === 'semi-monthly' ? Number(day2) : undefined,
            month: recurrence === 'yearly' ? month : undefined,
            startMonth: recurrence !== 'one-time' ? startMonth : undefined,
            endMonth: recurrence !== 'one-time' && endMonth ? endMonth : undefined,
            amounts,
            autoGenerate: true,
            isActive
        };

        if (editingId) {
            updateTemplate({
                ...templateData,
                id: editingId
            });
        } else {
            addTemplate({
                ...templateData,
                id: crypto.randomUUID()
            });
        }
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleAmountChange = (account: string, val: string) => {
        const num = parseFloat(val);
        setAmounts(prev => {
            const next = { ...prev };
            if (!val || isNaN(num)) delete next[account];
            else next[account] = num;
            return next;
        });
    };



    return (
        <>
            <Navigation />

            <div className="space-y-8">
                <SettingsNav />



                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Manage Bill Templates</h2>
                        <p className="text-neutral-400">Set up recurring bills to auto-generate.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleOpenForm}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                        >
                            <Plus size={18} />
                            New Template
                        </button>
                    </div>
                </div>

                {/* Template List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {templates.map(t => (
                        <div key={t.id} className="bg-[#1e293b] border border-white/10 rounded-xl p-6 relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-white">{t.name}</h3>
                                        {!t.isActive && (
                                            <span className="px-2 py-0.5 bg-neutral-500/20 text-neutral-400 text-xs rounded border border-neutral-500/30">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-neutral-400 mt-1">
                                        <RefreshCw size={14} />
                                        <span className="capitalize">{t.recurrence}</span>
                                        <span>•</span>
                                        <Calendar size={14} />
                                        <span>
                                            {t.recurrence === 'bi-weekly' ? `Starts Day ${t.day}` :
                                                t.recurrence === 'yearly' ? `${t.month} ${t.day}` :
                                                    `Day ${t.day}`}
                                        </span>
                                    </div>
                                    {t.endMonth && (
                                        <div className="text-xs text-neutral-500 mt-1">
                                            Ends: {t.endMonth}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleEdit(t)}
                                    className="text-neutral-500 hover:text-blue-400 p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => deleteTemplate(t.id)}
                                    className="text-neutral-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-2 border-t border-white/5 pt-4">
                                {Object.entries(t.amounts).map(([acc, amt]) => (
                                    <div key={acc} className="flex justify-between text-sm">
                                        <span className="text-neutral-400">{acc}</span>
                                        <span className="font-mono text-emerald-300">${amt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {templates.length === 0 && (
                        <div className="col-span-full py-12 text-center text-neutral-500 border-2 border-dashed border-white/5 rounded-xl">
                            No templates yet. Create one to get started.
                        </div>
                    )}
                </div>

                {/* Modal Form */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit Bill Template' : 'New Bill Template'}</h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Bill Name</label>
                                    <input
                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                        value={name} onChange={e => setName(e.target.value)} required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-1">Recurrence</label>
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                            value={recurrence} onChange={e => setRecurrence(e.target.value as RecurrenceType)}
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="bi-weekly">Bi-Weekly (Every 2 weeks)</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="semi-monthly">Twice Monthly (e.g. 1st & 15th)</option>
                                            <option value="yearly">Yearly</option>
                                            <option value="one-time">One Time</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-1">
                                            {recurrence === 'bi-weekly' ? 'Start Day' : 'Day of Month'}
                                        </label>
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                            value={day} onChange={e => setDay(Number(e.target.value))} required
                                        >
                                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {recurrence === 'yearly' && (
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-1">Month</label>
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                            value={month} onChange={e => setMonth(e.target.value)}
                                        >
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {recurrence !== 'one-time' && (
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-1">Start Month</label>
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                            value={startMonth} onChange={e => setStartMonth(e.target.value)}
                                        >
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {recurrence !== 'one-time' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-neutral-400 mb-1">End Month (Optional)</label>
                                                <select
                                                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                                    value={endMonth || ''}
                                                    onChange={e => setEndMonth(e.target.value || undefined)}
                                                >
                                                    <option value="">No end date</option>
                                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isActive}
                                                        onChange={e => setIsActive(e.target.checked)}
                                                        className="w-4 h-4 rounded border-white/10 bg-black/20 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                                                    />
                                                    <span className="text-sm text-neutral-400">Active</span>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm text-neutral-400 mb-2">Amounts</label>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                        {accounts.map(acc => (
                                            <div key={acc.id} className="flex items-center gap-2">
                                                <span className="w-20 text-xs text-neutral-400 truncate">{acc.name}</span>
                                                <input
                                                    type="number" placeholder="0.00"
                                                    className="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-right text-sm"
                                                    value={amounts[acc.name] || ''}
                                                    onChange={e => handleAmountChange(acc.name, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-2 bg-white/5 rounded-lg text-neutral-300">Cancel</button>
                                    <button type="submit" className="flex-1 py-2 bg-emerald-500 text-white rounded-lg">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
