import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import MobileDrawer from "./MobileDrawer";
import Topbar from "./Topbar";
import AddTransactionDrawer from "../transactions/AddTransactionDrawer";
import "./AppShell.css";

const PAGE_META = {
  "/": { title: "Dashboard", subtitle: "Welcome back — here's your financial overview." },
  "/transactions": { title: "Transactions", subtitle: "Every inflow and outflow, all in one place." },
  "/analytics": { title: "Analytics", subtitle: "Understand where your money goes." },
  "/budgets": { title: "Budgets", subtitle: "Stay in control of your monthly spending." },
  "/goals": { title: "Goals", subtitle: "Track your progress toward what matters." },
  "/notifications": { title: "Notifications", subtitle: "Updates on your finances." },
  "/settings": { title: "Settings", subtitle: "Manage your account and preferences." },
};

const AppShell = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const meta = PAGE_META[location.pathname] || { title: "Finora" };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Topbar title={meta.title} subtitle={meta.subtitle} onMenuClick={() => setDrawerOpen(true)} />
        <div className="app-shell__content">
          <Outlet />
        </div>
      </div>

      <MobileNav onAddClick={() => setAddOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <AddTransactionDrawer open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default AppShell;
