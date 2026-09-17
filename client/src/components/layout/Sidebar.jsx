import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ArrowLeftRight,
  PieChart,
  Wallet,
  Target,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/analytics", label: "Analytics", icon: PieChart },
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { data } = useNotifications();
  const unreadCount = data?.data?.unreadCount || 0;

  const initials = (user?.name || "F")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__mark font-display">F</span>
        <div>
          <div className="sidebar__wordmark font-display">Finora</div>
          <div className="sidebar__tagline">Your money. Refined.</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar__link${isActive ? " is-active" : ""}`}
          >
            <Icon size={18} strokeWidth={1.75} />
            <span>{label}</span>
            {to === "/notifications" && unreadCount > 0 && (
              <span className="sidebar__badge">{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <span className="sidebar__avatar">{initials}</span>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{user?.name}</div>
            <div className="sidebar__user-email">{user?.email}</div>
          </div>
        </div>
        <button className="sidebar__logout" onClick={logout} aria-label="Log out">
          <LogOut size={17} strokeWidth={1.75} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
