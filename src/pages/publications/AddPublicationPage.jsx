import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://rms-897z.onrender.com";

const AddPublicationPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    institution_organization: "",
    school: "",
    department: user?.department || "",
    publication_type: "",
    title: "",
    journal_name: "",
    issn: "",
    poi_url: "",
    volume: "",
    issue: "",
    DOI: "",
    abstract: "",
    keywords: "",
    affiliation: "",
    index: "",
    scopus_id: "",
    funding_source: "",
    additional_notes: "",
    date_of_publication: "",
  });

  const [authors, setAuthors] = useState([{ name: "", author_type: "" }]);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuthorChange = (index, field, value) => {
    const updated = [...authors];
    updated[index][field] = value;
    setAuthors(updated);
  };

  const addAuthor = () => {
    setAuthors([...authors, { name: "", author_type: "" }]);
  };

  const removeAuthor = (index) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      const cleanedAuthors = authors.filter(
        (author) => author.name.trim() || author.author_type.trim()
      );

      data.append("authors", JSON.stringify(cleanedAuthors));

      if (form.keywords.trim()) {
        data.append("keywords", form.keywords.trim());
      }

      if (form.affiliation.trim()) {
        data.append("affiliation", form.affiliation.trim());
      }

      if (form.issue !== "") {
        data.set("issue", Number(form.issue));
      }

      if (file) {
        data.append("file", file);
      }

      const response = await axios.post(`${API_BASE}/api/publications`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("ADD PUBLICATION SUCCESS:", response.data);
      alert("✅ Publication added successfully!");
      navigate("/publications");
    } catch (error) {
      console.error("ADD PUBLICATION ERROR:", error);
      console.error("RESPONSE DATA:", error.response?.data);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "❌ Failed to add publication"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container-lg">
        <div className="mb-6">
          <h1 className="page-title">Add Publication</h1>
          <p className="page-subtitle">
            Fill in the publication details and upload the related file.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="form-section">
            <h2 className="section-heading">Basic Info *</h2>

            <div className="form-grid-4">
              <div>
                <label className="form-label">Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter publication title"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Department *</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Publication Type *</label>
                <input
                  name="publication_type"
                  value={form.publication_type}
                  onChange={handleChange}
                  placeholder="Journal / Conference / Book"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Institution / Organization</label>
                <input
                  name="institution_organization"
                  value={form.institution_organization}
                  onChange={handleChange}
                  placeholder="Enter institution"
                  required
                  className="form-input"
                />
              </div>

              <div className="span-2">
                <label className="form-label">School</label>
                <input
                  name="school"
                  value={form.school}
                  onChange={handleChange}
                  placeholder="Enter school"
                  required
                  className="form-input"
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-header">
              <h2 className="section-heading">Authors *</h2>
              <button
                type="button"
                onClick={addAuthor}
                className="btn-add-soft"
              >
                + Add Author
              </button>
            </div>

            <div className="space-y-4">
              {authors.map((author, index) => (
                <div key={index} className="form-grid-authors">
                  <div>
                    <label className="form-label">Author Name</label>
                    <input
                      value={author.name}
                      onChange={(e) =>
                        handleAuthorChange(index, "name", e.target.value)
                      }
                      placeholder="Enter author name"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Author Type</label>
                    <input
                      value={author.author_type}
                      onChange={(e) =>
                        handleAuthorChange(index, "author_type", e.target.value)
                      }
                      placeholder="First / Co-author"
                      className="form-input"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-heading">Publication Details</h2>

            <div className="form-grid-4">
              <div>
                <label className="form-label">Journal Name *</label>
                <input
                  name="journal_name"
                  value={form.journal_name}
                  onChange={handleChange}
                  placeholder="Enter journal name"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">ISSN</label>
                <input
                  name="issn"
                  value={form.issn}
                  onChange={handleChange}
                  placeholder="Enter ISSN"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">DOI</label>
                <input
                  name="DOI"
                  value={form.DOI}
                  onChange={handleChange}
                  placeholder="Enter DOI"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Volume</label>
                <input
                  name="volume"
                  value={form.volume}
                  onChange={handleChange}
                  placeholder="Enter volume"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Issue</label>
                <input
                  type="number"
                  name="issue"
                  value={form.issue}
                  onChange={handleChange}
                  placeholder="Enter issue"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">POI URL</label>
                <input
                  name="poi_url"
                  value={form.poi_url}
                  onChange={handleChange}
                  placeholder="Enter POI URL"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Date of Publication</label>
                <input
                  type="date"
                  name="date_of_publication"
                  value={form.date_of_publication}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Index</label>
                <input
                  name="index"
                  value={form.index}
                  onChange={handleChange}
                  placeholder="Enter index"
                  className="form-input"
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-heading">Abstract & Keywords *</h2>

            <div className="space-y-4">
              <div>
                <label className="form-label">Abstract</label>
                <textarea
                  name="abstract"
                  value={form.abstract}
                  onChange={handleChange}
                  placeholder="Enter abstract (max 350 words)"
                  className="form-input form-textarea"
                />
              </div>

              <div>
                <label className="form-label">Keywords</label>
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

          <section className="form-section">
            <h2 className="section-heading">Additional Info</h2>

            <div className="form-grid-4">
              <div>
                <label className="form-label">Affiliation</label>
                <input
                  name="affiliation"
                  value={form.affiliation}
                  onChange={handleChange}
                  placeholder="Comma separated affiliations"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Scopus ID</label>
                <input
                  name="scopus_id"
                  value={form.scopus_id}
                  onChange={handleChange}
                  placeholder="Enter Scopus ID"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Funding Source</label>
                <input
                  name="funding_source"
                  value={form.funding_source}
                  onChange={handleChange}
                  placeholder="Enter funding source"
                  className="form-input"
                />
              </div>

              <div className="span-2">
                <label className="form-label">Additional Notes</label>
                <textarea
                  name="additional_notes"
                  value={form.additional_notes}
                  onChange={handleChange}
                  placeholder="Enter any additional notes"
                  className="form-input form-textarea-sm"
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-heading">Upload File *</h2>

            <div className="upload-zone">
              <label className="form-label">Upload File</label>
              <input
                type="file"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input"
              />
              <p className="upload-hint">
                Upload the publication file in PDF or supported format.
              </p>
            </div>
          </section>

          <div className="btn-group-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-submit"
            >
              {submitting ? "Submitting..." : "Submit Publication"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddPublicationPage;
