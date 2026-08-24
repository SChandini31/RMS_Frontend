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

const ResearchCollaborationPage = () => {
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
    // RESEARCH COLLABORATION DETAILS
    // =====================================================

    collaborator_name: "",
    collaborator_organization: "",
    collaborator_country: "",

    pi_name: "",
    pi_designation: "",

    nature_of_collaboration: "",
    collaboration_type: "",

    research_area_project_title: "",

    collaboration_status: "",

    collaboration_proposed_date: "",
    funding: "",

    collaboration_start_date: "",
    collaboration_end_date: "",

    supporting_document_available: false,

    status: "",

    collaboration_outcomes: [],
    other_outcome_details: "",

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
  // CHECKBOX HANDLERS
  // =====================================================

  const handleSupportingDocumentChange = (e) => {
    setForm({
      ...form,
      supporting_document_available:
        e.target.checked,
    });
  };

  // =====================================================
  // OUTCOME HANDLING
  // =====================================================

  const handleOutcomeChange = (outcome) => {
    const currentOutcomes =
      form.collaboration_outcomes;

    if (currentOutcomes.includes(outcome)) {
      setForm({
        ...form,
        collaboration_outcomes:
          currentOutcomes.filter(
            (item) => item !== outcome
          ),
      });
    } else {
      setForm({
        ...form,
        collaboration_outcomes: [
          ...currentOutcomes,
          outcome,
        ],
      });
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert(
        "Please upload the collaboration document"
      );
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
        "research_collaboration"
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
      // RESEARCH COLLABORATION TYPE DETAILS
      // =====================================================

      const typeDetails = {
        collaborator_name:
          form.collaborator_name,

        collaborator_organization:
          form.collaborator_organization,

        collaborator_country:
          form.collaborator_country,

        pi_name:
          form.pi_name,

        pi_designation:
          form.pi_designation,

        nature_of_collaboration:
          form.nature_of_collaboration,

        collaboration_type:
          form.collaboration_type,

        research_area_project_title:
          form.research_area_project_title,

        collaboration_status:
          form.collaboration_status,

        collaboration_proposed_date:
          form.collaboration_proposed_date ||
          null,

        funding:
          form.funding || "",

        collaboration_start_date:
          form.collaboration_start_date ||
          null,

        collaboration_end_date:
          form.collaboration_end_date ||
          null,

        supporting_document_available:
          form.supporting_document_available,

        status:
          form.status || null,

        collaboration_outcomes:
          form.collaboration_outcomes,

        other_outcome_details:
          form.other_outcome_details || "",
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
      // SUBMIT
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
        "ADD RESEARCH COLLABORATION SUCCESS:",
        response.data
      );

      alert(
        "✅ Research collaboration added successfully!"
      );

      navigate("/publications");

    } catch (error) {
      console.error(
        "ADD RESEARCH COLLABORATION ERROR:",
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
        "❌ Failed to create research collaboration"
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
            Research Collaboration
          </h1>

          <p className="page-subtitle">
            Enter the details of your research collaboration
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
                placeholder="Enter collaboration title"
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
              COLLABORATOR INFORMATION
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Collaborator Information
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <Field
                label="Collaborator Name"
                name="collaborator_name"
                value={form.collaborator_name}
                onChange={handleChange}
                required
                placeholder="Enter collaborator name"
              />

              <Field
                label="Collaborator Organization"
                name="collaborator_organization"
                value={
                  form.collaborator_organization
                }
                onChange={handleChange}
                required
                placeholder="Enter organization"
              />

              <Field
                label="Collaborator Country"
                name="collaborator_country"
                value={
                  form.collaborator_country
                }
                onChange={handleChange}
                required
                placeholder="Enter country"
              />

              <Field
                label="PI Name"
                name="pi_name"
                value={form.pi_name}
                onChange={handleChange}
                required
                placeholder="Enter Principal Investigator name"
              />

              <Field
                label="PI Designation"
                name="pi_designation"
                value={form.pi_designation}
                onChange={handleChange}
                required
                placeholder="Enter PI designation"
              />

            </div>

          </section>


          {/* =====================================================
              COLLABORATION DETAILS
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Collaboration Details
            </h2>

            <div className="grid grid-cols-2 gap-4">

              {/* NATURE */}

              <div>

                <label className="form-label">
                  Nature of Collaboration *
                </label>

                <select
                  name="nature_of_collaboration"
                  value={
                    form.nature_of_collaboration
                  }
                  onChange={handleChange}
                  required
                  className="form-input"
                >

                  <option value="">
                    Select nature
                  </option>

                  <option value="Project">
                    Project
                  </option>

                  <option value="Publication">
                    Publication
                  </option>

                  <option value="Patent">
                    Patent
                  </option>

                </select>

              </div>


              {/* COLLABORATION TYPE */}

              <div>

                <label className="form-label">
                  Collaboration Type *
                </label>

                <select
                  name="collaboration_type"
                  value={
                    form.collaboration_type
                  }
                  onChange={handleChange}
                  required
                  className="form-input"
                >

                  <option value="">
                    Select collaboration type
                  </option>

                  <option value="National">
                    National
                  </option>

                  <option value="International">
                    International
                  </option>

                  <option value="Industry">
                    Industry
                  </option>

                  <option value="Academic">
                    Academic
                  </option>

                </select>

              </div>


              {/* RESEARCH AREA / PROJECT TITLE */}

              <Field
                label="Research Area / Project Title"
                name="research_area_project_title"
                value={
                  form.research_area_project_title
                }
                onChange={handleChange}
                required
                placeholder="Enter research area or project title"
              />


              {/* COLLABORATION STATUS */}

              <div>

                <label className="form-label">
                  Collaboration Status *
                </label>

                <select
                  name="collaboration_status"
                  value={
                    form.collaboration_status
                  }
                  onChange={handleChange}
                  required
                  className="form-input"
                >

                  <option value="">
                    Select collaboration status
                  </option>

                  <option value="Proposed">
                    Proposed
                  </option>

                  <option value="Ongoing">
                    Ongoing
                  </option>

                  <option value="Published">
                    Published
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>


              {/* PROPOSED DATE */}

              <Field
                label="Collaboration Proposed Date"
                name="collaboration_proposed_date"
                value={
                  form.collaboration_proposed_date
                }
                onChange={handleChange}
                type="date"
              />


              {/* FUNDING */}

              <Field
                label="Funding"
                name="funding"
                value={form.funding}
                onChange={handleChange}
                placeholder="Enter funding details"
              />


              {/* START DATE */}

              <Field
                label="Collaboration Start Date"
                name="collaboration_start_date"
                value={
                  form.collaboration_start_date
                }
                onChange={handleChange}
                type="date"
              />


              {/* END DATE */}

              <Field
                label="Collaboration End Date"
                name="collaboration_end_date"
                value={
                  form.collaboration_end_date
                }
                onChange={handleChange}
                type="date"
              />

            </div>

          </section>


          {/* =====================================================
              STATUS & SUPPORTING DOCUMENT
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Status & Supporting Information
            </h2>

            <div className="grid grid-cols-2 gap-4">

              {/* STATUS */}

              <div>

                <label className="form-label">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
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


              {/* SUPPORTING DOCUMENT */}

              <div className="flex items-center gap-3 pt-7">

                <input
                  type="checkbox"
                  name="supporting_document_available"
                  checked={
                    form.supporting_document_available
                  }
                  onChange={
                    handleSupportingDocumentChange
                  }
                  className="w-4 h-4"
                />

                <label className="form-label mb-0">
                  Supporting document available
                </label>

              </div>

            </div>

          </section>


          {/* =====================================================
              COLLABORATION OUTCOMES
          ===================================================== */}

          <section className="form-section">

            <h2 className="section-heading">
              Collaboration Outcomes
            </h2>

            <div className="grid grid-cols-2 gap-3">

              {[
                "Joint Publications",
                "Joint Projects",
                "Student Internships",
                "Faculty Exchange",
                "Student Exchange",
                "Funded Projects",
                "Research Visits",
                "Other Outcomes",
              ].map((outcome) => (

                <label
                  key={outcome}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >

                  <input
                    type="checkbox"
                    checked={form.collaboration_outcomes.includes(
                      outcome
                    )}
                    onChange={() =>
                      handleOutcomeChange(
                        outcome
                      )
                    }
                    className="w-4 h-4"
                  />

                  <span>
                    {outcome}
                  </span>

                </label>

              ))}

            </div>


            {/* OTHER OUTCOME DETAILS */}

            {form.collaboration_outcomes.includes(
              "Other Outcomes"
            ) && (

              <div className="mt-4">

                <label className="form-label">
                  Other Outcome Details
                </label>

                <textarea
                  name="other_outcome_details"
                  value={
                    form.other_outcome_details
                  }
                  onChange={handleChange}
                  placeholder="Describe other collaboration outcomes"
                  className="form-input form-textarea"
                  rows="4"
                />

              </div>

            )}

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
              Upload Collaboration Document
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
                : "Submit Collaboration"}
            </button>

          </div>

        </form>

      </div>

    </DashboardLayout>
  );
};

export default ResearchCollaborationPage;