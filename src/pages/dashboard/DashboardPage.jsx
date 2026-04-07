import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";

const API_BASE = "https://rms-897z.onrender.com";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await axios.get(`${API_BASE}/api/dashboard/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboardData(res.data);
      } catch (error) {
        console.error("DASHBOARD FETCH ERROR:", error.response?.data || error.message);
        setErrorMsg(error.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardSummary();
    } else {
      setLoading(false);
      setErrorMsg("No token found. Please login again.");
    }
  }, [token]);

  const role = dashboardData?.role || user?.role;

  const summary = dashboardData?.summary || {};
  const overview = dashboardData?.overview || {};

  const getCardsByRole = () => {
    if (role === "super_admin") {
      return [
        {
          title: "Total Users",
          value: summary.totalUsers ?? 0,
          note: "Across all departments",
          noteColor: "text-[#1B7F8B]",
        },
        {
          title: "Total Publications",
          value: summary.totalPublications ?? 0,
          note: "Institution-wide",
          noteColor: "text-[#1B7F8B]",
        },
        {
          title: "Pending Approvals",
          value: summary.pendingApprovals ?? 0,
          note: "Needs attention",
          noteColor: "text-[#F2B400]",
        },
      ];
    }

    if (role === "admin") {
      return [
        {
          title: "Department Users",
          value: summary.totalUsers ?? 0,
          note: "Your department only",
          noteColor: "text-[#1B7F8B]",
        },
        {
          title: "Department Publications",
          value: summary.totalPublications ?? 0,
          note: "Department-wide",
          noteColor: "text-[#1B7F8B]",
        },
        {
          title: "Pending Approvals",
          value: summary.pendingApprovals ?? 0,
          note: "Department review",
          noteColor: "text-[#F2B400]",
        },
      ];
    }

    if (role === "faculty" || role === "student") {
      return [
        {
          title: "My Publications",
          value: summary.myPublications ?? 0,
          note: "Uploaded by you",
          noteColor: "text-[#1B7F8B]",
        },
        {
          title: "Approved",
          value: summary.approved ?? 0,
          note: "Accepted records",
          noteColor: "text-[#1B7F8B]",
        },
        {
          title: "Pending",
          value: summary.pending ?? 0,
          note: "Waiting for review",
          noteColor: "text-[#F2B400]",
        },
      ];
    }

    if (role === "directorate") {
      return [
        {
          title: "Total Publications",
          value: summary.totalPublications ?? 0,
          note: "Institution-wide",
          noteColor: "text-[#1B7F8B]",
        },
        {
          title: "Pending Approvals",
          value: summary.pendingApprovals ?? 0,
          note: "Awaiting action",
          noteColor: "text-[#F2B400]",
        },
        {
          title: "Approved Records",
          value: overview?.statusStats?.approved ?? 0,
          note: "Completed approvals",
          noteColor: "text-[#1B7F8B]",
        },
      ];
    }

    if (role === "special_user") {
      return [
        {
          title: "Total Publications",
          value: summary.totalPublications ?? 0,
          note: "View-only overview",
          noteColor: "text-[#1B7F8B]",
        },
        {
          title: "Approved",
          value: overview?.statusStats?.approved ?? 0,
          note: "Institution records",
          noteColor: "text-[#1B7F8B]",
        },
        {
          title: "Pending",
          value: overview?.statusStats?.pending ?? 0,
          note: "Current queue",
          noteColor: "text-[#F2B400]",
        },
      ];
    }

    return [];
  };

  const cards = getCardsByRole();

  return (
    <DashboardLayout>
      

      {loading ? (
        <div className="bg-white rounded-3xl p-6 border border-[#E1E7EA] shadow-sm text-[#7A878E]">
          Loading dashboard...
        </div>
      ) : errorMsg ? (
        <div className="bg-white rounded-3xl p-6 border border-red-200 shadow-sm text-red-500">
          {errorMsg}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-3xl p-6 border border-[#E1E7EA] shadow-sm"
              >
                <p className="text-sm text-[#7A878E]">{card.title}</p>
                <h3 className="mt-2 text-3xl font-bold text-[#17313C]">
                  {card.value}
                </h3>
                <p className={`mt-2 text-sm ${card.noteColor}`}>{card.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E1E7EA] shadow-sm">
              <h3 className="text-xl font-bold text-[#17313C]">Recent Publications</h3>
              <p className="text-sm text-[#7A878E] mt-1">
                Latest publication activity
              </p>

              <div className="mt-5 space-y-3">
                {overview?.recentPublications?.length > 0 ? (
                  overview.recentPublications.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 rounded-2xl bg-[#F7F8F8] border border-[#E8ECEF]"
                    >
                      <p className="font-semibold text-[#17313C]">{item.title}</p>
                      <p className="text-sm text-[#7A878E] mt-1">
                        {item.department || "No Department"} • {item.status || "N/A"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-[#F7F8F8] border border-[#E8ECEF] text-[#98A4AA]">
                    No recent publications found
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E1E7EA] shadow-sm">
              <h3 className="text-xl font-bold text-[#17313C]">Overview</h3>
              <p className="text-sm text-[#7A878E] mt-1">
                Role-based summary details
              </p>

              <div className="mt-5 space-y-3">
                {overview?.departmentStats?.length > 0 ? (
                  overview.departmentStats.map((item, index) => (
                    <div
                      key={`${item.department}-${index}`}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F8F8] border border-[#E8ECEF]"
                    >
                      <p className="font-medium text-[#17313C]">
                        {item.department || "Unknown"}
                      </p>
                      <span className="text-sm font-semibold text-[#1B7F8B]">
                        {item.count}
                      </span>
                    </div>
                  ))
                ) : overview?.statusStats ? (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F8F8] border border-[#E8ECEF]">
                      <p className="font-medium text-[#17313C]">Approved</p>
                      <span className="text-sm font-semibold text-[#1B7F8B]">
                        {overview.statusStats.approved ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F8F8] border border-[#E8ECEF]">
                      <p className="font-medium text-[#17313C]">Pending</p>
                      <span className="text-sm font-semibold text-[#F2B400]">
                        {overview.statusStats.pending ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F8F8] border border-[#E8ECEF]">
                      <p className="font-medium text-[#17313C]">Rejected</p>
                      <span className="text-sm font-semibold text-red-500">
                        {overview.statusStats.rejected ?? 0}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#F7F8F8] border border-[#E8ECEF] text-[#98A4AA]">
                    No overview data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;