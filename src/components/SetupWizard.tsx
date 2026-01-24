import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Sparkles, Wallet, Calendar, FileText, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import type { Account, BillTemplate, PaydayTemplate, RecurrenceType } from '../types';
import { generateEntries } from '../utils/generator';

interface SetupWizardProps {
    onComplete: () => void;
}

export const SetupWizard = ({ onComplete }: SetupWizardProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    // State
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [paydayTemplates, setPaydayTemplates] = useState<PaydayTemplate[]>([]);
    const [billTemplates, setBillTemplates] = useState<BillTemplate[]>([]);

    // Form Inputs
    const [newAccount, setNewAccount] = useState('');

    // Payday Form Defaults
    const [pdName, setPdName] = useState('Payday');
    const [pdRecurrence, setPdRecurrence] = useState<RecurrenceType>('bi-weekly');
    const [pdDay, setPdDay] = useState(1); // For bi-weekly, this is start day. For monthly, day of month.

    // Bill Form Defaults
    const [billName, setBillName] = useState('');
    const [billAmount, setBillAmount] = useState('');
    const [billDay, setBillDay] = useState(1);
    const [billAccountId, setBillAccountId] = useState('');

    const steps = [
        { id: 'welcome', title: 'Welcome', icon: Sparkles },
        { id: 'accounts', title: 'Accounts', icon: Wallet },
        { id: 'paydays', title: 'Paydays', icon: Calendar },
        { id: 'bills', title: 'Bills', icon: FileText },
        { id: 'complete', title: 'Complete', icon: CheckCircle2 },
    ];

    // --- Actions ---

    const handleAddAccount = () => {
        if (newAccount.trim()) {
            const account: Account = {
                id: crypto.randomUUID(),
                name: newAccount.trim(),
                order: accounts.length
            };
            setAccounts([...accounts, account]);
            setNewAccount('');

            // Set default account for bills if this is the first one
            if (accounts.length === 0) {
                setBillAccountId(account.id);
            }
        }
    };

    const handleRemoveAccount = (id: string) => {
        setAccounts(accounts.filter(a => a.id !== id));
        if (billAccountId === id) {
            setBillAccountId(accounts.length > 1 ? accounts.find(a => a.id !== id)?.id || '' : '');
        }
    };

    const handleAddPayday = () => {
        const template: PaydayTemplate = {
            id: crypto.randomUUID(),
            name: pdName,
            recurrence: pdRecurrence,
            day: pdDay,
            balances: {}, // Not setting initial balances in wizard to keep it simple
            autoGenerate: true,
            isActive: true
        };
        setPaydayTemplates([...paydayTemplates, template]);
        setPdName('Payday'); // Reset name
    };

    const handleRemovePayday = (id: string) => {
        setPaydayTemplates(paydayTemplates.filter(t => t.id !== id));
    };

    const handleAddBill = () => {
        if (!billName || !billAmount || !billAccountId) return;

        const template: BillTemplate = {
            id: crypto.randomUUID(),
            name: billName,
            recurrence: 'monthly',
            day: billDay,
            amounts: { [billAccountId]: parseFloat(billAmount) },
            autoGenerate: true,
            isActive: true
        };
        setBillTemplates([...billTemplates, template]);

        // Reset form
        setBillName('');
        setBillAmount('');
        // Keep account and day as they are likely similar for next bill
    };

    const handleRemoveBill = (id: string) => {
        setBillTemplates(billTemplates.filter(t => t.id !== id));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinish();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = () => {
        // 1. Generate Entries for current year
        const year = new Date().getFullYear();
        const entries = generateEntries(billTemplates, paydayTemplates, year);

        // 2. Save Everything
        localStorage.setItem('accounts', JSON.stringify(accounts));
        localStorage.setItem('templates', JSON.stringify(billTemplates));
        localStorage.setItem('paydayTemplates', JSON.stringify(paydayTemplates));
        localStorage.setItem('entries', JSON.stringify(entries));
        localStorage.setItem('setupComplete', 'true');

        onComplete();
    };

    const canProceed = () => {
        if (currentStep === 1) return accounts.length > 0;
        return true;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === currentStep;
                            const isComplete = index < currentStep;

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isComplete
                                                ? 'bg-emerald-500 text-white'
                                                : isActive
                                                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                                                    : 'bg-white/10 text-neutral-400'
                                                }`}
                                        >
                                            {isComplete ? <Check size={24} /> : <Icon size={24} />}
                                        </div>
                                        <span className={`text-sm mt-2 hidden sm:block ${isActive ? 'text-white font-medium' : 'text-neutral-400'}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`h-1 flex-1 mx-2 rounded transition-all ${isComplete ? 'bg-emerald-500' : 'bg-white/10'
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 shadow-2xl min-h-[500px] flex flex-col">
                    <div className="flex-1">
                        {/* Step 0: Welcome */}
                        {currentStep === 0 && (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                    <Sparkles className="text-emerald-400" size={40} />
                                </div>
                                <h1 className="text-4xl font-bold text-white">Welcome to Bill Tracker!</h1>
                                <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                                    Let's get you set up. We'll add your accounts, set a pay schedule, and add your bills.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                    <div className="bg-white/5 p-6 rounded-xl">
                                        <Wallet className="text-emerald-400 mb-3" size={32} />
                                        <h3 className="text-white font-semibold mb-2">Track Accounts</h3>
                                        <p className="text-sm text-neutral-400">Manage multiple payment sources</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-xl">
                                        <Calendar className="text-emerald-400 mb-3" size={32} />
                                        <h3 className="text-white font-semibold mb-2">Payday Schedule</h3>
                                        <p className="text-sm text-neutral-400">Automate recurring deposits</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-xl">
                                        <FileText className="text-emerald-400 mb-3" size={32} />
                                        <h3 className="text-white font-semibold mb-2">Smart Bills</h3>
                                        <p className="text-sm text-neutral-400">Never miss a payment again</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Accounts */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Add Payment Accounts</h2>
                                    <p className="text-neutral-400">
                                        Where does your money live? Add checking, savings, or credit card accounts.
                                    </p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-xl">
                                    <div className="flex gap-3 mb-6">
                                        <input
                                            type="text"
                                            value={newAccount}
                                            onChange={(e) => setNewAccount(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddAccount()}
                                            placeholder="e.g., Chase Checking"
                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                                        />
                                        <button
                                            onClick={handleAddAccount}
                                            disabled={!newAccount.trim()}
                                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <Plus size={20} /> Add
                                        </button>
                                    </div>

                                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                        {accounts.length === 0 ? (
                                            <div className="text-center py-8 text-neutral-500">
                                                <Wallet size={48} className="mx-auto mb-3 opacity-50" />
                                                <p>No accounts yet.</p>
                                            </div>
                                        ) : (
                                            accounts.map((account) => (
                                                <div key={account.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                                                            {account.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-white font-medium">{account.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveAccount(account.id)}
                                                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Paydays */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Payday Schedule</h2>
                                    <p className="text-neutral-400">
                                        When do you get paid? We'll project your balance automatically.
                                    </p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-xl">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                                        <div className="md:col-span-2">
                                            <label className="text-xs text-neutral-400 mb-1 block">Name</label>
                                            <input
                                                type="text"
                                                value={pdName}
                                                onChange={(e) => setPdName(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                                placeholder="e.g. Work Paycheck"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-400 mb-1 block">Frequency</label>
                                            <select
                                                value={pdRecurrence}
                                                onChange={(e) => setPdRecurrence(e.target.value as RecurrenceType)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                            >
                                                <option value="weekly">Weekly</option>
                                                <option value="bi-weekly">Bi-Weekly</option>
                                                <option value="semi-monthly">Semi-Monthly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-400 mb-1 block">Start Day</label>
                                            <input
                                                type="number"
                                                min="1" max="31"
                                                value={pdDay}
                                                onChange={(e) => setPdDay(parseInt(e.target.value))}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddPayday}
                                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2 mb-6"
                                    >
                                        <Plus size={18} /> Add Pay Schedule
                                    </button>

                                    <div className="space-y-2">
                                        {paydayTemplates.map((pd) => (
                                            <div key={pd.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="text-emerald-500" size={20} />
                                                    <div>
                                                        <div className="text-white font-medium">{pd.name}</div>
                                                        <div className="text-xs text-neutral-400">{pd.recurrence} • Day {pd.day}</div>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleRemovePayday(pd.id)} className="text-neutral-400 hover:text-red-400"><Trash2 size={18} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Bills */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Recurring Bills</h2>
                                    <p className="text-neutral-400">
                                        Add your regular monthly bills (Rent, Netflix, Insurance).
                                    </p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-xl">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
                                        <div className="md:col-span-4">
                                            <input
                                                type="text"
                                                placeholder="Bill Name"
                                                value={billName}
                                                onChange={(e) => setBillName(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                value={billAmount}
                                                onChange={(e) => setBillAmount(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <select
                                                value={billAccountId}
                                                onChange={(e) => setBillAccountId(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                            >
                                                <option value="">Select Account</option>
                                                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <input
                                                type="number"
                                                placeholder="Day"
                                                min="1" max="31"
                                                value={billDay}
                                                onChange={(e) => setBillDay(parseInt(e.target.value))}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddBill}
                                        disabled={!billName || !billAmount || !billAccountId}
                                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2 mb-6 disabled:opacity-50"
                                    >
                                        <Plus size={18} /> Add Bill
                                    </button>

                                    <div className="space-y-2 max-h-[250px] overflow-y-auto">
                                        {billTemplates.map((bill) => {
                                            const accountName = accounts.find(a => bill.amounts[a.id] !== undefined)?.name || 'Unknown';
                                            const amount = Object.values(bill.amounts)[0];
                                            return (
                                                <div key={bill.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="text-emerald-500" size={20} />
                                                        <div>
                                                            <div className="text-white font-medium">{bill.name}</div>
                                                            <div className="text-xs text-neutral-400">
                                                                ${amount} • {accountName} • Day {bill.day}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleRemoveBill(bill.id)} className="text-neutral-400 hover:text-red-400"><Trash2 size={18} /></button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Complete */}
                        {currentStep === 4 && (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="text-emerald-400" size={40} />
                                </div>
                                <h1 className="text-4xl font-bold text-white">All Set!</h1>
                                <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                                    We've set up your dashboard with:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <div className="text-3xl font-bold text-emerald-400 mb-1">{accounts.length}</div>
                                        <div className="text-neutral-400">Accounts</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <div className="text-3xl font-bold text-emerald-400 mb-1">{paydayTemplates.length}</div>
                                        <div className="text-neutral-400">Pay Schedules</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <div className="text-3xl font-bold text-emerald-400 mb-1">{billTemplates.length}</div>
                                        <div className="text-neutral-400">Recurring Bills</div>
                                    </div>
                                </div>

                                <p className="text-neutral-400 pt-4">
                                    Click below to generate your initial calendar and enter your dashboard.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="px-6 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors disabled:opacity-0 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <ChevronLeft size={20} />
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {currentStep === steps.length - 1 ? 'Start Tracking' : 'Next'}
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
