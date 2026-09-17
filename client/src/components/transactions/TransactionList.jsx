import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Receipt } from "lucide-react";
import TransactionItem from "./TransactionItem";
import EmptyState from "../common/EmptyState";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import ConfirmDialog from "../common/ConfirmDialog";
import { useDeleteTransaction } from "../../hooks/useTransactions";
import "./TransactionList.css";

const TransactionList = ({ transactions, isLoading, isError, onRetry, onEdit, emptyAction, currency }) => {
  const [pendingDelete, setPendingDelete] = useState(null);
  const deleteMutation = useDeleteTransaction();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="We couldn't load your transactions." onRetry={onRetry} />;
  if (!transactions?.length) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        message="Start tracking your finances by adding your first transaction."
        action={emptyAction}
      />
    );
  }

  const confirmDelete = async () => {
    await deleteMutation.mutateAsync(pendingDelete._id);
    setPendingDelete(null);
  };

  return (
    <>
      <div className="tx-list">
        <AnimatePresence initial={false}>
          {transactions.map((t) => (
            <TransactionItem
              key={t._id}
              transaction={t}
              currency={currency}
              onEdit={onEdit}
              onDelete={setPendingDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Delete transaction?"
        message={`This will permanently remove "${pendingDelete?.description || pendingDelete?.category}" from your records. This can't be undone.`}
      />
    </>
  );
};

export default TransactionList;
