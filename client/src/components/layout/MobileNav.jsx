import { NavLink } from "react-router-dom";
import { LayoutGrid, ArrowLeftRight, Plus, PieChart, Wallet } from "lucide-react";
import "./MobileNav.css";

const MobileNav = ({ onAddClick }) => (
  <nav className="mobile-nav">
    <NavLink to="/" end className={({ isActive }) => `mobile-nav__link${isActive ? " is-active" : ""}`}>
      <LayoutGrid size={20} strokeWidth={1.75} />
      <span>Home</span>
    </NavLink>
    <NavLink to="/transactions" className={({ isActive }) => `mobile-nav__link${isActive ? " is-active" : ""}`}>
      <ArrowLeftRight size={20} strokeWidth={1.75} />
      <span>History</span>
    </NavLink>

    <button className="mobile-nav__fab" onClick={onAddClick} aria-label="Add transaction">
      <Plus size={22} strokeWidth={2} />
    </button>

    <NavLink to="/analytics" className={({ isActive }) => `mobile-nav__link${isActive ? " is-active" : ""}`}>
      <PieChart size={20} strokeWidth={1.75} />
      <span>Analytics</span>
    </NavLink>
    <NavLink to="/budgets" className={({ isActive }) => `mobile-nav__link${isActive ? " is-active" : ""}`}>
      <Wallet size={20} strokeWidth={1.75} />
      <span>Budgets</span>
    </NavLink>
  </nav>
);

export default MobileNav;
