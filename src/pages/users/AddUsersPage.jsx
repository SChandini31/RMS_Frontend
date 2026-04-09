import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://rms-897z.onrender.com";

const AddUsersPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
    school: "",
    contact_number: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-2xl border border-[#DCE3E6] bg-white px-4 py-3 text-sm text-[#17313C] outline-none transition focus:border-[#35B8D6] focus:ring-4 focus:ring-[#DDF4F8] placeholder:text-[#9AA7AE]";

  const labelClass = "block text-sm font-semibold text-[#4E5D66] mb-2";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentUser?.role !== "super_admin") {
      alert("Only super admin can add users");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role.trim(),
        department: form.department.trim(),
        school: form.school.trim(),
        contact_number: form.contact_number.trim(),
      };

      const res = await axios.post(`${API_BASE}/api/users`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data?.message || "✅ User created successfully");
      navigate("/users");
    } catch (error) {
      console.error("ADD USER ERROR:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "❌ Failed to create user"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-apolloBlue">Add User</h1>
          <p className="text-sm text-[#7A878E] mt-1">
            Create a new RMS user account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E1E7EA] shadow-sm p-6 space-y-7"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Password *</label>
              <input
                type="text"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter temporary password"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Contact Number *</label>
              <input
                type="text"
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
                required
                placeholder="Enter contact number"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Role *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select role</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="faculty">Faculty</option>
                <option value="student">Student</option>
                <option value="directorate">Directorate</option>
                <option value="special_user">Special User</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Department *</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                placeholder="Enter department"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>School *</label>
              <input
                type="text"
                name="school"
                value={form.school}
                onChange={handleChange}
                required
                placeholder="Enter school"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="px-6 py-3 rounded-2xl border border-[#DCE3E6] text-[#4E5D66] transition-all duration-300 hover:bg-[#F8FAFB] hover:shadow-sm active:scale-95"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-2xl bg-apolloBlue text-white font-semibold transition-all duration-300 hover:bg-[#0C5E78] hover:shadow-md hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {submitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddUsersPage;