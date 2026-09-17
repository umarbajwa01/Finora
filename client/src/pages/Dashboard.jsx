import { useState } from "react";
import BalanceHeroCard from "../components/dashboard/BalanceHeroCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import InsightCard from "../components/dashboard/InsightCard";
import ChartCard from "../components/charts/ChartCard";
import SpendingTrendChart from "../components/charts/SpendingTrendChart";
import CategoryDonutChart from "../components/charts/CategoryDonutChart";
import AddTransactionDrawer from "../components/transactions/AddTransactionDrawer";
import LoadingState from "../components/common/LoadingState";
import { useSummary, useSpendingTrend, useCategoryBreakdown, useInsights } from "../hooks/useAnalytics";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [autoOpenCamera, setAutoOpenCamera] = useState(false);

  const { data: summaryRes, isLoading: summaryLoading } = useSummary();
  const { data: trendRes } = useSpendingTrend("30d");
  const { data: categoriesRes } = useCategoryBreakdown("30d", "expense");
  const { data: insightsRes } = useInsights();
  const { data: txRes, isLoading: txLoading, isError: txError, refetch } = useTransactions({ page: 1, limit: 5, sort: "newest" });

  const summary = summaryRes?.data;
  const currency = user?.currency || "USD";

  const handleQuickAction = (key) => {
    setEditingTx(null);
    setAutoOpenCamera(key === "scan");
    if (key === "expense" || key === "income" || key === "transfer" || key === "scan") {
      setAddOpen(true);
    }
  };

  if (summaryLoading) return <LoadingState fullScreen label="Loading your dashboard..." />;

  return (
    <div className="dashboard">
      <div className="dashboard__hero-row">
        <BalanceHeroCard
          balance={summary?.totalBalance}
          income={summary?.thisMonthIncome}
          expense={summary?.thisMonthExpense}
          changePercent={summary?.monthlyChangePercent}
          currency={currency}
        />
        <div className="dashboard__quick-wrap">
          <h3 className="font-display dashboard__section-title">Quick Actions</h3>
          <QuickActions onAction={handleQuickAction} />

          <h3 className="font-display dashboard__section-title" style={{ marginTop: 24 }}>Financial Insights</h3>
          <div className="dashboard__insights">
            {(insightsRes?.data || []).slice(0, 3).map((insight, i) => (
              <InsightCard key={i} type={insight.type} message={insight.message} index={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard__charts-row">
        <ChartCard title="Spending Trend" subtitle="Income vs. expenses over the last 30 days">
          <SpendingTrendChart data={trendRes?.data || []} />
        </ChartCard>
        <ChartCard title="Category Breakdown" subtitle="Where your money went this month">
          <CategoryDonutChart data={categoriesRes?.data || []} currency={currency} />
        </ChartCard>
      </div>

      <RecentTransactions
        transactions={txRes?.data?.items}
        isLoading={txLoading}
        isError={txError}
        onRetry={refetch}
        onEdit={(tx) => { setEditingTx(tx); setAddOpen(true); }}
        currency={currency}
      />

      <AddTransactionDrawer
        open={addOpen}
        onClose={() => { setAddOpen(false); setEditingTx(null); setAutoOpenCamera(false); }}
        transaction={editingTx}
        autoOpenCamera={autoOpenCamera}
      />
    </div>
  );
};

export default Dashboard;
