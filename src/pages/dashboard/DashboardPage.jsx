import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "https://rms-897z.onrender.com";

const PIE_COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#84CC16",
  "#EC4899",
  "#14B8A6",
];

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

        console.log("Dashboard summary response:", res.data);
        console.log("Department stats:", res.data?.overview?.departmentStats);

        setDashboardData(res.data);
      } catch (error) {
        console.error(
          "DASHBOARD FETCH ERROR:",
          error.response?.data || error.message
        );
        setErrorMsg(
          error.response?.data?.message || "Failed to load dashboard data"
        );
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
          noteColor: "text-sky-600",
          ring: "from-sky-500/20 to-sky-100",
        },
        {
          title: "Total Publications",
          value: summary.totalPublications ?? 0,
          note: "Institution-wide",
          noteColor: "text-emerald-600",
          ring: "from-emerald-500/20 to-emerald-100",
        },
        {
          title: "Pending Approvals",
          value: summary.pendingApprovals ?? 0,
          note: "Needs attention",
          noteColor: "text-amber-600",
          ring: "from-amber-500/20 to-amber-100",
        },
      ];
    }

    if (role === "admin") {
      return [
        {
          title: "Department Users",
          value: summary.totalUsers ?? 0,
          note: "Your department only",
          noteColor: "text-sky-600",
          ring: "from-sky-500/20 to-sky-100",
        },
        {
          title: "Department Publications",
          value: summary.totalPublications ?? 0,
          note: "Department-wide",
          noteColor: "text-emerald-600",
          ring: "from-emerald-500/20 to-emerald-100",
        },
        {
          title: "Pending Approvals",
          value: summary.pendingApprovals ?? 0,
          note: "Department review",
          noteColor: "text-amber-600",
          ring: "from-amber-500/20 to-amber-100",
        },
      ];
    }

    if (role === "faculty" || role === "student") {
      return [
        {
          title: "My Publications",
          value: summary.myPublications ?? 0,
          note: "Uploaded by you",
          noteColor: "text-sky-600",
          ring: "from-sky-500/20 to-sky-100",
        },
        {
          title: "Approved",
          value: summary.approved ?? 0,
          note: "Accepted records",
          noteColor: "text-emerald-600",
          ring: "from-emerald-500/20 to-emerald-100",
        },
        {
          title: "Pending",
          value: summary.pending ?? 0,
          note: "Waiting for review",
          noteColor: "text-amber-600",
          ring: "from-amber-500/20 to-amber-100",
        },
      ];
    }

    if (role === "directorate") {
      return [
        {
          title: "Total Publications",
          value: summary.totalPublications ?? 0,
          note: "Institution-wide",
          noteColor: "text-sky-600",
          ring: "from-sky-500/20 to-sky-100",
        },
        {
          title: "Pending Approvals",
          value: summary.pendingApprovals ?? 0,
          note: "Awaiting action",
          noteColor: "text-amber-600",
          ring: "from-amber-500/20 to-amber-100",
        },
        {
          title: "Approved Records",
          value: overview?.statusStats?.approved ?? 0,
          note: "Completed approvals",
          noteColor: "text-emerald-600",
          ring: "from-emerald-500/20 to-emerald-100",
        },
      ];
    }

    if (role === "special_user") {
      return [
        {
          title: "Total Publications",
          value: summary.totalPublications ?? 0,
          note: "View-only overview",
          noteColor: "text-sky-600",
          ring: "from-sky-500/20 to-sky-100",
        },
        {
          title: "Approved",
          value: overview?.statusStats?.approved ?? 0,
          note: "Institution records",
          noteColor: "text-emerald-600",
          ring: "from-emerald-500/20 to-emerald-100",
        },
        {
          title: "Pending",
          value: overview?.statusStats?.pending ?? 0,
          note: "Current queue",
          noteColor: "text-amber-600",
          ring: "from-amber-500/20 to-amber-100",
        },
      ];
    }

    return [];
  };

  const cards = getCardsByRole();

  const pieData = useMemo(() => {
    if (overview?.departmentStats?.length > 0) {
      return overview.departmentStats
        .map((item) => ({
          name: item.department || "Unknown",
          value: Number(item.count) || 0,
        }))
        .filter((item) => item.value > 0);
    }

    if (overview?.statusStats) {
      return [
        {
          name: "Approved",
          value: Number(overview.statusStats.approved) || 0,
        },
        {
          name: "Pending",
          value: Number(overview.statusStats.pending) || 0,
        },
        {
          name: "Rejected",
          value: Number(overview.statusStats.rejected) || 0,
        },
      ].filter((item) => item.value > 0);
    }

    return [];
  }, [overview]);

  const totalPieValue = useMemo(() => {
    return pieData.reduce((sum, item) => sum + item.value, 0);
  }, [pieData]);

  const chartTitle =
    overview?.departmentStats?.length > 0
      ? "Department Distribution"
      : "Status Distribution";

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload;
    const percent =
      totalPieValue > 0 ? ((data.value / totalPieValue) * 100).toFixed(1) : 0;

    return (
      <div className="rounded-2xl border border-[#E1E7EA] bg-white px-4 py-3 shadow-lg">
        <p className="text-sm font-semibold text-[#17313C]">{data.name}</p>
        <p className="mt-1 text-sm text-[#5F6B73]">
          Count: <span className="font-semibold text-[#17313C]">{data.value}</span>
        </p>
        <p className="text-sm text-[#5F6B73]">
          Share: <span className="font-semibold text-[#17313C]">{percent}%</span>
        </p>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="rounded-3xl border border-[#E1E7EA] bg-white p-6 shadow-sm text-[#7A878E]">
          Loading dashboard...
        </div>
      ) : errorMsg ? (
        <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm text-red-500">
          {errorMsg}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className="relative overflow-hidden rounded-3xl border border-[#E1E7EA] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${card.ring}`}
                />
                <p className="relative text-sm text-[#7A878E]">{card.title}</p>
                <h3 className="relative mt-2 text-3xl font-bold text-[#17313C]">
                  {card.value}
                </h3>
                <p className={`relative mt-2 text-sm font-medium ${card.noteColor}`}>
                  {card.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-[#E1E7EA] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#17313C]">
                Recent Publications
              </h3>
              <p className="mt-1 text-sm text-[#7A878E]">
                Latest publication activity
              </p>

              <div className="mt-5 space-y-3">
                {overview?.recentPublications?.length > 0 ? (
                  overview.recentPublications.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl border border-[#E8ECEF] bg-[#F7F8F8] p-4 transition-all duration-300 hover:border-[#D5E3E8] hover:bg-white"
                    >
                      <p className="font-semibold text-[#17313C]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-[#7A878E]">
                        {item.department || "No Department"} • {item.status || "N/A"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-[#E8ECEF] bg-[#F7F8F8] p-4 text-[#98A4AA]">
                    No recent publications found
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-[#E1E7EA] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#17313C]">Overview</h3>
                  <p className="mt-1 text-sm text-[#7A878E]">{chartTitle}</p>
                </div>
                <div className="rounded-full bg-[#F4F8FA] px-3 py-1 text-xs font-medium text-[#1B7F8B]">
                  {role?.replace("_", " ") || "dashboard"}
                </div>
              </div>

              {pieData.length > 0 ? (
                <>
                  <div className="mt-6 h-[340px] w-full rounded-3xl bg-gradient-to-br from-[#F9FBFC] to-[#F3F7F9] p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          paddingAngle={3}
                          cornerRadius={6}
                          stroke="#ffffff"
                          strokeWidth={3}
                          labelLine={false}
                          label={({ percent }) =>
                            `${((percent || 0) * 100).toFixed(0)}%`
                          }
                          isAnimationActive={true}
                          animationDuration={700}
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${entry.name}-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {pieData.map((item, index) => {
                      const percent =
                        totalPieValue > 0
                          ? ((item.value / totalPieValue) * 100).toFixed(1)
                          : 0;

                      return (
                        <div
                          key={`${item.name}-${index}`}
                          className="rounded-2xl border border-[#E8ECEF] bg-[#F7F8F8] p-4 transition-all duration-300 hover:bg-white"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                className="h-3 w-3 shrink-0 rounded-full"
                                style={{
                                  backgroundColor:
                                    PIE_COLORS[index % PIE_COLORS.length],
                                }}
                              />
                              <p className="truncate font-medium text-[#17313C]">
                                {item.name}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-[#17313C]">
                              {item.value}
                            </span>
                          </div>

                          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percent}%`,
                                backgroundColor:
                                  PIE_COLORS[index % PIE_COLORS.length],
                              }}
                            />
                          </div>

                          <p className="mt-2 text-xs font-medium text-[#7A878E]">
                            {percent}% of total
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="mt-5 rounded-2xl border border-[#E8ECEF] bg-[#F7F8F8] p-4 text-[#98A4AA]">
                  No overview data available
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;