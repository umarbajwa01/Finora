import { motion } from "framer-motion";
import { Pencil, Trash2, PlusCircle, Shield, Plane, Laptop, Car, GraduationCap, Target } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import "./GoalCard.css";

const ICON_MAP = { shield: Shield, plane: Plane, laptop: Laptop, car: Car, education: GraduationCap, target: Target };

const GoalCard = ({ goal, onEdit, onDelete, onContribute, currency = "USD" }) => {
  const Icon = ICON_MAP[goal.icon] || Target;
  const pct = goal.progress?.percentage ?? 0;
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <motion.div className="goal-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="goal-card__top">
        <div className="goal-card__ring">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="var(--bg-surface-sunken)" strokeWidth="7" />
            <motion.circle
              cx="48" cy="48" r="42" fill="none"
              stroke={goal.color || "var(--color-gold)"}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              transform="rotate(-90 48 48)"
            />
          </svg>
          <div className="goal-card__ring-center">
            <Icon size={20} style={{ color: goal.color }} />
            <span>{pct}%</span>
          </div>
        </div>

        <div className="goal-card__actions">
          <button onClick={() => onEdit(goal)} aria-label="Edit goal"><Pencil size={14} /></button>
          <button onClick={() => onDelete(goal)} aria-label="Delete goal" className="is-danger"><Trash2 size={14} /></button>
        </div>
      </div>

      <h4 className="goal-card__name font-display">{goal.name}</h4>
      <div className="goal-card__amounts">
        {formatCurrency(goal.currentAmount, currency)}
        <span> / {formatCurrency(goal.targetAmount, currency)}</span>
      </div>

      <div className="goal-card__meta">
        <span>{formatCurrency(goal.progress?.remaining, currency)} remaining</span>
        <span>Target: {formatDate(goal.targetDate, { day: undefined })}</span>
      </div>

      <button className="goal-card__contribute" onClick={() => onContribute(goal)}>
        <PlusCircle size={15} /> Add contribution
      </button>
    </motion.div>
  );
};

export default GoalCard;
