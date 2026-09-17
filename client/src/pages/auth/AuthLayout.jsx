import { motion } from "framer-motion";
import "./AuthLayout.css";

const AuthLayout = ({ eyebrow, title, subtitle, children, footer }) => (
  <div className="auth-layout">
    <div className="auth-layout__panel">
      <div className="auth-layout__brand">
        <span className="auth-layout__mark font-display">F</span>
        <span className="font-display">Finora</span>
      </div>
      <div className="auth-layout__copy">
        <h2 className="font-display">Your money.<br />Refined.</h2>
        <p>
          A private, sophisticated way to track income, spending, budgets and goals —
          built for people who take their finances seriously.
        </p>
      </div>
      <div className="auth-layout__panel-geo" />
    </div>

    <div className="auth-layout__form-side">
      <motion.div
        className="auth-layout__form-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {eyebrow && <span className="auth-layout__eyebrow">{eyebrow}</span>}
        <h1 className="font-display">{title}</h1>
        {subtitle && <p className="auth-layout__subtitle">{subtitle}</p>}
        <div className="auth-layout__body">{children}</div>
        {footer && <div className="auth-layout__footer">{footer}</div>}
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;
