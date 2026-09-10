import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNotificationMessage } from "../../utils/useNotificationMessage";

const API_BASE = "https://rms-897z.onrender.com";

// ============================================================
// COMMON FIELD
// ============================================================

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


// ============================================================
// EMPTY AUTHOR
// Backend author schema expects:
// name, position, author_type
// ============================================================

const emptyAuthor = () => ({
  name: "",
  position: "",
  author_type: "",
});


// ============================================================
// BOOK CHAPTER PUBLICATION PAGE
// ============================================================

const BookChapterPublicationPage = () => {

  const navigate = useNavigate();
  const notify = useNotificationMessage();

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );


  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [form, setForm] = useState({

    // --------------------------------------------------------
    // COMMON FIELDS
    // --------------------------------------------------------

    institution_organization: "",

    school: "",

    department:
      user?.department || "",

    title: "",

    abstract: "",

    keywords: "",


    // --------------------------------------------------------
    // BOOK CHAPTER SPECIFIC FIELDS
    // --------------------------------------------------------

    chapter_title: "",

    book_title: "",

    editor: "",

    publisher: "",

    publication_date: "",

    scope: "",

    issn: "",

    volume: "",

    issue: "",

    starting_page: "",

    ending_page: "",

    indexed_in: "",

    doi_or_link: "",

  });


  // ==========================================================
  // AUTHORS
  // ==========================================================

  const [authors, setAuthors] = useState([
    emptyAuthor(),
  ]);


  // ==========================================================
  // FILE
  // ==========================================================

  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] =
    useState(false);


  // ==========================================================
  // HANDLE FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

  };


  // ==========================================================
  // HANDLE AUTHOR CHANGE
  // ==========================================================

  const handleAuthorChange = (
    index,
    field,
    value
  ) => {

    const updatedAuthors = [...authors];

    updatedAuthors[index] = {
      ...updatedAuthors[index],
      [field]: value,
    };

    setAuthors(updatedAuthors);

  };


  // ==========================================================
  // ADD AUTHOR
  // ==========================================================

  const addAuthor = () => {

    setAuthors([
      ...authors,
      emptyAuthor(),
    ]);

  };


  // ==========================================================
  // REMOVE AUTHOR
  // ==========================================================

  const removeAuthor = (index) => {

    setAuthors(
      authors.filter(
        (_, authorIndex) =>
          authorIndex !== index
      )
    );

  };


  // ==========================================================
  // SUBMIT BOOK CHAPTER
  // ==========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    // ========================================================
    // FILE VALIDATION
    // ========================================================

    if (!file) {

      notify("Please upload the book chapter file.", null, "Validation Required");

      return;

    }


    // ========================================================
    // COMMON FIELD VALIDATION
    // ========================================================

    if (!form.title.trim()) {

      notify("Please enter the publication title.", null, "Validation Required");

      return;

    }


    // ========================================================
    // AUTHOR VALIDATION
    // ========================================================

    const cleanedAuthors =
      authors.filter(
        (author) =>
          author.name.trim() ||
          author.position.trim() ||
          author.author_type.trim()
      );


    if (cleanedAuthors.length === 0) {

      notify("Please add at least one author.", null, "Validation Required");

      return;

    }


    // ========================================================
    // BOOK CHAPTER VALIDATION
    // ========================================================

    if (!form.chapter_title.trim()) {

      notify("Please enter the chapter title.", null, "Validation Required");

      return;

    }


    if (!form.book_title.trim()) {

      notify("Please enter the book title.", null, "Validation Required");

      return;

    }


    if (!form.editor.trim()) {

      notify("Please enter the editor name.", null, "Validation Required");

      return;

    }


    if (!form.publisher.trim()) {

      notify("Please enter the publisher.", null, "Validation Required");

      return;

    }


    if (!form.publication_date) {

      notify("Please select the publication date.", null, "Validation Required");

      return;

    }


    if (!form.scope) {

      notify("Please select National or International.", null, "Validation Required");

      return;

    }


    if (!form.issn.trim()) {

      notify("Please enter the ISSN.", null, "Validation Required");

      return;

    }


    // ========================================================
    // TYPE DETAILS
    //
    // EXACTLY MATCHES bookChapter.schema.js
    // ========================================================

    const typeDetails = {

      chapter_title:
        form.chapter_title,

      book_title:
        form.book_title,

      editor:
        form.editor,

      publisher:
        form.publisher,

      publication_date:
        form.publication_date,

      scope:
        form.scope,

      issn:
        form.issn,

      volume:
        form.volume || "",

      issue:
        form.issue || "",

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

      doi_or_link:
        form.doi_or_link || "",

    };


    console.log(
      "BOOK CHAPTER TYPE DETAILS:",
      typeDetails
    );


    // ========================================================
    // CREATE FORM DATA
    // ========================================================

    try {

      setSubmitting(true);

      const data = new FormData();


      // ======================================================
      // PUBLICATION TYPE
      // ======================================================

      data.append(
        "publication_type",
        "book_chapter"
      );


      // ======================================================
      // COMMON FIELDS
      // ======================================================

      if (
        form.institution_organization
      ) {

        data.append(
          "institution_organization",
          form.institution_organization
        );

      }


      if (form.school) {

        data.append(
          "school",
          form.school
        );

      }


      if (form.department) {

        data.append(
          "department",
          form.department
        );

      }


      data.append(
        "title",
        form.title
      );


      // ======================================================
      // ABSTRACT
      // ======================================================

      data.append(
        "abstract",
        form.abstract || ""
      );


      // ======================================================
      // KEYWORDS
      // ======================================================

      const keywordsArray =
        form.keywords
          .split(",")
          .map(
            (keyword) =>
              keyword.trim()
          )
          .filter(Boolean);


      data.append(
        "keywords",
        JSON.stringify(
          keywordsArray
        )
      );


      // ======================================================
      // AUTHORS
      // ======================================================

      data.append(
        "authors",
        JSON.stringify(
          cleanedAuthors
        )
      );


      // ======================================================
      // TYPE DETAILS
      // ======================================================

      data.append(
        "type_details",
        JSON.stringify(
          typeDetails
        )
      );


      // ======================================================
      // FILE
      // ======================================================

      data.append(
        "file",
        file
      );


      // ======================================================
      // DEBUG
      // ======================================================

      console.log(
        "BOOK CHAPTER SUBMISSION:"
      );

      for (
        const [key, value]
        of data.entries()
      ) {

        console.log(
          key,
          value
        );

      }


      // ======================================================
      // API REQUEST
      // ======================================================

      const response =
        await axios.post(
          `${API_BASE}/api/publications`,
          data,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "multipart/form-data",
            },
          }
        );


      // ======================================================
      // SUCCESS
      // ======================================================

      console.log(
        "ADD BOOK CHAPTER SUCCESS:",
        response.data
      );


      notify("The book chapter publication was successfully created.", null, "Publication Created");


      navigate(
        "/publications"
      );


    } catch (error) {

      console.error(
        "ADD BOOK CHAPTER ERROR:",
        error
      );


      console.error(
        "RESPONSE DATA:",
        error.response?.data
      );


      notify(error, "Unable to create the book chapter publication. Please try again.", "Publication Creation Failed");


    } finally {

      setSubmitting(false);

    }

  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <DashboardLayout>

      <div className="container-lg max-w-4xl mx-auto">


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8">

          <h1 className="page-title">
            Book Chapter Publication
          </h1>

          <p className="page-subtitle">
            Enter the details of your book chapter publication
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >


          {/* ================================================= */}
          {/* COMMON INFORMATION */}
          {/* ================================================= */}

          <section className="form-section">

            <h2 className="section-heading">
              Basic Information
            </h2>


            <div className="grid grid-cols-2 gap-4">


              {/* TITLE */}

              <div className="col-span-2">

                <Field
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter publication title"
                />

              </div>


              {/* DEPARTMENT */}

              <Field
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                placeholder="Enter department"
              />


              {/* SCHOOL */}

              <Field
                label="School / Institute"
                name="school"
                value={form.school}
                onChange={handleChange}
                placeholder="Enter school or institute"
              />


              {/* INSTITUTION */}

              <div className="col-span-2">

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

            </div>

          </section>


          {/* ================================================= */}
          {/* BOOK CHAPTER DETAILS */}
          {/* ================================================= */}

          <section className="form-section">

            <h2 className="section-heading">
              Book Chapter Details
            </h2>


            <div className="grid grid-cols-2 gap-4">


              {/* CHAPTER TITLE */}

              <div className="col-span-2">

                <Field
                  label="Chapter Title"
                  name="chapter_title"
                  value={form.chapter_title}
                  onChange={handleChange}
                  required
                  placeholder="Enter chapter title"
                />

              </div>


              {/* BOOK TITLE */}

              <div className="col-span-2">

                <Field
                  label="Book Title"
                  name="book_title"
                  value={form.book_title}
                  onChange={handleChange}
                  required
                  placeholder="Enter book title"
                />

              </div>


              {/* EDITOR */}

              <Field
                label="Editor"
                name="editor"
                value={form.editor}
                onChange={handleChange}
                required
                placeholder="Enter editor name"
              />


              {/* PUBLISHER */}

              <Field
                label="Publisher"
                name="publisher"
                value={form.publisher}
                onChange={handleChange}
                required
                placeholder="Enter publisher"
              />


              {/* PUBLICATION DATE */}

              <Field
                label="Publication Date"
                name="publication_date"
                value={form.publication_date}
                onChange={handleChange}
                required
                type="date"
              />


              {/* SCOPE */}

              <div>

                <label className="form-label">
                  Scope *
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


              {/* ISSN */}

              <Field
                label="ISSN"
                name="issn"
                value={form.issn}
                onChange={handleChange}
                required
                placeholder="Enter ISSN"
              />


              {/* VOLUME */}

              <Field
                label="Volume"
                name="volume"
                value={form.volume}
                onChange={handleChange}
                placeholder="Enter volume"
              />


              {/* ISSUE */}

              <Field
                label="Issue"
                name="issue"
                value={form.issue}
                onChange={handleChange}
                placeholder="Enter issue"
              />


              {/* STARTING PAGE */}

              <Field
                label="Starting Page"
                name="starting_page"
                value={form.starting_page}
                onChange={handleChange}
                type="number"
                placeholder="Enter starting page"
              />


              {/* ENDING PAGE */}

              <Field
                label="Ending Page"
                name="ending_page"
                value={form.ending_page}
                onChange={handleChange}
                type="number"
                placeholder="Enter ending page"
              />


              {/* INDEXED IN */}

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


              {/* DOI / LINK */}

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


          {/* ================================================= */}
          {/* ABSTRACT + KEYWORDS */}
          {/* ================================================= */}

          <section className="form-section">

            <h2 className="section-heading">
              Additional Information
            </h2>


            {/* ABSTRACT */}

            <div className="mb-4">

              <label className="form-label">
                Abstract
              </label>

              <textarea
                name="abstract"
                value={form.abstract}
                onChange={handleChange}
                placeholder="Enter abstract"
                className="form-input"
                rows="5"
              />

            </div>


            {/* KEYWORDS */}

            <div>

              <label className="form-label">
                Keywords
              </label>

              <input
                type="text"
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                placeholder="Enter keywords separated by commas"
                className="form-input"
              />

            </div>

          </section>


          {/* ================================================= */}
          {/* AUTHORS */}
          {/* ================================================= */}

          <section className="form-section">

            <div className="flex justify-between items-center mb-4">

              <h2 className="section-heading">
                All Author(s) *
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
                      onChange={(event) =>
                        handleAuthorChange(
                          index,
                          "name",
                          event.target.value
                        )
                      }
                      required
                      placeholder="Enter author name"
                    />


                    {/* POSITION */}

                    <Field
                      label="Position"
                      value={author.position}
                      onChange={(event) =>
                        handleAuthorChange(
                          index,
                          "position",
                          event.target.value
                        )
                      }
                      required
                      placeholder="Enter position"
                    />


                    {/* AUTHOR TYPE */}

                    <Field
                      label="Author Type"
                      value={author.author_type}
                      onChange={(event) =>
                        handleAuthorChange(
                          index,
                          "author_type",
                          event.target.value
                        )
                      }
                      placeholder="Enter author type"
                    />


                    {/* REMOVE */}

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

                )
              )}

            </div>

          </section>


          {/* ================================================= */}
          {/* FILE */}
          {/* ================================================= */}

          <section className="form-section">

            <h2 className="section-heading">
              Upload Book Chapter File *
            </h2>


            <input
              type="file"
              onChange={(event) =>
                setFile(
                  event.target.files[0]
                )
              }
              required
              className="form-input"
              accept=".pdf,.doc,.docx"
            />


            {file && (

              <p className="text-green-600 font-medium mt-2">
                {file.name}
              </p>

            )}

          </section>


          {/* ================================================= */}
          {/* BUTTONS */}
          {/* ================================================= */}

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
                : "Submit Book Chapter"}

            </button>

          </div>

        </form>

      </div>

    </DashboardLayout>

  );

};


export default BookChapterPublicationPage;