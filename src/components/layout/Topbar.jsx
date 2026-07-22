import { Bell, Settings } from "lucide-react";

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="topbar">
      <div>
        <h2 className="topbar-title">
          Welcome, {user?.name?.split(" ")[0] || "User"}
        </h2>
      </div>

      <div className="topbar-actions">
        <button className="topbar-icon-btn" type="button">
          <Bell size={16} />
        </button>

        <button className="topbar-icon-btn" type="button">
          <Settings size={16} />
        </button>

        <button className="topbar-avatar" type="button">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </button>
      </div>
    </div>
  );
};

export default Topbar;
