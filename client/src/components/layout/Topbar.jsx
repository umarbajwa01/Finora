import { Sun, Moon, Menu, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../hooks/useNotifications";
import "./Topbar.css";

const Topbar = ({ title, subtitle, onMenuClick }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { data } = useNotifications();
  const unreadCount = data?.data?.unreadCount || 0;

  return (
    <header className="topbar">
      <button className="topbar__menu" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="topbar__titles">
        <h1 className="font-display">{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="topbar__actions">
        <Link to="/notifications" className="topbar__icon-btn topbar__notif">
          <Bell size={18} strokeWidth={1.75} />
          {unreadCount > 0 && <span className="topbar__dot" />}
        </Link>
        <button className="topbar__icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {resolvedTheme === "dark" ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
