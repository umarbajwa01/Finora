import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatShortDate, formatCompactCurrency } from "../../utils/formatters";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__date">{formatShortDate(label)}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="chart-tooltip__row">
          <span className={`chart-tooltip__dot chart-tooltip__dot--${p.dataKey}`} />
          <span className="chart-tooltip__key">{p.dataKey === "income" ? "Income" : "Expense"}</span>
          <span className="chart-tooltip__val">{formatCompactCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const SpendingTrendChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height={260}>
    <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
      <defs>
        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-green)" stopOpacity={0.28} />
          <stop offset="100%" stopColor="var(--color-green)" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-red)" stopOpacity={0.24} />
          <stop offset="100%" stopColor="var(--color-red)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
      <XAxis
        dataKey="date"
        tickFormatter={formatShortDate}
        tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
        axisLine={false}
        tickLine={false}
        minTickGap={24}
      />
      <YAxis
        tickFormatter={(v) => formatCompactCurrency(v)}
        tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
        axisLine={false}
        tickLine={false}
        width={52}
      />
      <Tooltip content={<CustomTooltip />} />
      <Area
        type="monotone"
        dataKey="income"
        stroke="var(--color-green)"
        strokeWidth={2}
        fill="url(#incomeGradient)"
        animationDuration={700}
      />
      <Area
        type="monotone"
        dataKey="expense"
        stroke="var(--color-red)"
        strokeWidth={2}
        fill="url(#expenseGradient)"
        animationDuration={700}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default SpendingTrendChart;
