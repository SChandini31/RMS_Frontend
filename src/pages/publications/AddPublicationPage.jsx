import DashboardLayout from "../../components/layout/DashboardLayout";
import { PUBLICATION_TYPES } from "../../config/publicationTypes";
import { useNavigate } from "react-router-dom";

const AddPublicationPage = () => {
  const navigate = useNavigate();

  const handleTypeChange = (e) => {
    const type = e.target.value;

    if (!type) return;

    switch (type) {
      case "journal":
        navigate("/publications/add/journal");
        break;

      case "book":
        navigate("/publications/add/book");
        break;

      case "book_chapter":
        navigate("/publications/add/book-chapter");
        break;

      case "conference":
        navigate("/publications/add/conference");
        break;

      case "patent":
        navigate("/publications/add/patent");
        break;

      case "research_project":
        navigate("/publications/add/research-project");
        break;

      case "consultancy":
        navigate("/publications/add/consultancy");
        break;

      case "research_collaboration":
        navigate("/publications/add/research-collaboration");
        break;

      case "research_support":
        navigate("/publications/add/research-support");
        break;

      default:
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="container-lg max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="page-title">Add Publication</h1>

          <p className="page-subtitle">
            Select a publication type to upload your publication
          </p>
        </div>

        {/* Publication Type */}
        <section className="form-section mb-8">
          <h2 className="section-heading mb-4">
            Publication Type *
          </h2>

          <div className="mb-4">
            <label className="form-label">
              Select Publication Type
            </label>

            <select
              defaultValue=""
              onChange={handleTypeChange}
              className="form-input"
              style={{ cursor: "pointer" }}
            >
              <option value="">
                -- Choose a publication type --
              </option>

              {PUBLICATION_TYPES.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Message */}
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg">
            👆 Please select a publication type above to continue
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AddPublicationPage;