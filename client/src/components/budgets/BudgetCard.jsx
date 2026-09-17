import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import CategoryBadge from "../common/CategoryBadge";
import { formatCurrency } from "../../utils/formatters";
import "./BudgetCard.css";

const STATUS_META = {
  on_track: { label: "On track", className: "is-ontrack" },
  warning: { label: "Warning", className: "is-warning" },
  critical: { label: "Critical", className: "is-critical" },
  exceeded: { label: "Exceeded", className: "is-exceeded" },
};

const BudgetCard = ({ budget, onEdit, onDelete, currency = "USD" }) => {
  const usage = budget.usage || { used: 0, remaining: budget.amount, percentage: 0, daysRemaining: 0, status: "on_track" };
  const status = STATUS_META[usage.status] || STATUS_META.on_track;
  const pct = Math.min(usage.percentage, 100);

  return (
    <motion.div className="budget-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="budget-card__header">
        <CategoryBadge category={budget.category} />
        <div className="budget-card__actions">
          <button onClick={() => onEdit(budget)} aria-label="Edit budget"><Pencil size={14} /></button>
          <button onClick={() => onDelete(budget)} aria-label="Delete budget" className="is-danger"><Trash2 size={14} /></button>
        </div>
      </div>

      <div className="budget-card__amounts">
        <span className="budget-card__used">{formatCurrency(usage.used, currency)}</span>
        <span className="budget-card__total"> / {formatCurrency(budget.amount, currency)}</span>
      </div>

      <div className="budget-card__track">
        <motion.div
          className={`budget-card__fill ${status.className}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="budget-card__footer">
        <span className={`budget-card__status ${status.className}`}>{usage.percentage}% used · {status.label}</span>
        <span className="budget-card__days">{usage.daysRemaining}d left</span>
      </div>
    </motion.div>
  );
};

export default BudgetCard;
