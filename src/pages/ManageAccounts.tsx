import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getAccountTypeLabel, formatCurrency } from '../utils/calculations';
import type { DebtAccount, DebtAccountType } from '../types';

const ACCOUNT_TYPES: { value: DebtAccountType; label: string }[] = [
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'AUTO_LOAN', label: 'Auto Loan' },
  { value: 'MORTGAGE', label: 'Mortgage' },
  { value: 'STUDENT_LOAN', label: 'Student Loan' },
  { value: 'PERSONAL_LOAN', label: 'Personal Loan' },
  { value: 'MEDICAL', label: 'Medical' },
  { value: 'OTHER', label: 'Other' },
];

export function ManageAccounts() {
  const { accounts, addAccount, updateAccount, deleteAccount, toggleAccountActive } = useData();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    accountType: 'CREDIT_CARD' as DebtAccountType,
    creditLimit: '',
    interestRate: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      accountType: 'CREDIT_CARD',
      creditLimit: '',
      interestRate: '',
    });
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  const handleEdit = (account: DebtAccount) => {
    setFormData({
      name: account.name,
      accountType: account.accountType,
      creditLimit: account.creditLimit?.toString() || '',
      interestRate: account.interestRate?.toString() || '',
    });
    setEditingId(account.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Account name is required');
      return;
    }

    try {
      setSaving(true);

      const creditLimit = formData.creditLimit ? parseFloat(formData.creditLimit) : undefined;
      const interestRate = formData.interestRate ? parseFloat(formData.interestRate) : undefined;

      if (editingId) {
        await updateAccount(editingId, {
          name: formData.name.trim(),
          accountType: formData.accountType,
          creditLimit,
          interestRate,
        });
      } else {
        await addAccount(formData.name.trim(), formData.accountType, creditLimit, interestRate);
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save account');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will also delete all balance entries for this account.`)) {
      return;
    }

    try {
      await deleteAccount(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Debt Accounts</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Account
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-[var(--bg-secondary)] rounded-lg">
            <h3 className="font-semibold text-lg mb-4">
              {editingId ? 'Edit Account' : 'New Account'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chase Freedom"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.accountType}
                  onChange={(e) =>
                    setFormData({ ...formData, accountType: e.target.value as DebtAccountType })
                  }
                  className="input w-full"
                >
                  {ACCOUNT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Credit Limit (optional)
                </label>
                <input
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                  placeholder="e.g., 5000"
                  min="0"
                  step="0.01"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Interest Rate % (optional)
                </label>
                <input
                  type="number"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  placeholder="e.g., 18.99"
                  min="0"
                  max="100"
                  step="0.01"
                  className="input w-full"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="spinner-small"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {editingId ? 'Update' : 'Add'} Account
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Accounts List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg mb-3">Your Accounts ({accounts.length})</h3>

          {accounts.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              <p className="mb-4">No accounts yet</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                Add Your First Account
              </button>
            </div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  account.isActive
                    ? 'bg-[var(--bg-secondary)] border-transparent'
                    : 'bg-[var(--bg-secondary)] border-dashed border-[var(--border)] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{account.name}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                        {getAccountTypeLabel(account.accountType)}
                      </span>
                      {!account.isActive && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-500 text-white">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-[var(--text-secondary)] space-y-1">
                      {account.creditLimit && (
                        <div>Credit Limit: {formatCurrency(account.creditLimit)}</div>
                      )}
                      {account.interestRate && (
                        <div>Interest Rate: {account.interestRate}%</div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className="btn-icon"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleAccountActive(account.id)}
                      className="btn-icon"
                      title={account.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {account.isActive ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button
                      onClick={() => handleDelete(account.id, account.name)}
                      className="btn-icon text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
