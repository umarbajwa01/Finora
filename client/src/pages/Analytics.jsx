import { useState } from "react";
import { TrendingUp, PiggyBank, Wallet } from "lucide-react";
import ChartCard from "../components/charts/ChartCard";
import SpendingTrendChart from "../components/charts/SpendingTrendChart";
import CategoryDonutChart from "../components/charts/CategoryDonutChart";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import InsightCard from "../components/dashboard/InsightCard";
import StatCard from "../components/common/StatCard";
import {
  useSummary,
  useSpendingTrend,
  useIncomeVsExpense,
  useCategoryBreakdown,
  useInsights,
} from "../hooks/useAnalytics";
import { useAuth } from "../context/AuthContext";
import { ANALYTICS_RANGES } from "../constants/categories";
import { formatCurrency } from "../utils/formatters";
import "./Analytics.css";

const MONTHS_BY_RANGE = { "7d": 3, "30d": 6, "3m": 6, "6m": 6, "1y": 12 };

const Analytics = () => {
  const { user } = useAuth();
  const [range, setRange] = useState("30d");
  const currency = user?.currency || "USD";

  const { data: summaryRes } = useSummary();
  const { data: trendRes } = useSpendingTrend(range);
  const { data: incomeExpenseRes } = useIncomeVsExpense(MONTHS_BY_RANGE[range]);
  const { data: categoriesRes } = useCategoryBreakdown(range, "expense");
  const { data: insightsRes } = useInsights();

  const summary = summaryRes?.data;
  const topCategories = (categoriesRes?.data || []).slice(0, 5);

  return (
    <div className="analytics-page">
      <div className="analytics-page__ranges">
        {ANALYTICS_RANGES.map((r) => (
          <button
            key={r.value}
            className={`analytics-page__range${range === r.value ? " is-active" : ""}`}
            onClick={() => setRange(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="analytics-page__stats">
        <StatCard label="Total Income" value={formatCurrency(summary?.totalIncome, currency)} icon={TrendingUp} tone="green" />
        <StatCard label="Total Expenses" value={formatCurrency(summary?.totalExpense, currency)} icon={Wallet} tone="red" />
        <StatCard label="Savings Rate" value={`${summary?.savingsRate ?? 0}%`} icon={PiggyBank} tone="gold" />
      </div>

      <ChartCard title="Spending Overview" subtitle="Daily income and expense flow for the selected period">
        <SpendingTrendChart data={trendRes?.data || []} />
      </ChartCard>

      <div className="analytics-page__grid">
        <ChartCard title="Income vs Expenses" subtitle="Monthly comparison">
          <IncomeExpenseChart data={incomeExpenseRes?.data || []} />
        </ChartCard>
        <ChartCard title="Category Breakdown" subtitle="Expense distribution for the selected period">
          <CategoryDonutChart data={categoriesRes?.data || []} currency={currency} />
        </ChartCard>
      </div>

      <ChartCard title="Top Spending Categories" subtitle="Ranked by total amount">
        <div className="analytics-page__top-cats">
          {topCategories.length === 0 && <p className="analytics-page__empty">No expenses recorded for this period.</p>}
          {topCategories.map((cat, i) => (
            <div key={cat.category} className="top-cat-row">
              <span className="top-cat-row__rank">{i + 1}</span>
              <span className="top-cat-row__name">{cat.category}</span>
              <div className="top-cat-row__bar">
                <div className="top-cat-row__fill" style={{ width: `${cat.percentage}%` }} />
              </div>
              <span className="top-cat-row__amount">{formatCurrency(cat.total, currency)}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Financial Insights" subtitle="Generated from your transaction history">
        <div className="analytics-page__insights">
          {(insightsRes?.data || []).map((insight, i) => (
            <InsightCard key={i} type={insight.type} message={insight.message} index={i} />
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default Analytics;
