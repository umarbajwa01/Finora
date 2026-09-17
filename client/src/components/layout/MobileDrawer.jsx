import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Target, Bell, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./MobileDrawer.css";

const EXTRA_ITEMS = [
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

const MobileDrawer = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="mobile-drawer__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="mobile-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            <div className="mobile-drawer__header">
              <span className="font-display">Menu</span>
              <button onClick={onClose} aria-label="Close menu"><X size={20} /></button>
            </div>
            <div className="mobile-drawer__user">
              <div className="mobile-drawer__avatar">{(user?.name || "F")[0]}</div>
              <div>
                <div className="mobile-drawer__name">{user?.name}</div>
                <div className="mobile-drawer__email">{user?.email}</div>
              </div>
            </div>
            <nav className="mobile-drawer__nav">
              {EXTRA_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={onClose} className="mobile-drawer__link">
                  <Icon size={18} strokeWidth={1.75} />
                  <span>{label}</span>
                </NavLink>
              ))}
              <button className="mobile-drawer__link mobile-drawer__logout" onClick={logout}>
                <LogOut size={18} strokeWidth={1.75} />
                <span>Log out</span>
              </button>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
