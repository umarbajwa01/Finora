import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cx } from "../../utils/cx";
import "./StatCard.css";

const StatCard = ({ label, value, change, icon: Icon, tone = "neutral" }) => {
  const isPositive = typeof change === "number" && change >= 0;

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {Icon && (
          <span className={cx("stat-card__icon", `stat-card__icon--${tone}`)}>
            <Icon size={16} strokeWidth={1.75} />
          </span>
        )}
      </div>
      <div className="stat-card__value font-display">{value}</div>
      {typeof change === "number" && (
        <div className={cx("stat-card__change", isPositive ? "is-positive" : "is-negative")}>
          {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          <span>{Math.abs(change).toFixed(1)}% this month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
