import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://rms-897z.onrender.com";
// const API_BASE = "https://rms-897z.onrender.com";

const UsersPage = () => {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data || []);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

      fetchUsers();
    } catch (error) {
      console.error("DELETE USER ERROR:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete user"
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-apolloBlue">Users</h1>
          <p className="text-sm text-[#7A878E] mt-1">
            {currentUser?.role === "super_admin"
              ? "Manage all RMS users"
              : "Department-wise users overview"}
          </p>
        </div>

        {currentUser?.role === "super_admin" && (
          <Link
            to="/users/add"
            className="bg-apolloBlue text-white px-4 py-2 rounded-xl"
          >
            Add User
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow border border-apolloBorder overflow-x-auto">
        {loading ? (
          <p className="text-[#7A878E]">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-[#98A4AA]">No users found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#6F7C83] border-b">
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>School</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-[#F7F8F8]">
                  <td className="py-3 font-medium text-[#17313C]">
                    {user.name || "-"}
                  </td>
                  <td>{user.email || "-"}</td>
                  <td className="capitalize">
                    {user.role?.replace("_", " ") || "-"}
                  </td>
                  <td>{user.department || "-"}</td>
                  <td>{user.school || "-"}</td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {currentUser?.role === "super_admin" ? (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-[#98A4AA] text-xs">View only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;