import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  BarChart3,
  LogOut,
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
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-wrapper">
          <img
            src="/image.png"
            alt="Apollo University"
            className="sidebar-logo-image"
          />
        </div>
        <div className="sidebar-brand-text">
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              <div className="nav-link-icon">
                <Icon size={16} />
              </div>
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="sidebar-logout"
      >
        <div className="sidebar-logout-icon">
          <LogOut size={16} />
        </div>
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
