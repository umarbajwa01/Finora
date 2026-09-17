import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatMonthLabel, formatCompactCurrency } from "../../utils/formatters";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__date">{formatMonthLabel(label)}</div>
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

const IncomeExpenseChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barGap={6}>
      <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
      <XAxis
        dataKey="month"
        tickFormatter={formatMonthLabel}
        tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tickFormatter={(v) => formatCompactCurrency(v)}
        tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
        axisLine={false}
        tickLine={false}
        width={52}
      />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-surface-sunken)" }} />
      <Legend
        formatter={(value) => <span style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{value === "income" ? "Income" : "Expense"}</span>}
        iconType="circle"
        iconSize={8}
      />
      <Bar dataKey="income" fill="var(--color-green)" radius={[6, 6, 0, 0]} maxBarSize={28} animationDuration={700} />
      <Bar dataKey="expense" fill="var(--color-red)" radius={[6, 6, 0, 0]} maxBarSize={28} animationDuration={700} />
    </BarChart>
  </ResponsiveContainer>
);

export default IncomeExpenseChart;
