import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://rms-897z.onrender.com";

const PublicationsPage = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // =========================
  // PAGINATION
  // =========================
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const role = user?.activeRole || user?.role?.[0];

  const isSuperAdmin = role === "super_admin";
  const isFaculty = role === "faculty";
  const isDirectorate = role === "directorate";
  const isStudent = role === "student";

  const showAddButton = isSuperAdmin || isFaculty || isStudent;
  const showFileColumn = isSuperAdmin || isFaculty || isDirectorate;
  const showActionsColumn = isFaculty || isDirectorate;

  // =========================
  // FETCH PUBLICATIONS
  // =========================
  useEffect(() => {
    fetchPublications();
  }, [currentPage]);

  const fetchPublications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/publications`, {
        params: {
          page: currentPage,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Frontend user:", user);
      console.log("Frontend role:", user?.role);
      console.log("Raw publications:", res.data);

      // Backend response:
      // {
      //   success: true,
      //   count: 10,
      //   publications: [...],
      //   pagination: {
      //     currentPage: 1,
      //     pageSize: 10,
      //     totalItems: 25,
      //     totalPages: 3,
      //     hasNextPage: true,
      //     hasPreviousPage: false
      //   }
      // }

      const publicationData = Array.isArray(
        res.data?.publications
      )
        ? res.data.publications
        : [];

      console.log(
        "Publications for current page:",
        publicationData
      );

      setPublications(publicationData);

      // =========================
      // PAGINATION DATA
      // =========================

      if (res.data?.pagination) {
        setPagination(res.data.pagination);
      } else {
        setPagination({
          currentPage: currentPage,
          pageSize: 10,
          totalItems: publicationData.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: currentPage > 1,
        });
      }

    } catch (error) {
      console.error(
        "FETCH PUBLICATIONS ERROR:",
        error
      );

      setPublications([]);

      setPagination({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STATUS UPDATE
  // =========================
  const handleStatusChange = async (
    id,
    status,
    rejectionReason = ""
  ) => {
    try {
      await axios.put(
        `${API_BASE}/api/publications/${id}/status`,
        {
          status,
          rejectionReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPublications();

    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update publication status"
      );
    }
  };

  // =========================
  // REJECTION REASON
  // =========================
  const askRejectionReason = () => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    return reason || "";
  };

  // =========================
  // STATUS BADGE
  // =========================
  const getStatusBadgeClass = (status) => {
    if (status === "approved") {
      return "status-badge status-badge--approved";
    }

    if (status === "rejected") {
      return "status-badge status-badge--rejected";
    }

    return "status-badge status-badge--pending";
  };

  // =========================
  // DATE FILTER
  // =========================
  const filterByDate = (data) => {
    // Safety check
    if (!Array.isArray(data)) {
      return [];
    }

    // No date filter
    if (!fromDate && !toDate) {
      return data;
    }

    return data.filter((pub) => {
      /*
       * OLD PUBLICATION STRUCTURE:
       * pub.date_of_publication
       *
       * NEW PUBLICATION STRUCTURE:
       * pub.type_details.publication_date
       *
       * Fallback:
       * pub.createdAt
       */

      const pubDate = pub.date_of_publication
        ? new Date(pub.date_of_publication)
        : pub.type_details?.publication_date
        ? new Date(pub.type_details.publication_date)
        : pub.createdAt
        ? new Date(pub.createdAt)
        : null;

      if (!pubDate || isNaN(pubDate.getTime())) {
        return false;
      }

      // From date
      if (fromDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);

        if (pubDate < start) {
          return false;
        }
      }

      // To date
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);

        if (pubDate > end) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredPublications =
    filterByDate(publications);

  // =========================
  // PAGINATION HANDLERS
  // =========================

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageChange = (page) => {
    if (
      page >= 1 &&
      page <= pagination.totalPages &&
      page !== currentPage
    ) {
      setCurrentPage(page);
    }
  };

  // =========================
  // JSX
  // =========================
  return (
    <DashboardLayout>
      {/* ================= HEADER ================= */}
      <div className="page-header">
        <div className="page-header-col">
          <h1 className="page-title">Publications</h1>

          <p className="page-subtitle">
            Manage and review publication records.
          </p>
        </div>

        {showAddButton && (
          <Link
            to="/publications/add"
            className="btn-primary-sm"
          >
            Add Publication
          </Link>
        )}
      </div>

      {/* ================= DATE FILTER ================= */}
      <div className="filter-card">
        <h3 className="section-heading-sm">
          Filter by Date
        </h3>

        <div className="filter-row">
          <div className="filter-field">
            <label className="form-label-sm">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="form-input-sm"
            />
          </div>

          <div className="filter-field">
            <label className="form-label-sm">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="form-input-sm"
            />
          </div>

          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="btn-clear"
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>

      {/* ================= PUBLICATIONS TABLE ================= */}
      <div className="content-card table-wrapper">
        {loading ? (
          <p className="text-muted">
            Loading publications...
          </p>
        ) : filteredPublications.length === 0 ? (
          <p className="text-muted-light">
            No publications found
          </p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>

                  <th>Department</th>

                  <th>Uploaded By</th>

                  <th>Faculty Status</th>

                  <th>Directorate Status</th>

                  <th>Final Status</th>

                  {showFileColumn && <th>File</th>}

                  {showActionsColumn && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {filteredPublications.map((pub) => {
                  // Faculty approval permission
                  const facultyCanAct =
                    isFaculty &&
                    pub.facultyApprovalStatus ===
                      "pending";

                  // Directorate approval permission
                  const directorateCanAct =
                    isDirectorate &&
                    pub.facultyApprovalStatus ===
                      "approved" &&
                    pub.directorateApprovalStatus ===
                      "pending" &&
                    pub.finalStatus ===
                      "pending";

                  return (
                    <tr key={pub._id}>
                      {/* TITLE */}
                      <td className="cell-primary">
                        {pub.title || "Untitled"}
                      </td>

                      {/* DEPARTMENT */}
                      <td className="cell-nowrap">
                        {pub.department || "-"}
                      </td>

                      {/* UPLOADED BY */}
                      <td className="cell-nowrap">
                        {pub.uploadedBy?.name || "-"}
                      </td>

                      {/* FACULTY STATUS */}
                      <td className="cell-nowrap">
                        <span
                          className={getStatusBadgeClass(
                            pub.facultyApprovalStatus
                          )}
                        >
                          {pub.facultyApprovalStatus ||
                            "pending"}
                        </span>
                      </td>

                      {/* DIRECTORATE STATUS */}
                      <td className="cell-nowrap">
                        <span
                          className={getStatusBadgeClass(
                            pub.directorateApprovalStatus
                          )}
                        >
                          {pub.directorateApprovalStatus ||
                            "pending"}
                        </span>
                      </td>

                      {/* FINAL STATUS */}
                      <td className="cell-nowrap">
                        <span
                          className={getStatusBadgeClass(
                            pub.finalStatus
                          )}
                        >
                          {pub.finalStatus ||
                            "pending"}
                        </span>
                      </td>

                      {/* FILE */}
                      {showFileColumn && (
                        <td className="cell-nowrap">
                          {pub.upload ? (
                            <a
                              href={pub.upload}
                              target="_blank"
                              rel="noreferrer"
                              className="text-link"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-muted-light">
                              No file
                            </span>
                          )}
                        </td>
                      )}

                      {/* ACTIONS */}
                      {showActionsColumn && (
                        <td className="cell-nowrap">
                          <div className="actions-row">
                            {/* FACULTY ACTIONS */}
                            {facultyCanAct && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      pub._id,
                                      "approved"
                                    )
                                  }
                                  className="btn-action-approve"
                                >
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      pub._id,
                                      "rejected",
                                      askRejectionReason()
                                    )
                                  }
                                  className="btn-action-reject"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {/* DIRECTORATE ACTIONS */}
                            {directorateCanAct && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      pub._id,
                                      "approved"
                                    )
                                  }
                                  className="btn-action-approve"
                                >
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      pub._id,
                                      "rejected",
                                      askRejectionReason()
                                    )
                                  }
                                  className="btn-action-reject"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {/* NO ACTION */}
                            {!facultyCanAct &&
                              !directorateCanAct && (
                                <span className="cell-muted">
                                  No actions
                                </span>
                              )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </>
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {pagination.totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing{" "}
            {(
              (pagination.currentPage - 1) *
                pagination.pageSize +
              1
            )}{" "}
            -{" "}
            {Math.min(
              pagination.currentPage *
                pagination.pageSize,
              pagination.totalItems
            )}{" "}
            of{" "}
            {pagination.totalItems}{" "}
            publications
          </div>

          <div className="pagination-controls">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={!pagination.hasPreviousPage}
              className="pagination-nav-btn"
            >
              Previous
            </button>

            {Array.from(
              {
                length: pagination.totalPages,
              },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={
                  page === currentPage
                    ? "pagination-page-btn pagination-page-btn--active"
                    : "pagination-page-btn"
                }
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
              className="pagination-nav-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PublicationsPage;