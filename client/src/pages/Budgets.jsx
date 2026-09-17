import { useState } from "react";
import { Plus, Wallet } from "lucide-react";
import BudgetCard from "../components/budgets/BudgetCard";
import AddBudgetModal from "../components/budgets/AddBudgetModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Button from "../components/common/Button";
import { useBudgets, useDeleteBudget } from "../hooks/useBudgets";
import { useAuth } from "../context/AuthContext";
import "./Budgets.css";

const Budgets = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useBudgets();
  const deleteMutation = useDeleteBudget();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const budgets = data?.data || [];

  const confirmDelete = async () => {
    await deleteMutation.mutateAsync(pendingDelete._id);
    setPendingDelete(null);
  };

  return (
    <div>
      <div className="budgets-page__toolbar">
        <p className="budgets-page__hint">Set spending limits per category and track them in real time.</p>
        <Button icon={Plus} onClick={() => { setEditingBudget(null); setModalOpen(true); }}>New Budget</Button>
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message="We couldn't load your budgets." onRetry={refetch} />}

      {!isLoading && !isError && budgets.length === 0 && (
        <EmptyState
          icon={Wallet}
          title="No budgets yet"
          message="Create your first budget to start tracking spending limits by category."
          action={<Button size="sm" onClick={() => setModalOpen(true)}>Create a budget</Button>}
        />
      )}

      {budgets.length > 0 && (
        <div className="budgets-page__grid">
          {budgets.map((b) => (
            <BudgetCard
              key={b._id}
              budget={b}
              currency={user?.currency}
              onEdit={(budget) => { setEditingBudget(budget); setModalOpen(true); }}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      <AddBudgetModal open={modalOpen} onClose={() => setModalOpen(false)} budget={editingBudget} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Delete budget?"
        message={`This will remove your ${pendingDelete?.category} budget. This can't be undone.`}
      />
    </div>
  );
};

export default Budgets;
