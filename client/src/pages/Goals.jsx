import { useState } from "react";
import { Plus, Target } from "lucide-react";
import GoalCard from "../components/goals/GoalCard";
import AddGoalModal from "../components/goals/AddGoalModal";
import ContributeModal from "../components/goals/ContributeModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Button from "../components/common/Button";
import { useGoals, useDeleteGoal } from "../hooks/useGoals";
import { useAuth } from "../context/AuthContext";
import "./Goals.css";

const Goals = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useGoals();
  const deleteMutation = useDeleteGoal();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [contributingGoal, setContributingGoal] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const goals = data?.data || [];

  const confirmDelete = async () => {
    await deleteMutation.mutateAsync(pendingDelete._id);
    setPendingDelete(null);
  };

  return (
    <div>
      <div className="goals-page__toolbar">
        <p className="goals-page__hint">Set targets for what matters and track your progress toward them.</p>
        <Button icon={Plus} onClick={() => { setEditingGoal(null); setModalOpen(true); }}>New Goal</Button>
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message="We couldn't load your goals." onRetry={refetch} />}

      {!isLoading && !isError && goals.length === 0 && (
        <EmptyState
          icon={Target}
          title="No goals yet"
          message="Create a financial goal — an emergency fund, a trip, a big purchase — and watch your progress grow."
          action={<Button size="sm" onClick={() => setModalOpen(true)}>Create a goal</Button>}
        />
      )}

      {goals.length > 0 && (
        <div className="goals-page__grid">
          {goals.map((g) => (
            <GoalCard
              key={g._id}
              goal={g}
              currency={user?.currency}
              onEdit={(goal) => { setEditingGoal(goal); setModalOpen(true); }}
              onDelete={setPendingDelete}
              onContribute={setContributingGoal}
            />
          ))}
        </div>
      )}

      <AddGoalModal open={modalOpen} onClose={() => setModalOpen(false)} goal={editingGoal} />
      <ContributeModal open={Boolean(contributingGoal)} onClose={() => setContributingGoal(null)} goal={contributingGoal} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Delete goal?"
        message={`This will remove "${pendingDelete?.name}" and its progress. This can't be undone.`}
      />
    </div>
  );
};

export default Goals;
