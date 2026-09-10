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
// IMPORTANT: author schema expects "position"
// ============================================================

const emptyAuthor = () => ({
  name: "",
  position: "",
  author_type: "",
});


// ============================================================
// TAU AUTHOR DETAILS
// ============================================================

const AuthorDetails = ({
  title,
  enabled,
  details,
  onToggle,
  onChange,
}) => (
  <div className="p-4 bg-gray-50 rounded-lg space-y-4">

    <label className="flex items-center gap-2 form-label">
      <input
        type="checkbox"
        checked={enabled}
        onChange={onToggle}
      />

      {title} has TAU affiliation
    </label>

    {enabled && (
      <div className="grid grid-cols-2 gap-4">

        <Field
          label="Name"
          name="name"
          value={details.name}
          onChange={onChange}
          required
          placeholder="Enter author name"
        />

        <Field
          label="Position / Designation"
          name="position"
          value={details.position}
          onChange={onChange}
          placeholder="Enter position"
        />

        <Field
          label="Email"
          name="email"
          value={details.email}
          onChange={onChange}
          type="email"
          required
          placeholder="Enter email address"
        />

        <Field
          label="School / Institute"
          name="school"
          value={details.school}
          onChange={onChange}
          placeholder="Enter school or institute"
        />

      </div>
    )}
  </div>
);


// ============================================================
// CONFERENCE PUBLICATION PAGE
// ============================================================

const ConferencePublicationPage = () => {

  const navigate = useNavigate();
  const notify = useNotificationMessage();

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // ==========================================================
  // COMMON + CONFERENCE FORM STATE
  // ==========================================================

  const [form, setForm] = useState({

    // -------------------------
    // COMMON FIELDS
    // -------------------------

    institution_organization: "",

    school: "",

    department:
      user?.department || "",

    title: "",


    // -------------------------
    // CONFERENCE FIELDS
    // -------------------------

    conference_name: "",

    publication_date: "",

    scope: "",

    organizer_society: "",

    conference_city: "",

    conference_country: "",

    conference_date: "",

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
  // TAU AUTHORS
  // ==========================================================

  const [firstAuthorTau, setFirstAuthorTau] =
    useState(false);

  const [correspondingAuthorTau, setCorrespondingAuthorTau] =
    useState(false);


  const [firstAuthor, setFirstAuthor] =
    useState({
      name: "",
      position: "",
      email: "",
      school: "",
    });


  const [correspondingAuthor, setCorrespondingAuthor] =
    useState({
      name: "",
      position: "",
      email: "",
      school: "",
    });


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

    setForm((current) => ({
      ...current,
      [event.target.name]:
        event.target.value,
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

    const updated = [...authors];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setAuthors(updated);

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
  // TAU AUTHOR CHANGE
  // ==========================================================

  const updateAuthorDetails =
    (setter) =>
    (event) => {

      setter((current) => ({
        ...current,
        [event.target.name]:
          event.target.value,
      }));

    };


  // ==========================================================
  // SUBMIT CONFERENCE
  // ==========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    // --------------------------------------------------------
    // FILE CHECK
    // --------------------------------------------------------

    if (!file) {

      notify("Please upload the conference publication file.", null, "Validation Required");

      return;

    }


    // --------------------------------------------------------
    // COMMON FIELD VALIDATION
    // --------------------------------------------------------

    if (!form.title.trim()) {

      notify("Please enter the publication title.", null, "Validation Required");

      return;

    }


    // --------------------------------------------------------
    // CONFERENCE FIELD VALIDATION
    // --------------------------------------------------------

    if (!form.conference_name.trim()) {

      notify("Please enter the conference name.", null, "Validation Required");

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


    if (!form.organizer_society.trim()) {

      notify("Please enter the organizer or society.", null, "Validation Required");

      return;

    }


    if (!form.conference_city.trim()) {

      notify("Please enter the conference city.", null, "Validation Required");

      return;

    }


    if (!form.conference_country.trim()) {

      notify("Please enter the conference country.", null, "Validation Required");

      return;

    }


    if (!form.conference_date) {

      notify("Please select the conference date.", null, "Validation Required");

      return;

    }


    // --------------------------------------------------------
    // AUTHORS
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // TYPE DETAILS
    //
    // EXACTLY MATCHING conference.schema.js
    // --------------------------------------------------------

    const typeDetails = {

      conference_name:
        form.conference_name,

      publication_date:
        form.publication_date,

      scope:
        form.scope,

      organizer_society:
        form.organizer_society,

      conference_city:
        form.conference_city,

      conference_country:
        form.conference_country,

      conference_date:
        form.conference_date,

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
      "CONFERENCE TYPE DETAILS:",
      typeDetails
    );


    try {

      setSubmitting(true);


      // ------------------------------------------------------
      // FORM DATA
      // ------------------------------------------------------

      const data = new FormData();


      // ------------------------------------------------------
      // PUBLICATION TYPE
      // ------------------------------------------------------

      data.append(
        "publication_type",
        "conference"
      );


      // ------------------------------------------------------
      // COMMON FIELDS
      // ------------------------------------------------------

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


      // ------------------------------------------------------
      // AUTHORS
      // ------------------------------------------------------

      data.append(
        "authors",
        JSON.stringify(cleanedAuthors)
      );


      // ------------------------------------------------------
      // TYPE DETAILS
      // ------------------------------------------------------

      data.append(
        "type_details",
        JSON.stringify(typeDetails)
      );


      // ------------------------------------------------------
      // FILE
      // ------------------------------------------------------

      data.append(
        "file",
        file
      );


      // ------------------------------------------------------
      // DEBUG
      // ------------------------------------------------------

      console.log(
        "CONFERENCE SUBMISSION:"
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


      // ------------------------------------------------------
      // API REQUEST
      // ------------------------------------------------------

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


      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      console.log(
        "ADD CONFERENCE SUCCESS:",
        response.data
      );


      notify("The conference publication was successfully created.", null, "Publication Created");


      navigate(
        "/publications"
      );


    } catch (error) {

      console.error(
        "ADD CONFERENCE ERROR:",
        error
      );


      console.error(
        "RESPONSE DATA:",
        error.response?.data
      );


      notify(error, "Unable to create the conference publication. Please try again.", "Publication Creation Failed");


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
            Conference Publication
          </h1>

          <p className="page-subtitle">
            Enter the details of your conference publication
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


            <div className="grid grid-cols-1 gap-4">


              {/* TITLE */}

              <Field
                label="Title of the Publication"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter publication title"
              />


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

              <Field
                label="Institution / Organization"
                name="institution_organization"
                value={
                  form.institution_organization
                }
                onChange={handleChange}
                placeholder="Enter institution / organization"
              />

            </div>

          </section>


          {/* ================================================= */}
          {/* CONFERENCE DETAILS */}
          {/* ================================================= */}

          <section className="form-section">

            <h2 className="section-heading">
              Conference Details
            </h2>


            <div className="grid grid-cols-2 gap-4">


              {/* CONFERENCE NAME */}

              <Field
                label="Conference Name"
                name="conference_name"
                value={form.conference_name}
                onChange={handleChange}
                required
                placeholder="Enter conference name"
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


              {/* ORGANIZER */}

              <Field
                label="Organizer / Society"
                name="organizer_society"
                value={form.organizer_society}
                onChange={handleChange}
                required
                placeholder="Enter organizer / society"
              />


              {/* CITY */}

              <Field
                label="Conference City"
                name="conference_city"
                value={form.conference_city}
                onChange={handleChange}
                required
                placeholder="Enter conference city"
              />


              {/* COUNTRY */}

              <Field
                label="Conference Country"
                name="conference_country"
                value={form.conference_country}
                onChange={handleChange}
                required
                placeholder="Enter conference country"
              />


              {/* CONFERENCE DATE */}

              <Field
                label="Conference Date"
                name="conference_date"
                value={form.conference_date}
                onChange={handleChange}
                required
                type="date"
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


              {/* DOI */}

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
                      label="Position / Number"
                      value={author.position}
                      onChange={(event) =>
                        handleAuthorChange(
                          index,
                          "position",
                          event.target.value
                        )
                      }
                      required
                      placeholder="e.g. 1"
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
          {/* TAU AUTHORS */}
          {/* ================================================= */}

          <section className="form-section">

            <h2 className="section-heading">
              TAU-Affiliated Authors
            </h2>


            <div className="space-y-4">

              <AuthorDetails
                title="First author"
                enabled={firstAuthorTau}
                details={firstAuthor}
                onToggle={() =>
                  setFirstAuthorTau(
                    !firstAuthorTau
                  )
                }
                onChange={updateAuthorDetails(
                  setFirstAuthor
                )}
              />


              <AuthorDetails
                title="Corresponding author"
                enabled={
                  correspondingAuthorTau
                }
                details={
                  correspondingAuthor
                }
                onToggle={() =>
                  setCorrespondingAuthorTau(
                    !correspondingAuthorTau
                  )
                }
                onChange={updateAuthorDetails(
                  setCorrespondingAuthor
                )}
              />

            </div>

          </section>


          {/* ================================================= */}
          {/* FILE */}
          {/* ================================================= */}

          <section className="form-section">

            <h2 className="section-heading">
              Upload Conference File *
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
                : "Submit Conference"}

            </button>

          </div>

        </form>

      </div>

    </DashboardLayout>

  );

};


export default ConferencePublicationPage;