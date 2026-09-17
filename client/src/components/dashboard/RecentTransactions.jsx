import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TransactionList from "../transactions/TransactionList";
import "./RecentTransactions.css";

const RecentTransactions = ({ transactions, isLoading, isError, onEdit, onRetry, currency }) => (
  <div className="recent-tx">
    <div className="recent-tx__header">
      <h3 className="font-display">Recent Transactions</h3>
      <Link to="/transactions" className="recent-tx__view-all">
        View all <ArrowRight size={14} />
      </Link>
    </div>
    <TransactionList
      transactions={transactions}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      onEdit={onEdit}
      currency={currency}
    />
  </div>
);

export default RecentTransactions;
