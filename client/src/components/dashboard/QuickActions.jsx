import { ArrowDownCircle, ArrowUpCircle, Repeat, Camera } from "lucide-react";
import "./QuickActions.css";

const ACTIONS = [
  { key: "expense", label: "Add Expense", icon: ArrowDownCircle },
  { key: "income", label: "Add Income", icon: ArrowUpCircle },
  { key: "transfer", label: "Transfer", icon: Repeat },
  { key: "scan", label: "Scan Receipt", icon: Camera },
];

const QuickActions = ({ onAction }) => (
  <div className="quick-actions">
    {ACTIONS.map(({ key, label, icon: Icon }) => (
      <button key={key} className="quick-actions__btn" onClick={() => onAction(key)}>
        <span className="quick-actions__icon"><Icon size={18} strokeWidth={1.75} /></span>
        <span>{label}</span>
      </button>
    ))}
  </div>
);

export default QuickActions;
