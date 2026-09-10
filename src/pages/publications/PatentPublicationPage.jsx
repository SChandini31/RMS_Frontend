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

const PatentPublicationPage = () => {
  const navigate = useNavigate();
  const notify = useNotificationMessage();

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
    // PATENT DETAILS
    // =====================================================

    application_date: "",
    application_number: "",
    patent_type: "",
    patent_status: "",
    publication_date: "",
    granted_date: "",

    is_commercialized: false,
    commercialization_details: "",

    patent_url: "",
    technology_transfer_status: "",
    licensing_status: "",
    revenue_generated: "",
    industrial_adoption: "",

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
  // HANDLE CHECKBOX
  // =====================================================

  const handleCommercializationChange = (e) => {
    setForm({
      ...form,
      is_commercialized: e.target.checked,
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
      notify("Please upload the patent document.", null, "Validation Required");
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
        "patent"
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
      // PATENT TYPE DETAILS
      // =====================================================

      const typeDetails = {
        application_date:
          form.application_date,

        application_number:
          form.application_number,

        patent_type:
          form.patent_type,

        patent_status:
          form.patent_status,

        publication_date:
          form.publication_date || null,

        granted_date:
          form.granted_date || null,

        commercialization: {
          is_commercialized:
            form.is_commercialized,

          details:
            form.commercialization_details || "",
        },

        patent_url:
          form.patent_url || "",

        technology_transfer_status:
          form.technology_transfer_status || "",

        licensing_status:
          form.licensing_status || "",

        revenue_generated:
          form.revenue_generated
            ? Number(form.revenue_generated)
            : null,

        industrial_adoption:
          form.industrial_adoption || "",
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
        "ADD PATENT SUCCESS:",
        response.data
      );

      notify("The patent publication was successfully created.", null, "Publication Created");

      navigate("/publications");

    } catch (error) {
      console.error(
        "ADD PATENT ERROR:",
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

      notify(error, "Unable to create the patent publication. Please try again.", "Publication Creation Failed");

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
            Patent
          </h1>

          <p className="page-subtitle">
            Enter the details of your patent
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
                label="Title of the Patent"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter patent title"
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
              PATENT DETAILS
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Patent Details
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


              {/* APPLICATION NUMBER */}

              <Field
                label="Application Number"
                name="application_number"
                value={form.application_number}
                onChange={handleChange}
                required
                placeholder="Enter application number"
              />


              {/* PATENT TYPE */}

              <Field
                label="Patent Type"
                name="patent_type"
                value={form.patent_type}
                onChange={handleChange}
                required
                placeholder="Enter patent type"
              />


              {/* PATENT STATUS */}

              <Field
                label="Patent Status"
                name="patent_status"
                value={form.patent_status}
                onChange={handleChange}
                required
                placeholder="Enter patent status"
              />


              {/* PUBLICATION DATE */}

              <Field
                label="Publication Date"
                name="publication_date"
                value={form.publication_date}
                onChange={handleChange}
                type="date"
              />


              {/* GRANTED DATE */}

              <Field
                label="Granted Date"
                name="granted_date"
                value={form.granted_date}
                onChange={handleChange}
                type="date"
              />

            </div>

          </section>


          {/* =====================================================
              COMMERCIALIZATION
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Commercialization
            </h2>

            <div className="space-y-4">

              {/* COMMERCIALIZED CHECKBOX */}

              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  name="is_commercialized"
                  checked={
                    form.is_commercialized
                  }
                  onChange={
                    handleCommercializationChange
                  }
                  className="w-4 h-4"
                />

                <label className="form-label mb-0">
                  Is the patent commercialized?
                </label>

              </div>


              {/* COMMERCIALIZATION DETAILS */}

              {form.is_commercialized && (

                <div>

                  <label className="form-label">
                    Commercialization Details
                  </label>

                  <textarea
                    name="commercialization_details"
                    value={
                      form.commercialization_details
                    }
                    onChange={handleChange}
                    placeholder="Enter commercialization details"
                    className="form-input form-textarea"
                    rows="4"
                  />

                </div>

              )}

            </div>

          </section>


          {/* =====================================================
              TECHNOLOGY TRANSFER & LICENSING
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Technology Transfer & Licensing
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <Field
                label="Patent URL"
                name="patent_url"
                value={form.patent_url}
                onChange={handleChange}
                type="url"
                placeholder="https://..."
              />


              <Field
                label="Technology Transfer Status"
                name="technology_transfer_status"
                value={
                  form.technology_transfer_status
                }
                onChange={handleChange}
                placeholder="Enter technology transfer status"
              />


              <Field
                label="Licensing Status"
                name="licensing_status"
                value={form.licensing_status}
                onChange={handleChange}
                placeholder="Enter licensing status"
              />


              <Field
                label="Revenue Generated"
                name="revenue_generated"
                value={form.revenue_generated}
                onChange={handleChange}
                type="number"
                placeholder="Enter revenue generated"
              />


              <Field
                label="Industrial Adoption"
                name="industrial_adoption"
                value={form.industrial_adoption}
                onChange={handleChange}
                placeholder="Enter industrial adoption details"
              />

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
              Upload Patent Document
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
                : "Submit Patent"}
            </button>

          </div>

        </form>

      </div>

    </DashboardLayout>
  );
};

export default PatentPublicationPage;