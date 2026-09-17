import { motion } from "framer-motion";
import "./States.css";

const EmptyState = ({ icon: Icon, title, message, action }) => (
  <motion.div
    className="state-block"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {Icon && (
      <div className="state-block__icon state-block__icon--empty">
        <Icon size={26} strokeWidth={1.5} />
      </div>
    )}
    <h4 className="font-display">{title}</h4>
    {message && <p>{message}</p>}
    {action && <div className="state-block__action">{action}</div>}
  </motion.div>
);

export default EmptyState;
