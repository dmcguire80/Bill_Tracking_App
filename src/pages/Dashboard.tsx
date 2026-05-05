import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingDown, TrendingUp, DollarSign, Target } from 'lucide-react';
import { useData } from '../context/DataContext';
import { TimeFilterBar } from '../components/TimeFilterBar';
import { DebtChart } from '../components/DebtChart';
import {
  formatCurrency,
  formatDate,
  calculateDashboardSummary,
  generateChartData,
  getFilterDays,
  getAccountTypeLabel,
} from '../utils/calculations';

export function Dashboard() {
  const navigate = useNavigate();
  const { accounts, entries, loading } = useData();
  const [selectedFilter, setSelectedFilter] = useState('latest');

  const activeAccounts = useMemo(() => accounts.filter((a) => a.isActive), [accounts]);

  const days = useMemo(() => getFilterDays(selectedFilter), [selectedFilter]);

  const summary = useMemo(
    () => calculateDashboardSummary(activeAccounts, entries, days),
    [activeAccounts, entries, days]
  );

  const chartData = useMemo(
    () => generateChartData(entries, activeAccounts, days),
    [entries, activeAccounts, days]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-[var(--text-secondary)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const isDebtReduction = summary.change < 0;

  return (
    <div className="animate-fadeIn">
      {/* Total Debt Card */}
      <div
        className={`${
          summary.totalDebt === 0
            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
            : 'bg-gradient-to-br from-red-500 to-rose-600'
        } text-white p-8 rounded-xl shadow-lg mb-8 text-center`}
      >
        <p className="text-lg opacity-90 mb-2">
          {summary.totalDebt === 0 ? 'Goal Achieved! 🎉' : 'Total Debt'}
        </p>
        <p className="text-5xl font-bold mb-4">{formatCurrency(summary.totalDebt)}</p>

        {summary.change !== 0 && (
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isDebtReduction ? 'bg-green-600/30' : 'bg-red-600/30'
            }`}
          >
            {isDebtReduction ? (
              <TrendingDown className="w-5 h-5" />
            ) : (
              <TrendingUp className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {isDebtReduction ? '' : '+'}
              {formatCurrency(Math.abs(summary.change))}
            </span>
            <span className="opacity-80">
              ({isDebtReduction ? '' : '+'}
              {summary.changePercent.toFixed(1)}%)
            </span>
          </div>
        )}

        {summary.lastUpdated && (
          <p className="text-sm opacity-75 mt-4">
            Last updated {formatDate(summary.lastUpdated)}
          </p>
        )}
      </div>

      {/* Time Filter */}
      <TimeFilterBar selected={selectedFilter} onSelect={setSelectedFilter} />

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Debt Over Time</h2>
          <DebtChart data={chartData} accounts={activeAccounts} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate('/data-entry')}
          className="btn btn-primary flex items-center justify-center gap-2 py-4"
        >
          <DollarSign className="w-5 h-5" />
          Update Balances
        </button>
        <button
          onClick={() => navigate('/manage-accounts')}
          className="btn btn-secondary flex items-center justify-center gap-2 py-4"
        >
          <Target className="w-5 h-5" />
          Manage Accounts
        </button>
        <button
          onClick={() => navigate('/history')}
          className="btn btn-secondary flex items-center justify-center gap-2 py-4"
        >
          View History
        </button>
      </div>

      {/* Account List */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Debt Accounts ({activeAccounts.length})</h2>

        {activeAccounts.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto text-[var(--text-secondary)] mb-4" />
            <p className="text-[var(--text-secondary)] mb-4">No debt accounts yet</p>
            <button onClick={() => navigate('/manage-accounts')} className="btn btn-primary">
              Add Your First Account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAccounts.map((account) => {
              // Get latest balance
              const accountEntries = entries
                .filter((e) => e.accountId === account.id)
                .sort((a, b) => b.entryDate.getTime() - a.entryDate.getTime());

              const latestBalance = accountEntries[0]?.value || 0;
              const previousBalance = accountEntries[1]?.value || latestBalance;
              const change = latestBalance - previousBalance;

              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                  onClick={() => navigate(`/account/${account.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{account.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                        {getAccountTypeLabel(account.accountType)}
                      </span>
                    </div>
                    {account.creditLimit && (
                      <p className="text-sm text-[var(--text-secondary)]">
                        Limit: {formatCurrency(account.creditLimit)}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">{formatCurrency(latestBalance)}</p>
                    {change !== 0 && accountEntries.length > 1 && (
                      <p
                        className={`text-sm ${
                          change < 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {change < 0 ? '↓' : '↑'} {formatCurrency(Math.abs(change))}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
