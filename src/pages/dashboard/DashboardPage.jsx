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

const NOTE_COLOR_CLASS = {
  "text-sky-600": "stat-card-note--sky",
  "text-emerald-600": "stat-card-note--emerald",
  "text-amber-600": "stat-card-note--amber",
};

const RING_COLOR_CLASS = {
  "from-sky-500/20 to-sky-100": "stat-card-ring--sky",
  "from-emerald-500/20 to-emerald-100": "stat-card-ring--emerald",
  "from-amber-500/20 to-amber-100": "stat-card-ring--amber",
};

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const role = dashboardData?.role || user?.role;
  const isSchoolFilterRole =
    role === "super_admin" || role === "special_user";

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const url = selectedSchool
          ? `${API_BASE}/api/dashboard/summary?school=${encodeURIComponent(
              selectedSchool
            )}`
          : `${API_BASE}/api/dashboard/summary`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Dashboard summary response:", res.data);
        console.log("School stats:", res.data?.overview?.schoolStats);
        console.log("Department stats:", res.data?.overview?.departmentStats);
        console.log("Selected school:", res.data?.overview?.selectedSchool);

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
  }, [token, selectedSchool]);

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
          note: selectedSchool ? `In ${selectedSchool}` : "Institution-wide",
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
          value: summary.approved ?? overview?.statusStats?.approved ?? 0,
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
          note: selectedSchool ? `In ${selectedSchool}` : "Across all schools",
          noteColor: "text-sky-600",
          ring: "from-sky-500/20 to-sky-100",
        },
        {
          title: "Approved",
          value: summary.approved ?? overview?.statusStats?.approved ?? 0,
          note: "Institution records",
          noteColor: "text-emerald-600",
          ring: "from-emerald-500/20 to-emerald-100",
        },
        {
          title: "Pending",
          value: summary.pending ?? overview?.statusStats?.pending ?? 0,
          note: "Current queue",
          noteColor: "text-amber-600",
          ring: "from-amber-500/20 to-amber-100",
        },
      ];
    }

    return [];
  };

  const cards = getCardsByRole();

  const availableSchools = useMemo(() => {
    return (overview?.schoolStats || [])
      .map((item) => item.school)
      .filter(Boolean);
  }, [overview]);

  const pieData = useMemo(() => {
    if (role === "super_admin" || role === "special_user") {
      if (selectedSchool) {
        return (overview?.departmentStats || [])
          .map((item) => ({
            name: item.department || "Unknown",
            value: Number(item.count) || 0,
          }))
          .filter((item) => item.value > 0);
      }

      return (overview?.schoolStats || [])
        .map((item) => ({
          name: item.school || "Unknown",
          value: Number(item.count) || 0,
        }))
        .filter((item) => item.value > 0);
    }

    return [
      {
        name: "Approved",
        value: Number(overview?.statusStats?.approved) || 0,
      },
      {
        name: "Pending",
        value: Number(overview?.statusStats?.pending) || 0,
      },
      {
        name: "Rejected",
        value: Number(overview?.statusStats?.rejected) || 0,
      },
    ].filter((item) => item.value > 0);
  }, [overview, role, selectedSchool]);

  const totalPieValue = useMemo(() => {
    return pieData.reduce((sum, item) => sum + item.value, 0);
  }, [pieData]);

  const chartTitle = useMemo(() => {
    if (role === "super_admin" || role === "special_user") {
      return selectedSchool ? "Department Distribution" : "School Distribution";
    }
    return "Status Distribution";
  }, [role, selectedSchool]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload;
    const percent =
      totalPieValue > 0 ? ((data.value / totalPieValue) * 100).toFixed(1) : 0;

    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-title">{data.name}</p>
        <p className="chart-tooltip-row">
          Count:{" "}
          <span className="chart-tooltip-value">{data.value}</span>
        </p>
        <p className="chart-tooltip-row">
          Share:{" "}
          <span className="chart-tooltip-value">{percent}%</span>
        </p>
      </div>
    );
  };

  const getPublicationStatusText = (item) => {
    if (item.finalStatus === "approved") return "Approved";
    if (
      item.facultyApprovalStatus === "rejected" ||
      item.directorateApprovalStatus === "rejected" ||
      item.finalStatus === "rejected"
    ) {
      return "Rejected";
    }
    if (
      item.facultyApprovalStatus === "approved" &&
      item.directorateApprovalStatus === "pending"
    ) {
      return "Pending Directorate";
    }
    if (item.facultyApprovalStatus === "pending") return "Pending Faculty";
    return "Pending";
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="loading-state">Loading dashboard...</div>
      ) : errorMsg ? (
        <div className="error-state">{errorMsg}</div>
      ) : (
        <>
          <div className="grid-stats">
            {cards.map((card) => (
              <div key={card.title} className="stat-card">
                <div
                  className={`stat-card-ring ${RING_COLOR_CLASS[card.ring] || ""}`}
                />
                <p className="stat-card-label">{card.title}</p>
                <h3 className="stat-card-value">{card.value}</h3>
                <p
                  className={`stat-card-note ${NOTE_COLOR_CLASS[card.noteColor] || ""}`}
                >
                  {card.note}
                </p>
              </div>
            ))}
          </div>

          <div className="grid-dashboard">
            <div className="content-card-xl">
              <h3 className="section-heading">Recent Publications</h3>
              <p className="page-subtitle">Latest publication activity</p>

              <div className="recent-list">
                {overview?.recentPublications?.length > 0 ? (
                  overview.recentPublications.map((item) => (
                    <div key={item._id} className="list-item-card">
                      <p className="cell-primary">{item.title}</p>
                      <p className="page-subtitle">
                        {(item.school ? `${item.school} • ` : "")}
                        {(item.department ? `${item.department} • ` : "")}
                        {getPublicationStatusText(item)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No recent publications found</div>
                )}
              </div>
            </div>

            <div className="content-card-xl">
              <div className="overview-header">
                <div>
                  <h3 className="section-heading">Overview</h3>
                  <p className="page-subtitle">{chartTitle}</p>
                </div>

                <div className="overview-controls">
                  <div className="role-pill">
                    {role?.replace("_", " ") || "dashboard"}
                  </div>

                  {isSchoolFilterRole && (
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="form-select-sm"
                    >
                      <option value="">All Schools</option>
                      {availableSchools.map((school) => (
                        <option key={school} value={school}>
                          {school}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {pieData.length > 0 ? (
                <>
                  <div className="chart-container">
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

                  <div className="grid-legend">
                    {pieData.map((item, index) => {
                      const percent =
                        totalPieValue > 0
                          ? ((item.value / totalPieValue) * 100).toFixed(1)
                          : 0;
                      const color = PIE_COLORS[index % PIE_COLORS.length];

                      return (
                        <div key={`${item.name}-${index}`} className="legend-item">
                          <div className="legend-header">
                            <div className="legend-label">
                              <span
                                className="legend-dot"
                                style={{ backgroundColor: color }}
                              />
                              <p className="legend-name">{item.name}</p>
                            </div>
                            <span className="legend-count">{item.value}</span>
                          </div>

                          <div className="legend-bar-track">
                            <div
                              className="legend-bar-fill"
                              style={{
                                width: `${percent}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>

                          <p className="legend-percent">{percent}% of total</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="empty-state">No overview data available</div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
