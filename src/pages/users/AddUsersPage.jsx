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
      <div className="container-sm">
        <div className="mb-6">
          <h1 className="page-title">Add User</h1>
          <p className="page-subtitle">Create a new RMS user account.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-card form-stack">
          <div className="form-grid-2">
            <div>
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Password *</label>
              <input
                type="text"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter temporary password"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Contact Number *</label>
              <input
                type="text"
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
                required
                placeholder="Enter contact number"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Role *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="form-input"
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
              <label className="form-label">Department *</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                placeholder="Enter department"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">School *</label>
              <input
                type="text"
                name="school"
                value={form.school}
                onChange={handleChange}
                required
                placeholder="Enter school"
                className="form-input"
              />
            </div>
          </div>

          <div className="btn-group-end">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="btn-cancel"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="btn-submit"
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
