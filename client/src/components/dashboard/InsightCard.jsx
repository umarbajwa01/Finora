import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import "./InsightCard.css";

const TONE_META = {
  positive: { icon: TrendingUp, className: "is-positive" },
  warning: { icon: TrendingDown, className: "is-warning" },
  info: { icon: Info, className: "is-info" },
};

const InsightCard = ({ type = "info", message, index = 0 }) => {
  const meta = TONE_META[type] || TONE_META.info;
  const Icon = meta.icon;

  return (
    <motion.div
      className={`insight-card ${meta.className}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <span className="insight-card__icon"><Icon size={15} /></span>
      <p>{message}</p>
    </motion.div>
  );
};

export default InsightCard;
