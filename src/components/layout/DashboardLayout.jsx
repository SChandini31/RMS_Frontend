import { useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const showTopbar = location.pathname === "/dashboard";

  return (
    <div className="h-screen flex overflow-hidden bg-[#F3F5F6]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
  {showTopbar && (
    <div className="sticky top-0 z-20">
      <Topbar />
    </div>
  )}
  <main className="flex-1 overflow-y-auto p-6">
    {children}
  </main>
</div>
    </div>
  );
};

export default DashboardLayout;