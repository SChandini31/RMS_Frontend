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

  return (
    <DashboardLayout>
      <div className="space-y-3">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">
            Monitor system activities with filters, statistics, and exports.
          </p>
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

        <div className="content-card table-wrapper">
          {loading ? (
            <p className="text-muted">Loading audit logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-muted">No audit logs found</p>
          ) : (
            <table className="data-table data-table--wide">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>School</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td className="cell-nowrap" style={{ color: "#4E5D66" }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="cell-primary">{log.action || "-"}</td>

                    <td className="cell-nowrap">
                      {log.performedBy?.name || "-"}
                    </td>

                    <td className="cell-nowrap">{log.role || "-"}</td>

                    <td className="cell-nowrap">{log.school || "-"}</td>

                    <td className="cell-nowrap">{log.department || "-"}</td>

                    <td className="cell-nowrap">{log.targetType || "-"}</td>

                    <td className="cell-detail">
                      <span className="line-clamp-2">{log.details || "-"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} logs
            </div>

            <div className="pagination-controls">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="pagination-nav-btn"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={
                    page === currentPage
                      ? "pagination-page-btn pagination-page-btn--active"
                      : "pagination-page-btn"
                  }
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="pagination-nav-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AuditLogsPage;
