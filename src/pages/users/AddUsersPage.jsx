import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotificationMessage } from "../../utils/useNotificationMessage";

const API_BASE = "https://rms-897z.onrender.com";

// ============================================================
// SCHOOLS
// These must match the schools configured in RMS
// ============================================================

const schools = [
  "School of Technology",
  "School of Management",
  "Apollo Institute of Pharmaceutical Sciences",
  "School of Health Sciences",
  "School of Social Science",
];

const roles = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "faculty", label: "Faculty" },
  { value: "student", label: "Student" },
  { value: "directorate", label: "Directorate" },
  { value: "special_user", label: "Special User" },
];

const AddUsersPage = () => {
  const navigate = useNavigate();
  const notify = useNotificationMessage();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: [],
    department: "",
    school: "",
    contact_number: "",
    organization_institution: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      role: checked
        ? [...prev.role, value]
        : prev.role.filter((role) => role !== value),
    }));
  };

  // ============================================================
  // HANDLE SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUserRoles = Array.isArray(currentUser?.role)
      ? currentUser.role
      : [currentUser?.role];

    if (!currentUserRoles.includes("super_admin")) {
      notify("Only a super admin can add users.", null, "Action Required");
      return;
    }

    if (form.role.length === 0) {
      notify("Select at least one role.", null, "Validation Required");
      return;
    }

    if (!form.organization_institution.trim()) {
      notify("Enter an organization or institution.", null, "Validation Required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        department: form.department.trim(),
        school: form.school.trim(),
        contact_number: Number(form.contact_number),
        organization_institution: form.organization_institution.trim(),
      };

      await axios.post(`${API_BASE}/api/users`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notify("The user account was successfully created.", null, "User Created");

      navigate("/users");
    } catch (error) {
      console.error("ADD USER ERROR:", error);

      notify(error, "Unable to create the user. Please try again.", "User Creation Failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <DashboardLayout>
      <div className="container-sm">
        <div className="mb-6">
          <h1 className="page-title">Add User</h1>

          <p className="page-subtitle">
            Create a new RMS user account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-card form-stack">
          <div className="form-grid-2">

            {/* =====================================================
                NAME
            ====================================================== */}

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

            {/* =====================================================
                EMAIL
            ====================================================== */}

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

            {/* =====================================================
                PASSWORD
            ====================================================== */}

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

            {/* =====================================================
                CONTACT NUMBER
            ====================================================== */}

            <div>
              <label className="form-label">Contact Number *</label>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
                required
                placeholder="Enter contact number"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Organization / Institution *</label>

              <input
                type="text"
                name="organization_institution"
                value={form.organization_institution}
                onChange={handleChange}
                required
                placeholder="Enter organization or institution"
                className="form-input"
              />
            </div>

            {/* =====================================================
                ROLE
            ====================================================== */}

            <div className="role-field">
              <span className="form-label">Role *</span>

              <div className="role-checkbox-group">
                {roles.map((role) => (
                  <label key={role.value} className="role-checkbox-label">
                    <input
                      type="checkbox"
                      name="role"
                      value={role.value}
                      checked={form.role.includes(role.value)}
                      onChange={handleRoleChange}
                    />
                    <span>{role.label}</span>
                  </label>
                ))}
              </div>

              <input
                type="text"
                value={form.role.length ? form.role.join(", ") : ""}
                required
                tabIndex={-1}
                aria-hidden="true"
                className="role-validation-input"
                onChange={() => {}}
              />
            </div>

            {/* =====================================================
                DEPARTMENT
            ====================================================== */}

            <div>
              <label className="form-label">Department / Programme *</label>

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

            {/* =====================================================
                SCHOOL DROPDOWN
            ====================================================== */}

            <div>
              <label className="form-label">School *</label>

              <select
                name="school"
                value={form.school}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select school</option>

                {schools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* =====================================================
              BUTTONS
          ====================================================== */}

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