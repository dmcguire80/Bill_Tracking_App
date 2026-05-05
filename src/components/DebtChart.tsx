import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { DebtAccount, ChartDataPoint } from '../types';
import { formatCurrency, getAccountTypeColor } from '../utils/calculations';

interface DebtChartProps {
  data: ChartDataPoint[];
  accounts: DebtAccount[];
}

export function DebtChart({ data, accounts }: DebtChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        No data to display
      </div>
    );
  }

  const formatXAxis = (dateStr: string) => {
    const [, month, day] = dateStr.split('-');
    return `${month}/${day}`;
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          stroke="var(--text-secondary)"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          stroke="var(--text-secondary)"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
          }}
          labelFormatter={(label: any) => formatTooltipDate(String(label))}
          formatter={(value: any) => [formatCurrency(Number(value)), '']}
        />
        <Legend
          wrapperStyle={{
            paddingTop: '20px',
            fontSize: '12px',
          }}
        />

        {/* Total line - prominent */}
        <Line
          type="monotone"
          dataKey="total"
          stroke="#ef4444"
          strokeWidth={3}
          dot={{ fill: '#ef4444', r: 4 }}
          activeDot={{ r: 6 }}
          name="Total Debt"
        />

        {/* Individual account lines - thinner */}
        {accounts.map((account) => (
          <Line
            key={account.id}
            type="monotone"
            dataKey={account.id}
            stroke={getAccountTypeColor(account.accountType)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name={account.name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
