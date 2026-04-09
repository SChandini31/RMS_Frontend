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

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Users response:", res.data);
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
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-apolloBlue">Users</h1>
          <p className="text-sm text-[#7A878E] mt-1">
            {currentUser?.role === "super_admin"
              ? "Manage all RMS users"
              : "Department-wise users overview"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <div
              className={`flex items-center overflow-hidden border border-[#E1E7EA] bg-white rounded-xl transition-all duration-300 ${
                showSearch ? "w-64 px-3" : "w-10 px-0"
              }`}
            >
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className="p-2 shrink-0 text-[#17313C]"
                title="Search users"
              >
                <Search size={18} />
              </button>

              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`bg-transparent outline-none text-sm text-[#17313C] transition-all duration-300 ${
                  showSearch ? "opacity-100 ml-2 w-full" : "opacity-0 w-0"
                }`}
              />
            </div>
          </div>

          {currentUser?.role === "super_admin" && (
            <Link
              to="/users/add"
              className="bg-apolloBlue text-white px-4 py-2 rounded-xl transition-all duration-300 hover:bg-[#163e56] hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              Add User
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow border border-apolloBorder overflow-x-auto">
        {!loading && (
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-[#7A878E]">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        )}

        {loading ? (
          <p className="text-[#7A878E]">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-[#98A4AA]">No users found</p>
        ) : (
          <table className="w-full min-w-[1150px] text-sm">
            <thead>
              <tr className="text-left text-[#6F7C83] border-b">
                <th className="py-3 pr-4">Name</th>
                <th className="pr-4">Email</th>
                <th className="pr-4">Contact Number</th>
                <th className="pr-4">Role</th>
                <th className="pr-4">Department</th>
                <th className="pr-4">School</th>
                <th className="pr-4">Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-[#F4F8FA] transition-all duration-200"
                >
                  <td className="py-3 pr-4 font-medium text-[#17313C] whitespace-nowrap">
                    {user.name || "-"}
                  </td>
                  <td className="pr-4 whitespace-nowrap">{user.email || "-"}</td>
                  <td className="pr-4 whitespace-nowrap">
                    {user.contact_number || "-"}
                  </td>
                  <td className="pr-4 capitalize whitespace-nowrap">
                    {user.role?.replace("_", " ") || "-"}
                  </td>
                  <td className="pr-4 whitespace-nowrap">{user.department || "-"}</td>
                  <td className="pr-4 whitespace-nowrap">{user.school || "-"}</td>
                  <td className="pr-4 whitespace-nowrap">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap">
                    {currentUser?.role === "super_admin" ? (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 text-xs font-medium transition-all duration-200 hover:text-red-700 hover:underline hover:scale-105 active:scale-95"
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