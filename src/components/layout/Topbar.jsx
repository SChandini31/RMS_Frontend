import { Bell, Settings } from "lucide-react";

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="h-[74px] bg-[#F7F8F8] border-b border-[#DCE3E6] px-6 flex items-center justify-between">
      <div>
        <h2 className="text-[22px]  font-bold text-apolloBlue">Welcome, {user?.name?.split(" ")[0] || "User"}</h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="h-9 w-9 rounded-full bg-white border border-[#E1E7EA] flex items-center justify-center text-[#6F7C83] hover:text-[#17313C] transition">
          <Bell size={16} />
        </button>

        <button className="h-9 w-9 rounded-full bg-white border border-[#E1E7EA] flex items-center justify-center text-[#6F7C83] hover:text-[#17313C] transition">
          <Settings size={16} />
        </button>

        <button className="h-11 w-11 rounded-full bg-gradient-to-br from-[#0A6F8F] to-[#35B8D6] text-white flex items-center justify-center shadow-md">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </button>
      </div>
    </div>
  );
};

export default Topbar;