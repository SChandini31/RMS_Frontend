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

const JournalPublicationPage = () => {
  const navigate = useNavigate();
  const notify = useNotificationMessage();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    institution_organization: "",
    school: "",
    department: user?.department || "",

    title: "",

    journal_name: "",
    publication_date: "",
    scope: "",
    issn: "",
    impact_factor: "",
    volume: "",
    issue: "",
    starting_page: "",
    ending_page: "",
    indexed_in: "",
    quartile: "",
    citation_count: "",
    doi_or_link: "",

    abstract: "",
    keywords: "",
    additional_notes: "",
  });

  const [authors, setAuthors] = useState([
    emptyAuthor(),
  ]);

  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      notify("Please upload the publication file.", null, "Validation Required");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      /*
       * =====================================================
       * COMMON PUBLICATION DATA
       * =====================================================
       */

      data.append(
        "publication_type",
        "journal"
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

      /*
       * =====================================================
       * AUTHORS
       * =====================================================
       */

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

      /*
       * =====================================================
       * JOURNAL TYPE DETAILS
       * =====================================================
       */

      const typeDetails = {
        journal_name: form.journal_name,

        publication_date:
          form.publication_date,

        scope: form.scope,

        issn: form.issn,

        impact_factor:
          form.impact_factor
            ? Number(form.impact_factor)
            : null,

        volume: form.volume,

        issue: form.issue,

        starting_page:
          form.starting_page
            ? Number(form.starting_page)
            : null,

        ending_page:
          form.ending_page
            ? Number(form.ending_page)
            : null,

        indexed_in:
          form.indexed_in
            ? [form.indexed_in]
            : [],

        quartile:
          form.quartile || null,

        citation_count:
          form.citation_count
            ? Number(form.citation_count)
            : 0,

        doi_or_link:
          form.doi_or_link || "",
      };

      data.append(
        "type_details",
        JSON.stringify(typeDetails)
      );

      /*
       * =====================================================
       * COMMON OPTIONAL DATA
       * =====================================================
       */

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

      /*
       * =====================================================
       * FILE
       * =====================================================
       */

      data.append("file", file);

      /*
       * =====================================================
       * SUBMIT
       * =====================================================
       */

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
        "ADD JOURNAL SUCCESS:",
        response.data
      );

      notify("The journal publication was successfully created.", null, "Publication Created");

      navigate("/publications");

  } catch (error) {
  console.error("ADD JOURNAL ERROR:", error);

  console.error(
  "RESPONSE DATA:",
  JSON.stringify(error.response?.data, null, 2)
);

  notify(error, "Unable to create the journal publication. Please try again.", "Publication Creation Failed");


    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container-lg max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="page-title">
            Journal Publication
          </h1>

          <p className="page-subtitle">
            Enter the details of your journal publication
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* COMMON INFORMATION */}
          <section className="form-section">

            <h2 className="section-heading">
              Basic Information
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <Field
                label="Title of the Article"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter article title"
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
                value={form.institution_organization}
                onChange={handleChange}
                placeholder="Enter institution"
              />

            </div>

          </section>


          {/* JOURNAL DETAILS */}
          <section className="form-section">

            <h2 className="section-heading">
              Journal Details
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <Field
                label="Name of the Journal"
                name="journal_name"
                value={form.journal_name}
                onChange={handleChange}
                required
                placeholder="Enter journal name"
              />

              <Field
                label="Date of Publication"
                name="publication_date"
                value={form.publication_date}
                onChange={handleChange}
                required
                type="date"
              />

              <div>
                <label className="form-label">
                  National / International *
                </label>

                <select
                  name="scope"
                  value={form.scope}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">
                    Select scope
                  </option>

                  <option value="National">
                    National
                  </option>

                  <option value="International">
                    International
                  </option>
                </select>
              </div>

              <Field
                label="ISSN Number"
                name="issn"
                value={form.issn}
                onChange={handleChange}
                required
                placeholder="Enter ISSN"
              />

              <Field
                label="Impact Factor"
                name="impact_factor"
                value={form.impact_factor}
                onChange={handleChange}
                type="number"
                placeholder="Enter impact factor"
              />

              <Field
                label="Volume"
                name="volume"
                value={form.volume}
                onChange={handleChange}
                placeholder="Enter volume"
              />

              <Field
                label="Issue"
                name="issue"
                value={form.issue}
                onChange={handleChange}
                placeholder="Enter issue"
              />

              <Field
                label="Starting Page"
                name="starting_page"
                value={form.starting_page}
                onChange={handleChange}
                type="number"
                placeholder="Enter starting page"
              />

              <Field
                label="Ending Page"
                name="ending_page"
                value={form.ending_page}
                onChange={handleChange}
                type="number"
                placeholder="Enter ending page"
              />

              <div>
                <label className="form-label">
                  Indexed In
                </label>

                <select
                  name="indexed_in"
                  value={form.indexed_in}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">
                    Select index
                  </option>

                  <option value="Scopus">
                    Scopus
                  </option>

                  <option value="Web of Science">
                    Web of Science
                  </option>

                  <option value="Other">
                    Other
                  </option>

                  <option value="Not Indexed">
                    Not Indexed
                  </option>
                </select>
              </div>

              <div>
                <label className="form-label">
                  Quartile
                </label>

                <select
                  name="quartile"
                  value={form.quartile}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">
                    Select quartile
                  </option>

                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                  <option value="NSI">NSI</option>
                </select>
              </div>

              <Field
                label="Citation Count"
                name="citation_count"
                value={form.citation_count}
                onChange={handleChange}
                type="number"
                placeholder="Enter citation count"
              />

              <Field
                label="DOI / Link"
                name="doi_or_link"
                value={form.doi_or_link}
                onChange={handleChange}
                type="url"
                placeholder="https://doi.org/..."
              />

            </div>

          </section>


          {/* AUTHORS */}
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


          {/* ABSTRACT */}
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


          {/* ADDITIONAL NOTES */}
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


          {/* FILE */}
          <section className="form-section">

            <h2 className="section-heading">
              Upload Publication File
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


          {/* BUTTONS */}
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
                : "Submit Journal"}
            </button>

          </div>

        </form>

      </div>
    </DashboardLayout>
  );
};

export default JournalPublicationPage;