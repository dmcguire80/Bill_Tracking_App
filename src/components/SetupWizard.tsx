import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Sparkles, Wallet, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface SetupWizardProps {
    onComplete: () => void;
}

export const SetupWizard = ({ onComplete }: SetupWizardProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [newAccount, setNewAccount] = useState('');

    const steps = [
        { id: 'welcome', title: 'Welcome', icon: Sparkles },
        { id: 'accounts', title: 'Accounts', icon: Wallet },
        { id: 'paydays', title: 'Paydays', icon: Calendar },
        { id: 'bills', title: 'Bills', icon: FileText },
        { id: 'complete', title: 'Complete', icon: CheckCircle2 },
    ];

    const handleAddAccount = () => {
        if (newAccount.trim() && !accounts.includes(newAccount.trim())) {
            setAccounts([...accounts, newAccount.trim()]);
            setNewAccount('');
        }
    };

    const handleRemoveAccount = (account: string) => {
        setAccounts(accounts.filter(a => a !== account));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Save accounts to localStorage
            const accountObjects = accounts.map((name, index) => ({
                id: crypto.randomUUID(),
                name,
                order: index
            }));
            localStorage.setItem('accounts', JSON.stringify(accountObjects));
            localStorage.setItem('setupComplete', 'true');
            onComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        if (currentStep === 1) return accounts.length > 0; // Accounts step requires at least 1
        return true; // Other steps are optional
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
                                        <span
                                            className={`text-sm mt-2 ${isActive ? 'text-white font-medium' : 'text-neutral-400'
                                                }`}
                                        >
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
                <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Step 0: Welcome */}
                    {currentStep === 0 && (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                <Sparkles className="text-emerald-400" size={40} />
                            </div>
                            <h1 className="text-4xl font-bold text-white">Welcome to Bill Tracker!</h1>
                            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                                Let's get you set up in just a few steps. We'll help you create your payment accounts,
                                set up payday schedules, and add your bills.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                <div className="bg-white/5 p-6 rounded-xl">
                                    <Wallet className="text-emerald-400 mb-3" size={32} />
                                    <h3 className="text-white font-semibold mb-2">Track Accounts</h3>
                                    <p className="text-sm text-neutral-400">
                                        Manage multiple payment sources and track balances
                                    </p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl">
                                    <Calendar className="text-emerald-400 mb-3" size={32} />
                                    <h3 className="text-white font-semibold mb-2">Automate Entries</h3>
                                    <p className="text-sm text-neutral-400">
                                        Set up recurring bills and payday schedules
                                    </p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl">
                                    <FileText className="text-emerald-400 mb-3" size={32} />
                                    <h3 className="text-white font-semibold mb-2">Stay Organized</h3>
                                    <p className="text-sm text-neutral-400">
                                        Never miss a payment with visual tracking
                                    </p>
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
                                    Add at least one account to track your finances. You can add more later.
                                </p>
                            </div>

                            <div className="bg-white/5 p-6 rounded-xl">
                                <div className="flex gap-3 mb-4">
                                    <input
                                        type="text"
                                        value={newAccount}
                                        onChange={(e) => setNewAccount(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddAccount()}
                                        placeholder="e.g., Checking, Savings, Credit Card"
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                                    />
                                    <button
                                        onClick={handleAddAccount}
                                        disabled={!newAccount.trim()}
                                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add
                                    </button>
                                </div>

                                {accounts.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-500">
                                        <Wallet size={48} className="mx-auto mb-3 opacity-50" />
                                        <p>No accounts yet. Add your first account above.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {accounts.map((account, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-black/20 p-3 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/20">
                                                        {account.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-white font-medium">{account}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveAccount(account)}
                                                    className="text-neutral-400 hover:text-red-400 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <p className="text-sm text-blue-300">
                                    <strong>Tip:</strong> Common accounts include Checking, Savings, Credit Cards, and Cash.
                                    You can always add, remove, or rename accounts later in Settings.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Paydays (Optional) */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Set Up Payday Schedules</h2>
                                <p className="text-neutral-400">
                                    This step is optional. You can set up payday templates later in Settings.
                                </p>
                            </div>

                            <div className="bg-white/5 p-8 rounded-xl text-center">
                                <Calendar className="text-emerald-400 mx-auto mb-4" size={64} />
                                <h3 className="text-xl font-semibold text-white mb-3">Skip for Now</h3>
                                <p className="text-neutral-400 mb-6">
                                    You can create payday templates anytime from the Settings menu. Templates help
                                    automate recurring deposits.
                                </p>
                                <p className="text-sm text-neutral-500">
                                    Click "Next" to continue, or set up paydays later in Settings → Manage Paydays
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Bills (Optional) */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Add Bill Templates</h2>
                                <p className="text-neutral-400">
                                    This step is optional. You can create bill templates later in Settings.
                                </p>
                            </div>

                            <div className="bg-white/5 p-8 rounded-xl text-center">
                                <FileText className="text-emerald-400 mx-auto mb-4" size={64} />
                                <h3 className="text-xl font-semibold text-white mb-3">Skip for Now</h3>
                                <p className="text-neutral-400 mb-6">
                                    You can create bill templates anytime from the Settings menu. Templates automatically
                                    generate recurring bill entries.
                                </p>
                                <p className="text-sm text-neutral-500">
                                    Click "Next" to continue, or set up bills later in Settings → Manage Bills
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Complete */}
                    {currentStep === 4 && (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="text-emerald-400" size={40} />
                            </div>
                            <h1 className="text-4xl font-bold text-white">You're All Set!</h1>
                            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                                Your Bill Tracker is ready to use. You've added {accounts.length} account
                                {accounts.length !== 1 ? 's' : ''}.
                            </p>

                            <div className="bg-white/5 p-6 rounded-xl max-w-md mx-auto">
                                <h3 className="text-white font-semibold mb-4">What's Next?</h3>
                                <ul className="text-left space-y-3 text-neutral-300">
                                    <li className="flex items-start gap-3">
                                        <Check className="text-emerald-400 mt-0.5 flex-shrink-0" size={20} />
                                        <span>Add one-time payments or deposits from the Dashboard</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-emerald-400 mt-0.5 flex-shrink-0" size={20} />
                                        <span>Create bill and payday templates in Settings</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-emerald-400 mt-0.5 flex-shrink-0" size={20} />
                                        <span>View analytics and insights in the Analytics tab</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

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
