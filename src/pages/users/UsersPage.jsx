import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";

const API_BASE = "https://rms-897z.onrender.com";

const UsersPage = () => {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchUsers = async (pageToUse = currentPage) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: pageToUse,
          limit: 10,
        },
      });

      const responseData = res.data || {};
      const responseUsers = Array.isArray(responseData.users)
        ? responseData.users
        : Array.isArray(responseData)
        ? responseData
        : [];

      setUsers(responseUsers);
      setPagination(
        responseData.pagination || {
          currentPage: pageToUse,
          pageSize: 10,
          totalItems: responseUsers.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: pageToUse > 1,
        }
      );
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load users"
      );
      setUsers([]);
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

  useEffect(() => {
    fetchUsers(currentPage);
  }, []);

  const handleDelete = async (id) => {
    if (currentUser?.role !== "super_admin") return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_BASE}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers(currentPage);
    } catch (error) {
      console.error("DELETE USER ERROR:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete user"
      );
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchUsers(page);
    }
  };

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return users;

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.role?.toLowerCase().includes(search) ||
        user.department?.toLowerCase().includes(search) ||
        user.school?.toLowerCase().includes(search) ||
        user.contact_number?.toLowerCase().includes(search)
      );
    });
  }, [users, searchTerm]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-col">
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">
            {currentUser?.role === "super_admin"
              ? "Manage all RMS users"
              : "Department-wise users overview"}
          </p>
        </div>

        <div className="btn-group">
          <div className="btn-group">
            <div className={`search-box${showSearch ? " expanded" : ""}`}>
              <button
                type="button"
                onClick={() => setShowSearch((prev) => !prev)}
                className="search-toggle"
                title="Search users"
              >
                <Search size={18} />
              </button>

              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {currentUser?.role === "super_admin" && (
            <Link to="/users/add" className="btn-primary-sm">
              Add User
            </Link>
          )}
        </div>
      </div>

      <div className="content-card table-wrapper">
        {!loading && (
          <div className="table-meta">
            <p className="table-meta-text">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        )}

        {loading ? (
          <p className="text-muted">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-muted-light">No users found</p>
        ) : (
          <table className="data-table data-table--wide">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Role</th>
                <th>Department</th>
                <th>School</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="cell-primary">{user.name || "-"}</td>
                  <td className="cell-nowrap">{user.email || "-"}</td>
                  <td className="cell-nowrap">
                    {user.contact_number || "-"}
                  </td>
                  <td className="cell-capitalize">
                    {user.role?.replace("_", " ") || "-"}
                  </td>
                  <td className="cell-nowrap">{user.department || "-"}</td>
                  <td className="cell-nowrap">{user.school || "-"}</td>
                  <td className="cell-nowrap">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="cell-nowrap">
                    {currentUser?.role === "super_admin" ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(user._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="cell-muted">View only</span>
                    )}
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
            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} users
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
    </DashboardLayout>
  );
};

export default UsersPage;
