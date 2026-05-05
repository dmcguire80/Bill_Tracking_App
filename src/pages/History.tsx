import { useState, useMemo } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate, formatDateInput } from '../utils/calculations';
import type { BalanceEntry } from '../types';

export function History() {
  const { accounts, entries, updateEntry, deleteEntry } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ value: string; note: string; date: string }>({
    value: '',
    note: '',
    date: '',
  });

  // Group entries by date
  const entriesByDate = useMemo(() => {
    const grouped = new Map<string, BalanceEntry[]>();

    for (const entry of entries) {
      const dateStr = formatDateInput(entry.entryDate);
      if (!grouped.has(dateStr)) {
        grouped.set(dateStr, []);
      }
      grouped.get(dateStr)!.push(entry);
    }

    // Sort dates descending
    return Array.from(grouped.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [entries]);

  const handleEdit = (entry: BalanceEntry) => {
    setEditingId(entry.id);
    setEditValues({
      value: entry.value.toString(),
      note: entry.note || '',
      date: formatDateInput(entry.entryDate),
    });
  };

  const handleSave = async (entryId: string) => {
    try {
      await updateEntry(entryId, {
        value: parseFloat(editValues.value),
        note: editValues.note || undefined,
        entryDate: new Date(editValues.date),
      });
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update entry');
    }
  };

  const handleDelete = async (entryId: string, accountName: string) => {
    if (!confirm(`Delete entry for ${accountName}?`)) return;

    try {
      await deleteEntry(entryId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete entry');
    }
  };

  const getAccountName = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.name || 'Unknown';
  };

  if (entries.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-[var(--text-secondary)] mb-4">No balance history yet</p>
        <a href="/data-entry" className="btn btn-primary">
          Add Your First Entry
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Balance History</h1>

        <div className="space-y-6">
          {entriesByDate.map(([dateStr, dateEntries]) => {
            const totalForDate = dateEntries.reduce((sum, e) => sum + e.value, 0);

            return (
              <div key={dateStr} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <h3 className="font-semibold">{formatDate(new Date(dateStr))}</h3>
                  <span className="font-bold text-lg">{formatCurrency(totalForDate)}</span>
                </div>

                <div className="space-y-2">
                  {dateEntries.map((entry) => {
                    const isEditing = editingId === entry.id;

                    return (
                      <div
                        key={entry.id}
                        className="p-4 bg-[var(--bg-secondary)] rounded-lg"
                      >
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm mb-1">Account</label>
                                <input
                                  type="text"
                                  value={getAccountName(entry.accountId)}
                                  disabled
                                  className="input w-full opacity-60"
                                />
                              </div>
                              <div>
                                <label className="block text-sm mb-1">Balance</label>
                                <input
                                  type="number"
                                  value={editValues.value}
                                  onChange={(e) =>
                                    setEditValues({ ...editValues, value: e.target.value })
                                  }
                                  className="input w-full"
                                  step="0.01"
                                />
                              </div>
                              <div>
                                <label className="block text-sm mb-1">Date</label>
                                <input
                                  type="date"
                                  value={editValues.date}
                                  onChange={(e) =>
                                    setEditValues({ ...editValues, date: e.target.value })
                                  }
                                  className="input w-full"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Note</label>
                              <input
                                type="text"
                                value={editValues.note}
                                onChange={(e) =>
                                  setEditValues({ ...editValues, note: e.target.value })
                                }
                                placeholder="Optional note"
                                className="input w-full"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSave(entry.id)}
                                className="btn btn-primary btn-sm flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="btn btn-secondary btn-sm flex items-center gap-1"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold">
                                {getAccountName(entry.accountId)}
                              </div>
                              {entry.note && (
                                <div className="text-sm text-[var(--text-secondary)] mt-1">
                                  {entry.note}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold">{formatCurrency(entry.value)}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(entry)}
                                  className="btn-icon"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(entry.id, getAccountName(entry.accountId))
                                  }
                                  className="btn-icon text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
