import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// use local backend while testing
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

      // add normal fields safely
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      // remove completely empty authors
      const cleanedAuthors = authors.filter(
        (author) => author.name.trim() || author.author_type.trim()
      );

      data.append("authors", JSON.stringify(cleanedAuthors));

      // send plain comma-separated strings
      if (form.keywords.trim()) {
        data.append("keywords", form.keywords.trim());
      }

      if (form.affiliation.trim()) {
        data.append("affiliation", form.affiliation.trim());
      }

      // issue should be number only if entered
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

  const inputClass =
    "w-full rounded-2xl border border-[#DCE3E6] bg-white px-4 py-3 text-sm text-[#17313C] outline-none transition focus:border-[#35B8D6] focus:ring-4 focus:ring-[#DDF4F8] placeholder:text-[#9AA7AE]";

  const labelClass = "block text-sm font-semibold text-[#4E5D66] mb-2";

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-apolloBlue">Add Publication</h1>
          <p className="text-sm text-[#7A878E] mt-1">
            Fill in the publication details and upload the related file.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-3xl border border-[#E1E7EA] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#17313C] mb-5">Basic Info *</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter publication title"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Department *</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Publication Type *</label>
                <input
                  name="publication_type"
                  value={form.publication_type}
                  onChange={handleChange}
                  placeholder="Journal / Conference / Book"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Institution / Organization</label>
                <input
                  name="institution_organization"
                  value={form.institution_organization}
                  onChange={handleChange}
                  placeholder="Enter institution"
                  required
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>School</label>
                <input
                  name="school"
                  value={form.school}
                  onChange={handleChange}
                  placeholder="Enter school"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-[#E1E7EA] shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#17313C]">Authors *</h2>
              <button
                type="button"
                onClick={addAuthor}
                className="px-4 py-2 rounded-xl bg-[#E8F5F6] text-[#1B7F8B] text-sm font-medium hover:bg-[#DDF1F3]"
              >
                + Add Author
              </button>
            </div>

            <div className="space-y-4">
              {authors.map((author, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_auto] gap-4 items-end p-4 rounded-2xl border border-[#EDF1F3] bg-[#FAFBFB]"
                >
                  <div>
                    <label className={labelClass}>Author Name</label>
                    <input
                      value={author.name}
                      onChange={(e) =>
                        handleAuthorChange(index, "name", e.target.value)
                      }
                      placeholder="Enter author name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Author Type</label>
                    <input
                      value={author.author_type}
                      onChange={(e) =>
                        handleAuthorChange(index, "author_type", e.target.value)
                      }
                      placeholder="First / Co-author"
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className="h-[50px] px-4 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-[#E1E7EA] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#17313C] mb-5">Publication Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>Journal Name *</label>
                <input
                  name="journal_name"
                  value={form.journal_name}
                  onChange={handleChange}
                  placeholder="Enter journal name"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>ISSN</label>
                <input
                  name="issn"
                  value={form.issn}
                  onChange={handleChange}
                  placeholder="Enter ISSN"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>DOI</label>
                <input
                  name="DOI"
                  value={form.DOI}
                  onChange={handleChange}
                  placeholder="Enter DOI"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Volume</label>
                <input
                  name="volume"
                  value={form.volume}
                  onChange={handleChange}
                  placeholder="Enter volume"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Issue</label>
                <input
                  type="number"
                  name="issue"
                  value={form.issue}
                  onChange={handleChange}
                  placeholder="Enter issue"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>POI URL</label>
                <input
                  name="poi_url"
                  value={form.poi_url}
                  onChange={handleChange}
                  placeholder="Enter POI URL"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Date of Publication</label>
                <input
                  type="date"
                  name="date_of_publication"
                  value={form.date_of_publication}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Index</label>
                <input
                  name="index"
                  value={form.index}
                  onChange={handleChange}
                  placeholder="Enter index"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-[#E1E7EA] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#17313C] mb-5">Abstract & Keywords *</h2>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className={labelClass}>Abstract</label>
                <textarea
                  name="abstract"
                  value={form.abstract}
                  onChange={handleChange}
                  placeholder="Enter abstract (max 350 words)"
                  className={`${inputClass} min-h-[140px] resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>Keywords</label>
                <input
                  name="keywords"
                  value={form.keywords}
                  onChange={handleChange}
                  placeholder="Enter keywords separated by commas"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-[#E1E7EA] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#17313C] mb-5">Additional Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Affiliation</label>
                <input
                  name="affiliation"
                  value={form.affiliation}
                  onChange={handleChange}
                  placeholder="Comma separated affiliations"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Scopus ID</label>
                <input
                  name="scopus_id"
                  value={form.scopus_id}
                  onChange={handleChange}
                  placeholder="Enter Scopus ID"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Funding Source</label>
                <input
                  name="funding_source"
                  value={form.funding_source}
                  onChange={handleChange}
                  placeholder="Enter funding source"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2 xl:col-span-3">
                <label className={labelClass}>Additional Notes</label>
                <textarea
                  name="additional_notes"
                  value={form.additional_notes}
                  onChange={handleChange}
                  placeholder="Enter any additional notes"
                  className={`${inputClass} min-h-[110px] resize-none`}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-[#E1E7EA] shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#17313C] mb-5">Upload File *</h2>

            <div className="rounded-2xl border border-dashed border-[#C9D6DD] bg-[#F8FBFC] p-5">
              <label className={labelClass}>Upload File</label>
              <input
                type="file"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-[#4E5D66]"
              />
              <p className="text-xs text-[#8A959B] mt-2">
                Upload the publication file in PDF or supported format.
              </p>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-2xl bg-apolloBlue text-white font-semibold hover:bg-[#0C5E78] transition disabled:opacity-70"
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