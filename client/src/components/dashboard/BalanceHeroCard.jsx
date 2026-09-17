import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Eye, EyeOff, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import "./BalanceHeroCard.css";

const BalanceHeroCard = ({ balance, income, expense, changePercent, currency = "USD" }) => {
  const cardRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const isPositive = changePercent >= 0;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-140, 140], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="balance-hero"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="balance-hero__sheen" />
      <div className="balance-hero__geometry balance-hero__geometry--1" />
      <div className="balance-hero__geometry balance-hero__geometry--2" />

      <div className="balance-hero__top">
        <span className="balance-hero__label">Total Balance</span>
        <button className="balance-hero__visibility" onClick={() => setHidden((h) => !h)} aria-label="Toggle balance visibility">
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="balance-hero__value font-display">
        {hidden ? "••••••" : formatCurrency(balance, currency)}
      </div>

      <div className={`balance-hero__change ${isPositive ? "is-positive" : "is-negative"}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{Math.abs(changePercent).toFixed(1)}% this month</span>
      </div>

      <div className="balance-hero__split">
        <div>
          <span className="balance-hero__split-label">Income</span>
          <span className="balance-hero__split-value is-income">
            {hidden ? "••••" : formatCurrency(income, currency)}
          </span>
        </div>
        <div className="balance-hero__divider" />
        <div>
          <span className="balance-hero__split-label">Expenses</span>
          <span className="balance-hero__split-value is-expense">
            {hidden ? "••••" : formatCurrency(expense, currency)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceHeroCard;
