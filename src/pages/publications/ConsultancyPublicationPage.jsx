import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://rms-897z.onrender.com";

const emptyAuthor = () => ({
  name: "",
  position: "",
  author_type: "",
});

const Field = ({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder = "",
}) => (
  <div>
    <label className="form-label">
      {label}
      {required ? " *" : ""}
    </label>

    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="form-input"
    />
  </div>
);

const ConsultancyPublicationPage = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    // =====================================================
    // COMMON INFORMATION
    // =====================================================

    institution_organization: "",
    school: "",
    department: user?.department || "",

    title: "",

    // =====================================================
    // CONSULTANCY DETAILS
    // =====================================================

    application_date: "",
    project_value: "",
    client_name: "",
    consultant_assignment_type: "",
    sanctioned_amount: "",
    sanction_date: "",
    duration: "",
    status: "",

    // =====================================================
    // COMMON OPTIONAL INFORMATION
    // =====================================================

    abstract: "",
    keywords: "",
    additional_notes: "",
  });

  const [authors, setAuthors] = useState([
    emptyAuthor(),
  ]);

  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // AUTHOR HANDLING
  // =====================================================

  const handleAuthorChange = (
    index,
    field,
    value
  ) => {
    const updated = [...authors];

    updated[index][field] = value;

    setAuthors(updated);
  };

  const addAuthor = () => {
    setAuthors([
      ...authors,
      emptyAuthor(),
    ]);
  };

  const removeAuthor = (index) => {
    setAuthors(
      authors.filter((_, i) => i !== index)
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload the consultancy document");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      // =====================================================
      // COMMON PUBLICATION DATA
      // =====================================================

      data.append(
        "publication_type",
        "consultancy"
      );

      data.append(
        "title",
        form.title
      );

      data.append(
        "department",
        form.department
      );

      if (form.school) {
        data.append(
          "school",
          form.school
        );
      }

      if (form.institution_organization) {
        data.append(
          "institution_organization",
          form.institution_organization
        );
      }

      // =====================================================
      // AUTHORS
      // =====================================================

      const cleanedAuthors = authors.filter(
        (author) =>
          author.name.trim() ||
          author.author_type.trim() ||
          author.position.trim()
      );

      data.append(
        "authors",
        JSON.stringify(cleanedAuthors)
      );

      // =====================================================
      // CONSULTANCY TYPE DETAILS
      // =====================================================

      const typeDetails = {
        application_date:
          form.application_date,

        project_value:
          form.project_value
            ? Number(form.project_value)
            : null,

        client_name:
          form.client_name,

        consultant_assignment_type:
          form.consultant_assignment_type,

        sanctioned_amount:
          form.sanctioned_amount
            ? Number(form.sanctioned_amount)
            : null,

        sanction_date:
          form.sanction_date || null,

        duration:
          form.duration,

        status:
          form.status,
      };

      data.append(
        "type_details",
        JSON.stringify(typeDetails)
      );

      // =====================================================
      // COMMON OPTIONAL DATA
      // =====================================================

      if (form.abstract) {
        data.append(
          "abstract",
          form.abstract
        );
      }

      if (form.keywords) {
        data.append(
          "keywords",
          JSON.stringify(
            form.keywords
              .split(",")
              .map((keyword) => keyword.trim())
              .filter(Boolean)
          )
        );
      }

      if (form.additional_notes) {
        data.append(
          "additional_notes",
          form.additional_notes
        );
      }

      // =====================================================
      // FILE
      // =====================================================

      data.append(
        "file",
        file
      );

      // =====================================================
      // SUBMIT TO BACKEND
      // =====================================================

      const response = await axios.post(
        `${API_BASE}/api/publications`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ADD CONSULTANCY SUCCESS:",
        response.data
      );

      alert(
        "✅ Consultancy added successfully!"
      );

      navigate("/publications");

    } catch (error) {
      console.error(
        "ADD CONSULTANCY ERROR:",
        error
      );

      console.error(
        "RESPONSE DATA:",
        JSON.stringify(
          error.response?.data,
          null,
          2
        )
      );

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "❌ Failed to create consultancy"
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container-lg max-w-5xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <h1 className="page-title">
            Consultancy
          </h1>

          <p className="page-subtitle">
            Enter the details of your consultancy project
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =====================================================
              COMMON INFORMATION
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Basic Information
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <Field
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter consultancy title"
              />

              <Field
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                placeholder="Enter department"
              />

              <Field
                label="School / Institute"
                name="school"
                value={form.school}
                onChange={handleChange}
                placeholder="Enter school or institute"
              />

              <Field
                label="Institution / Organization"
                name="institution_organization"
                value={
                  form.institution_organization
                }
                onChange={handleChange}
                placeholder="Enter institution"
              />

            </div>

          </section>


          {/* =====================================================
              CONSULTANCY DETAILS
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Consultancy Details
            </h2>

            <div className="grid grid-cols-2 gap-4">

              {/* APPLICATION DATE */}

              <Field
                label="Application Date"
                name="application_date"
                value={form.application_date}
                onChange={handleChange}
                required
                type="date"
              />

              {/* CLIENT NAME */}

              <Field
                label="Client Name"
                name="client_name"
                value={form.client_name}
                onChange={handleChange}
                required
                placeholder="Enter client name"
              />

              {/* PROJECT VALUE */}

              <Field
                label="Project Value"
                name="project_value"
                value={form.project_value}
                onChange={handleChange}
                type="number"
                placeholder="Enter project value"
              />

              {/* ASSIGNMENT TYPE */}

              <div>

                <label className="form-label">
                  Consultant Assignment Type *
                </label>

                <select
                  name="consultant_assignment_type"
                  value={
                    form.consultant_assignment_type
                  }
                  onChange={handleChange}
                  required
                  className="form-input"
                >

                  <option value="">
                    Select assignment type
                  </option>

                  <option value="Testing">
                    Testing
                  </option>

                  <option value="Project">
                    Project
                  </option>

                </select>

              </div>


              {/* SANCTIONED AMOUNT */}

              <Field
                label="Sanctioned Amount"
                name="sanctioned_amount"
                value={form.sanctioned_amount}
                onChange={handleChange}
                type="number"
                placeholder="Enter sanctioned amount"
              />


              {/* SANCTION DATE */}

              <Field
                label="Sanction Date"
                name="sanction_date"
                value={form.sanction_date}
                onChange={handleChange}
                type="date"
              />


              {/* DURATION */}

              <Field
                label="Duration"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g. 6 months"
              />


              {/* STATUS */}

              <div>

                <label className="form-label">
                  Status *
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="form-input"
                >

                  <option value="">
                    Select status
                  </option>

                  <option value="Applied">
                    Applied
                  </option>

                  <option value="Ongoing">
                    Ongoing
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>

            </div>

          </section>


          {/* =====================================================
              AUTHORS
          ===================================================== */}

          <section className="form-section">

            <div className="flex justify-between items-center mb-4">

              <h2 className="section-heading">
                Authors *
              </h2>

              <button
                type="button"
                onClick={addAuthor}
                className="btn-add-soft"
              >
                + Add Author
              </button>

            </div>

            <div className="space-y-4">

              {authors.map(
                (author, index) => (

                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 items-end p-4 bg-gray-50 rounded-lg"
                  >

                    {/* AUTHOR NAME */}

                    <Field
                      label="Author Name"
                      value={author.name}
                      onChange={(e) =>
                        handleAuthorChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      required
                      placeholder="Enter author name"
                    />


                    {/* POSITION */}

                    <Field
                      label="Position"
                      type="number"
                      value={author.position}
                      onChange={(e) =>
                        handleAuthorChange(
                          index,
                          "position",
                          e.target.value
                        )
                      }
                      required
                      placeholder="e.g. 1"
                    />


                    {/* REMOVE */}

                    <div>

                      {authors.length > 1 && (

                        <button
                          type="button"
                          onClick={() =>
                            removeAuthor(index)
                          }
                          className="btn-remove"
                        >
                          Remove
                        </button>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* =====================================================
              ABSTRACT & KEYWORDS
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Abstract & Keywords
            </h2>

            <div className="space-y-4">

              {/* ABSTRACT */}

              <div>

                <label className="form-label">
                  Abstract
                </label>

                <textarea
                  name="abstract"
                  value={form.abstract}
                  onChange={handleChange}
                  placeholder="Enter abstract (maximum 350 words)"
                  className="form-input form-textarea"
                  rows="5"
                />

              </div>


              {/* KEYWORDS */}

              <div>

                <label className="form-label">
                  Keywords
                </label>

                <input
                  name="keywords"
                  value={form.keywords}
                  onChange={handleChange}
                  placeholder="Enter keywords separated by commas"
                  className="form-input"
                />

              </div>

            </div>

          </section>


          {/* =====================================================
              ADDITIONAL INFORMATION
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Additional Information
            </h2>

            <textarea
              name="additional_notes"
              value={form.additional_notes}
              onChange={handleChange}
              placeholder="Any additional information"
              className="form-input form-textarea"
              rows="4"
            />

          </section>


          {/* =====================================================
              FILE UPLOAD
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Upload Consultancy Document
            </h2>

            <input
              type="file"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
              accept=".pdf,.doc,.docx"
              required
              className="form-input"
            />

          </section>


          {/* =====================================================
              BUTTONS
          ===================================================== */}

          <div className="flex justify-end gap-4 pb-8">

            <button
              type="button"
              onClick={() =>
                navigate("/publications/add")
              }
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
            >
              {submitting
                ? "Submitting..."
                : "Submit Consultancy"}
            </button>

          </div>

        </form>

      </div>
    </DashboardLayout>
  );
};

export default ConsultancyPublicationPage;