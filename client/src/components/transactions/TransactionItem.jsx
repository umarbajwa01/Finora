import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import CategoryBadge from "../common/CategoryBadge";
import { formatCurrency, formatShortDate } from "../../utils/formatters";
import { cx } from "../../utils/cx";
import "./TransactionItem.css";

const TransactionItem = ({ transaction, onEdit, onDelete, currency = "USD" }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isIncome = transaction.type === "income";

  return (
    <motion.div
      className="tx-item"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
    >
      <span className={cx("tx-item__indicator", isIncome ? "is-income" : "is-expense")}>
        {isIncome ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
      </span>

      <div className="tx-item__info">
        <div className="tx-item__title">{transaction.description || transaction.category}</div>
        <div className="tx-item__meta">
          <CategoryBadge category={transaction.category} size="sm" />
          <span className="tx-item__date">{formatShortDate(transaction.date)}</span>
        </div>
      </div>

      <div className={cx("tx-item__amount", isIncome ? "is-income" : "is-expense")}>
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount, currency)}
      </div>

      <div className="tx-item__menu-wrap">
        <button className="tx-item__menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Transaction actions">
          <MoreHorizontal size={17} />
        </button>
        {menuOpen && (
          <>
            <div className="tx-item__menu-backdrop" onClick={() => setMenuOpen(false)} />
            <div className="tx-item__menu">
              <button onClick={() => { setMenuOpen(false); onEdit(transaction); }}>
                <Pencil size={14} /> Edit
              </button>
              <button className="is-danger" onClick={() => { setMenuOpen(false); onDelete(transaction); }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionItem;
