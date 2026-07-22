import { useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const showTopbar = location.pathname === "/dashboard";

  return (
    <div className="dashboard-shell">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="dashboard-main">
        {showTopbar && (
          <div className="dashboard-topbar-sticky">
            <Topbar />
          </div>
        )}
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
