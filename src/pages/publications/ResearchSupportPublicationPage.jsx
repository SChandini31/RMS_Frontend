import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotificationMessage } from "../../utils/useNotificationMessage";

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

const ResearchSupportPublicationPage = () => {
  const navigate = useNavigate();
  const notify = useNotificationMessage();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // =====================================================
  // FORM STATE
  // =====================================================

  const [form, setForm] = useState({
    // =====================================================
    // COMMON INFORMATION
    // =====================================================

    institution_organization: "",
    school: "",
    department: user?.department || "",

    title: "",

    // =====================================================
    // RESEARCH SUPPORT DETAILS
    // =====================================================

    support_type: "",
    support_provided_by: "",
    year: "",
    outcome_impact: "",

    // =====================================================
    // COMMON OPTIONAL INFORMATION
    // =====================================================

    abstract: "",
    keywords: "",
    additional_notes: "",
  });

  // =====================================================
  // AUTHORS
  // =====================================================

  const [authors, setAuthors] = useState([
    emptyAuthor(),
  ]);

  // =====================================================
  // FILE
  // =====================================================

  const [file, setFile] = useState(null);

  // =====================================================
  // SUBMITTING
  // =====================================================

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
  // AUTHOR CHANGE
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

  // =====================================================
  // ADD AUTHOR
  // =====================================================

  const addAuthor = () => {
    setAuthors([
      ...authors,
      emptyAuthor(),
    ]);
  };

  // =====================================================
  // REMOVE AUTHOR
  // =====================================================

  const removeAuthor = (index) => {
    setAuthors(
      authors.filter(
        (_, i) => i !== index
      )
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      notify("Please upload the research support document.", null, "Validation Required");
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
        "research_support"
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
        JSON.stringify(
          cleanedAuthors
        )
      );

      // =====================================================
      // RESEARCH SUPPORT TYPE DETAILS
      // =====================================================

      const typeDetails = {
        support_type:
          form.support_type,

        support_provided_by:
          form.support_provided_by,

        year:
          form.year
            ? Number(form.year)
            : null,

        outcome_impact:
          form.outcome_impact || "",
      };

      data.append(
        "type_details",
        JSON.stringify(
          typeDetails
        )
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
              .map((keyword) =>
                keyword.trim()
              )
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
        "ADD RESEARCH SUPPORT SUCCESS:",
        response.data
      );

      notify("The research support publication was successfully created.", null, "Publication Created");

      navigate("/publications");

    } catch (error) {
      console.error(
        "ADD RESEARCH SUPPORT ERROR:",
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

      notify(error, "Unable to create the research support publication. Please try again.", "Publication Creation Failed");

    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <DashboardLayout>

      <div className="container-lg max-w-5xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <h1 className="page-title">
            Research Support
          </h1>

          <p className="page-subtitle">
            Enter the details of your research support
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =====================================================
              BASIC INFORMATION
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
                placeholder="Enter research support title"
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
              RESEARCH SUPPORT DETAILS
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Research Support Details
            </h2>

            <div className="grid grid-cols-2 gap-4">

              {/* SUPPORT TYPE */}

              <div>

                <label className="form-label">
                  Support Type *
                </label>

                <select
                  name="support_type"
                  value={
                    form.support_type
                  }
                  onChange={handleChange}
                  required
                  className="form-input"
                >

                  <option value="">
                    Select support type
                  </option>

                  <option value="Seed Grant">
                    Seed Grant
                  </option>

                  <option value="APC">
                    APC
                  </option>

                  <option value="Travel Grant">
                    Travel Grant
                  </option>

                  <option value="FDP">
                    FDP
                  </option>

                  <option value="Workshop">
                    Workshop
                  </option>

                </select>

              </div>


              {/* SUPPORT PROVIDED BY */}

              <div>

                <label className="form-label">
                  Support Provided By *
                </label>

                <select
                  name="support_provided_by"
                  value={
                    form.support_provided_by
                  }
                  onChange={handleChange}
                  required
                  className="form-input"
                >

                  <option value="">
                    Select provider
                  </option>

                  <option value="University">
                    University
                  </option>

                  <option value="External Agency">
                    External Agency
                  </option>

                </select>

              </div>


              {/* YEAR */}

              <Field
                label="Year"
                name="year"
                value={form.year}
                onChange={handleChange}
                required
                type="number"
                placeholder="Enter year"
              />

            </div>

          </section>


          {/* =====================================================
              OUTCOME / IMPACT
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Outcome / Impact
            </h2>

            <textarea
              name="outcome_impact"
              value={
                form.outcome_impact
              }
              onChange={handleChange}
              placeholder="Describe the outcome or impact of the research support"
              className="form-input form-textarea"
              rows="5"
            />

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

                    <Field
                      label="Position"
                      type="number"
                      value={
                        author.position
                      }
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
                  value={
                    form.abstract
                  }
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
                  value={
                    form.keywords
                  }
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
              value={
                form.additional_notes
              }
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
              Upload Research Support Document
            </h2>

            <input
              type="file"
              onChange={(e) =>
                setFile(
                  e.target.files[0]
                )
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
                navigate(
                  "/publications/add"
                )
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
                : "Submit Research Support"}
            </button>

          </div>

        </form>

      </div>

    </DashboardLayout>
  );
};

export default ResearchSupportPublicationPage;