import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  BarChart3,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const roleMenus = {
  super_admin: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/users", icon: Users },
    { name: "Publications", path: "/publications", icon: FileText },
    { name: "Audit Logs", path: "/audit-logs", icon: ShieldCheck },
    { name: "Metrics", path: "/metrics", icon: BarChart3 },
  ],

  admin: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/users", icon: Users },
    { name: "Publications", path: "/publications", icon: FileText },
    { name: "Metrics", path: "/metrics", icon: BarChart3 },
  ],

  faculty: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Publications", path: "/publications", icon: FileText },
    { name: "Metrics", path: "/metrics", icon: BarChart3 },
  ],

  student: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Publications", path: "/publications", icon: FileText },
    { name: "Metrics", path: "/metrics", icon: BarChart3 },
  ],

  directorate: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Publications", path: "/publications", icon: FileText },
    { name: "Metrics", path: "/metrics", icon: BarChart3 },
    { name: "Audit Logs", path: "/audit-logs", icon: ShieldCheck },
  ],

  special_user: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Publications", path: "/publications", icon: FileText },
    { name: "Metrics", path: "/metrics", icon: BarChart3 },
  ],
};

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "student";

  const menuItems = roleMenus[role] || roleMenus.student;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="w-[245px] min-h-screen bg-[#F7F8F8] border-r border-[#DCE3E6] px-5 py-5 flex flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-12 w-12 rounded-2xl bg-[#F4B400] hover:bg-[#D99A00] text-white font-semibold shadow-[0_8px_18px_rgba(244,180,0,0.28)] flex items-center justify-center">
          <GraduationCap size={22} />
        </div>
        <div>
          <h1 className="text-[18px] font-bold text-[#17313C] leading-none">
            Apollo RMS
          </h1>
          <p className="text-xs text-[#8A959B] mt-1">Research Management</p>
        </div>
      </div>

      {/* Role label */}
      

      {/* Menu */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-[#E8F5F6] text-[#1B7F8B] shadow-sm"
                    : "text-[#6F7C83] hover:bg-white hover:text-[#17313C]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`h-8 w-8 rounded-2xl flex items-center justify-center transition ${
                      isActive
                        ? "bg-[#45837D] text-white"
                        : "bg-[#F4F6F7] text-[#8A959B] group-hover:text-[#17313C]"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom action */}
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-medium text-red-500 hover:bg-white transition"
      >
        <div className="h-8 w-8 rounded-2xl bg-[#F4F6F7] flex items-center justify-center">
          <LogOut size={16} />
        </div>
        <span className="text-red-500">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;