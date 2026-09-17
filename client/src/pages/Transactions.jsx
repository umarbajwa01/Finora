import { useState } from "react";
import { Plus } from "lucide-react";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionList from "../components/transactions/TransactionList";
import Pagination from "../components/common/Pagination";
import Button from "../components/common/Button";
import AddTransactionDrawer from "../components/transactions/AddTransactionDrawer";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../context/AuthContext";

const Transactions = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: "all",
    category: "",
    search: "",
    sort: "newest",
  });
  const [addOpen, setAddOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const { data, isLoading, isError, refetch } = useTransactions(filters);
  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button icon={Plus} onClick={() => { setEditingTx(null); setAddOpen(true); }}>
          Add Transaction
        </Button>
      </div>

      <TransactionFilters filters={filters} onChange={setFilters} />

      <TransactionList
        transactions={items}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onEdit={(tx) => { setEditingTx(tx); setAddOpen(true); }}
        currency={user?.currency}
        emptyAction={<Button size="sm" onClick={() => setAddOpen(true)}>Add your first transaction</Button>}
      />

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      )}

      <AddTransactionDrawer
        open={addOpen}
        onClose={() => { setAddOpen(false); setEditingTx(null); }}
        transaction={editingTx}
      />
    </div>
  );
};

export default Transactions;
