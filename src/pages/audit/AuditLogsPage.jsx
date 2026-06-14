import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const API_BASE = "https://rms-897z.onrender.com";

const AuditLogsPage = () => {
  const token = localStorage.getItem("token");

  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLogs: 0,
    userActions: 0,
    publicationActions: 0,
    reportDownloads: 0,
  });

  const [filters, setFilters] = useState({
    school: "all",
    department: "all",
    from: "",
    to: "",
  });

  const [dropdownData, setDropdownData] = useState({
    schools: [],
    departments: [],
  });

  const [loading, setLoading] = useState(false);

  const inputClass =
    "h-11 rounded-xl border border-[#DCE3E6] bg-white px-4 text-sm text-[#17313C] outline-none transition focus:border-[#35B8D6] focus:ring-2 focus:ring-[#DDF4F8]";

  const fetchDropdowns = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/audit-logs/filters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDropdownData({
        schools: res.data.schools || [],
        departments: res.data.departments || [],
      });
    } catch (err) {
      console.error("FILTER FETCH ERROR:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/audit-logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });

      setLogs(res.data || []);
    } catch (err) {
      console.error("LOG FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/audit-logs/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });

      setStats(res.data || {});
    } catch (err) {
      console.error("STATS FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchDropdowns();
    fetchLogs();
    fetchStats();
  }, []);

  const applyFilters = () => {
    fetchLogs();
    fetchStats();
  };

  const resetFilters = () => {
    const reset = {
      school: "all",
      department: "all",
      from: "",
      to: "",
    };

    setFilters(reset);

    setTimeout(() => {
      fetchLogs();
      fetchStats();
    }, 0);
  };

  const downloadExcel = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/audit-logs/export/excel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "audit-logs.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("AUDIT EXCEL DOWNLOAD ERROR:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to download audit logs Excel"
      );
    }
  };

  const chartData = useMemo(
    () => [
      { name: "Users", value: stats.userActions || 0 },
      { name: "Publications", value: stats.publicationActions || 0 },
      { name: "Reports", value: stats.reportDownloads || 0 },
    ],
    [stats]
  );

  const StatCard = ({ title, value, color }) => {
  const colorStyles = {
    blue: "from-blue-500/20 to-blue-100 text-blue-600",
    green: "from-green-500/20 to-green-100 text-green-600",
    purple: "from-purple-500/20 to-purple-100 text-purple-600",
    orange: "from-orange-500/20 to-orange-100 text-orange-600",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 border border-[#E5EAF0] bg-white 
      shadow-sm transition-all duration-300 
      hover:-translate-y-1 hover:shadow-md hover:scale-[1.03]`}
    >
      {/* Gradient glow */}
      <div
        className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-gradient-to-br ${colorStyles[color]}`}
      />

      {/* Content */}
      <div className="relative">
        <p className="text-sm text-gray-500">{title}</p>

        <h2 className="mt-2 text-3xl font-bold text-[#17313C]">
          {value}
        </h2>
      </div>
    </div>
  );
};

  return (
    <DashboardLayout>
      <div className="space-y-3">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-apolloBlue">Audit Logs</h1>
          <p className="text-sm text-[#7A878E] mt-1">
            Monitor system activities with filters, statistics, and exports.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 ">
          <StatCard title="Total Logs" value={stats.totalLogs || 0} color="blue" />
          <StatCard title="User Actions" value={stats.userActions || 0} color="green" />
          <StatCard
            title="Publications"
            value={stats.publicationActions || 0}
            color="purple"
          />
          <StatCard
            title="Reports"
            value={stats.reportDownloads || 0}
            color="orange"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#E1E7EA] shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              className={`${inputClass} min-w-[12rem] flex-1`}
              value={filters.school}
              onChange={(e) =>
                setFilters({ ...filters, school: e.target.value })
              }
            >
              <option value="all">All Schools</option>
              {dropdownData.schools.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>

            <select
              className={`${inputClass} min-w-[12rem] flex-1`}
              value={filters.department}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
            >
              <option value="all">All Departments</option>
              {dropdownData.departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <input
              type="date"
              className={`${inputClass} min-w-[12rem] flex-1`}
              value={filters.from}
              onChange={(e) =>
                setFilters({ ...filters, from: e.target.value })
              }
            />

            <input
              type="date"
              className={`${inputClass} min-w-[12rem] flex-1`}
              value={filters.to}
              onChange={(e) =>
                setFilters({ ...filters, to: e.target.value })
              }
            />

            <button
              onClick={applyFilters}
              className="h-11 w-full sm:w-auto rounded-xl bg-apolloBlue text-white px-5 text-sm font-medium hover:bg-[#0C5E78] transition"
            >
              Apply
            </button>

            <button
              onClick={resetFilters}
              className="h-11 w-full sm:w-auto rounded-xl border border-[#DCE3E6] px-5 text-sm font-medium text-[#4E5D66] hover:bg-[#F8FAFB] transition"
            >
              Reset
            </button>

            <button
              onClick={downloadExcel}
              className="h-11 w-full sm:w-auto rounded-xl bg-green-600 text-white px-4 text-sm font-medium hover:bg-green-700 transition"
            >
              Excel
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-[#E1E7EA] shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#17313C] mb-4">
            Audit Activity Overview
          </h2>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1B7F8B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E1E7EA] shadow-sm p-6 overflow-x-auto">
          {loading ? (
            <p className="text-[#7A878E]">Loading audit logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-[#7A878E]">No audit logs found</p>
          ) : (
            <table className="w-full min-w-[1150px] text-sm">
              <thead>
                <tr className="text-left border-b text-[#6F7C83]">
                  <th className="py-3 pr-4">Date</th>
                  <th className="pr-4">Action</th>
                  <th className="pr-4">User</th>
                  <th className="pr-4">Role</th>
                  <th className="pr-4">School</th>
                  <th className="pr-4">Department</th>
                  <th className="pr-4">Type</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b hover:bg-[#F8FAFB] align-top">
                    <td className="py-4 pr-4 whitespace-nowrap text-[#4E5D66]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="pr-4 whitespace-nowrap font-medium text-[#17313C]">
                      {log.action || "-"}
                    </td>

                    <td className="pr-4 whitespace-nowrap">
                      {log.performedBy?.name || "-"}
                    </td>

                    <td className="pr-4 whitespace-nowrap">
                      {log.role || "-"}
                    </td>

                    <td className="pr-4 whitespace-nowrap">
                      {log.school || "-"}
                    </td>

                    <td className="pr-4 whitespace-nowrap">
                      {log.department || "-"}
                    </td>

                    <td className="pr-4 whitespace-nowrap">
                      {log.targetType || "-"}
                    </td>

                    <td className="max-w-[340px] text-[#4E5D66]">
                      <span className="line-clamp-2">{log.details || "-"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, color }) => {
  const colorMap = {
    blue: "text-blue-700 bg-blue-50",
    green: "text-green-700 bg-green-50",
    purple: "text-purple-700 bg-purple-50",
    orange: "text-orange-700 bg-orange-50",
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E1E7EA] shadow-sm p-5">
      <p className="text-sm text-[#7A878E]">{title}</p>
      <div
        className={`inline-flex mt-3 rounded-2xl px-4 py-2 ${colorMap[color]}`}
      >
        <span className="text-3xl font-bold">{value}</span>
      </div>
    </div>
  );
};

export default AuditLogsPage;