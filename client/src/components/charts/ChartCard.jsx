import { motion } from "framer-motion";
import "./ChartCard.css";

const ChartCard = ({ title, subtitle, action, children }) => (
  <motion.div
    className="chart-card"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="chart-card__header">
      <div>
        <h3 className="font-display">{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className="chart-card__body">{children}</div>
  </motion.div>
);

export default ChartCard;
