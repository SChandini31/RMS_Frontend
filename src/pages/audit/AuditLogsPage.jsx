import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { useNotificationMessage } from "../../utils/useNotificationMessage";
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

const RING_CLASS = {
  blue: "audit-stat-ring--blue",
  green: "audit-stat-ring--green",
  purple: "audit-stat-ring--purple",
  orange: "audit-stat-ring--orange",
};

const StatCard = ({ title, value, color }) => (
  <div className="audit-stat-card">
    <div className={`audit-stat-ring ${RING_CLASS[color] || ""}`} />
    <div className="relative">
      <p className="audit-stat-label">{title}</p>
      <h2 className="audit-stat-value">{value}</h2>
    </div>
  </div>
);

const AuditLogsPage = () => {
  const notify = useNotificationMessage();
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

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
      notify(err, "Unable to load audit log filters. Please try again.", "Audit Request Failed");
    }
  };

  const fetchLogs = async (pageToUse = currentPage) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/audit-logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...filters,
          page: pageToUse,
          limit: 10,
        },
      });

      const responseData = res.data || {};
      const resultLogs = Array.isArray(responseData.logs)
        ? responseData.logs
        : Array.isArray(responseData)
        ? responseData
        : [];

      setLogs(resultLogs);
      setPagination(
        responseData.pagination || {
          currentPage: pageToUse,
          pageSize: 10,
          totalItems: resultLogs.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: pageToUse > 1,
        }
      );
    } catch (err) {
      console.error("LOG FETCH ERROR:", err);
      notify(err, "Unable to load audit logs. Please try again.", "Audit Request Failed");
      setLogs([]);
      setPagination({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
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
      notify(err, "Unable to load audit statistics. Please try again.", "Audit Request Failed");
    }
  };

  useEffect(() => {
    fetchDropdowns();
    fetchLogs(currentPage);
    fetchStats();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchLogs(page);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchLogs(1);
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
    setCurrentPage(1);

    setTimeout(() => {
      fetchLogs(1);
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
      notify("The audit log report was downloaded successfully.", null, "Excel Downloaded");
    } catch (err) {
      console.error("AUDIT EXCEL DOWNLOAD ERROR:", err);
      notify(err, "Unable to download the Excel report. Please try again.", "Excel Export Failed");
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

  return (
    <DashboardLayout>
      <div className="space-y-3">
        <div className="page-header">
          <div className="page-header-col">
            <h1 className="page-title">Audit Logs</h1>
            <p className="page-subtitle">
              Monitor system activities with filters, statistics, and exports.
            </p>
          </div>

          <Link to="/audit-logs/logs" className="btn-primary-sm">
            Logs
          </Link>
        </div>

        <div className="grid-stats-audit">
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

        <div className="content-card panel-sm">
          <div className="filter-bar">
            <select
              className="form-input-filter"
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
              className="form-input-filter"
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
              className="form-input-filter"
              value={filters.from}
              onChange={(e) =>
                setFilters({ ...filters, from: e.target.value })
              }
            />

            <input
              type="date"
              className="form-input-filter"
              value={filters.to}
              onChange={(e) =>
                setFilters({ ...filters, to: e.target.value })
              }
            />

            <button type="button" onClick={applyFilters} className="btn-filter">
              Apply
            </button>

            <button type="button" onClick={resetFilters} className="btn-reset">
              Reset
            </button>

            <button type="button" onClick={downloadExcel} className="btn-excel">
              Excel
            </button>
          </div>
        </div>

        <div className="content-card">
          <h2 className="section-heading">Audit Activity Overview</h2>

          <div className="chart-container-sm">
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

      </div>
    </DashboardLayout>
  );
};

export default AuditLogsPage;
