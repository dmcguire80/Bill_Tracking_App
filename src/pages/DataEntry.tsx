import { useState, useMemo } from 'react';
import { Save, Calendar, DollarSign } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatDateInput, formatCurrency, getAccountTypeLabel } from '../utils/calculations';

export function DataEntry() {
  const { entries, addEntries, getActiveAccounts } = useData();
  const activeAccounts = useMemo(() => getActiveAccounts(), [getActiveAccounts]);

  const [entryDate, setEntryDate] = useState(formatDateInput(new Date()));
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Get last known value for each account
  const lastValues = useMemo(() => {
    const latest: Record<string, number> = {};
    for (const account of activeAccounts) {
      const accountEntries = entries.filter((e) => e.accountId === account.id);
      if (accountEntries.length > 0) {
        const sorted = [...accountEntries].sort(
          (a, b) => b.entryDate.getTime() - a.entryDate.getTime()
        );
        latest[account.id] = sorted[0].value;
      }
    }
    return latest;
  }, [activeAccounts, entries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const entriesToAdd = activeAccounts
      .filter((account) => values[account.id]?.trim())
      .map((account) => ({
        accountId: account.id,
        value: parseFloat(values[account.id]),
        date: new Date(entryDate),
        note: notes[account.id]?.trim() || undefined,
      }));

    if (entriesToAdd.length === 0) {
      setError('Please enter at least one balance');
      return;
    }

    // Validate all values are positive numbers
    for (const entry of entriesToAdd) {
      if (isNaN(entry.value) || entry.value < 0) {
        setError('Please enter valid positive numbers');
        return;
      }
    }

    try {
      setSaving(true);
      await addEntries(entriesToAdd);
      setSuccess(true);
      setValues({});
      setNotes({});
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entries');
    } finally {
      setSaving(false);
    }
  };

  const handleValueChange = (accountId: string, value: string) => {
    // Allow only numbers and decimal point
    const sanitized = value.replace(/[^\d.]/g, '');
    setValues((prev) => ({ ...prev, [accountId]: sanitized }));
  };

  if (activeAccounts.length === 0) {
    return (
      <div className="card p-8 text-center">
        <DollarSign className="w-16 h-16 mx-auto text-[var(--text-secondary)] mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Debt Accounts</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Add your debt accounts first to start tracking balances
        </p>
        <a href="/manage-accounts" className="btn btn-primary">
          Manage Accounts
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Update Debt Balances</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Entry Date
            </label>
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              max={formatDateInput(new Date())}
              className="input w-full md:w-auto"
              required
            />
          </div>

          {/* Account Entries */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Current Balances</h3>

            {activeAccounts.map((account) => {
              const lastValue = lastValues[account.id];
              const currentValue = values[account.id] ? parseFloat(values[account.id]) : null;
              const hasChange = currentValue !== null && lastValue !== undefined;
              const change = hasChange ? currentValue! - lastValue : 0;

              return (
                <div key={account.id} className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{account.name}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                        {getAccountTypeLabel(account.accountType)}
                      </span>
                      {lastValue !== undefined && (
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                          Last: {formatCurrency(lastValue)}
                        </p>
                      )}
                    </div>

                    {hasChange && change !== 0 && (
                      <div
                        className={`text-sm font-semibold ${
                          change < 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {change < 0 ? '↓' : '↑'} {formatCurrency(Math.abs(change))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Current Balance</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                          $
                        </span>
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="0.00"
                          value={values[account.id] || ''}
                          onChange={(e) => handleValueChange(account.id, e.target.value)}
                          className="input w-full pl-7"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Note (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., Made extra payment"
                        value={notes[account.id] || ''}
                        onChange={(e) =>
                          setNotes((prev) => ({ ...prev, [account.id]: e.target.value }))
                        }
                        className="input w-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
              ✓ Balances saved successfully!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full md:w-auto flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="spinner-small"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Balances
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
