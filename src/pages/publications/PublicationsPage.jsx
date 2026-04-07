import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://rms-897z.onrender.com";

const PublicationsPage = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const isSuperAdmin = user?.role === "super_admin";
  const isFaculty = user?.role === "faculty";
  const isDirectorate = user?.role === "directorate";
  const isStudent = user?.role === "student";

  const showAddButton = isSuperAdmin || isFaculty || isStudent;
  const showFileColumn = isSuperAdmin || isFaculty || isDirectorate;
  const showActionsColumn = isFaculty || isDirectorate;

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
  try {
    setLoading(true);

    const res = await axios.get(`${API_BASE}/api/publications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let filteredData = res.data || [];

    // only student should be restricted to own publications on frontend
    if (user?.role === "student") {
      filteredData = filteredData.filter(
        (pub) => pub.uploadedBy?._id === user?._id
      );
    }

    // admin -> department only
    if (user?.role === "admin") {
      filteredData = filteredData.filter(
        (pub) => pub.department === user?.department
      );
    }

    setPublications(filteredData);
  } catch (error) {
    console.error("FETCH PUBLICATIONS ERROR:", error);
  } finally {
    setLoading(false);
  }
};

  const handleStatusChange = async (id, status, rejectionReason = "") => {
    try {
      await axios.put(
        `${API_BASE}/api/publications/${id}/status`,
        { status, rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPublications();
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update publication status"
      );
    }
  };

  const askRejectionReason = () => {
    const reason = window.prompt("Enter rejection reason:");
    return reason || "";
  };

  const getStatusBadgeClass = (status) => {
    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }
    if (status === "rejected") {
      return "bg-red-100 text-red-600";
    }
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-apolloBlue">Publications</h1>
          <p className="text-sm text-[#7A878E] mt-1">
            Manage and review publication records.
          </p>
        </div>

        {showAddButton && (
          <Link
            to="/publications/add"
            className="bg-apolloBlue text-white px-4 py-2 rounded-xl"
          >
            Add Publication
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow border border-apolloBorder overflow-x-auto">
        {loading ? (
          <p className="text-[#7A878E]">Loading publications...</p>
        ) : publications.length === 0 ? (
          <p className="text-[#98A4AA]">No publications found</p>
        ) : (
          <table className="w-full min-w-[1050px] text-sm">
            <thead>
              <tr className="text-left text-[#6F7C83] border-b">
                <th className="py-3 pr-4">Title</th>
                <th className="pr-4">Department</th>
                <th className="pr-4">Uploaded By</th>
                <th className="pr-4">Faculty Status</th>
                <th className="pr-4">Directorate Status</th>
                <th className="pr-4">Final Status</th>
                {showFileColumn && <th className="pr-4">File</th>}
                {showActionsColumn && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {publications.map((pub) => {
                const facultyCanAct =
                  isFaculty && pub.facultyApprovalStatus === "pending";

                const directorateCanAct =
                  isDirectorate &&
                  pub.facultyApprovalStatus === "approved" &&
                  pub.directorateApprovalStatus === "pending" &&
                  pub.finalStatus === "pending";

                return (
                  <tr
                    key={pub._id}
                    className="border-b hover:bg-[#F7F8F8] align-middle"
                  >
                    <td className="py-4 pr-4 font-medium text-[#17313C] whitespace-nowrap">
                      {pub.title || "Untitled"}
                    </td>

                    <td className="pr-4 whitespace-nowrap">
                      {pub.department || "-"}
                    </td>

                    <td className="pr-4 whitespace-nowrap">
                      {pub.uploadedBy?.name || "-"}
                    </td>

                    <td className="pr-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeClass(
                          pub.facultyApprovalStatus
                        )}`}
                      >
                        {pub.facultyApprovalStatus || "pending"}
                      </span>
                    </td>

                    <td className="pr-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeClass(
                          pub.directorateApprovalStatus
                        )}`}
                      >
                        {pub.directorateApprovalStatus || "pending"}
                      </span>
                    </td>

                    <td className="pr-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeClass(
                          pub.finalStatus
                        )}`}
                      >
                        {pub.finalStatus || "pending"}
                      </span>
                    </td>

                    {showFileColumn && (
                      <td className="pr-4 whitespace-nowrap">
                        {pub.upload ? (
                          <a
                            href={pub.upload}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1B7F8B] underline"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-[#98A4AA]">No file</span>
                        )}
                      </td>
                    )}

                    {showActionsColumn && (
                      <td className="py-4 whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          {facultyCanAct && (
                            <>
                              <button
                                onClick={() => handleStatusChange(pub._id, "approved")}
                                className="text-green-600 text-xs font-medium"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    pub._id,
                                    "rejected",
                                    askRejectionReason()
                                  )
                                }
                                className="text-red-500 text-xs font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {directorateCanAct && (
                            <>
                              <button
                                onClick={() => handleStatusChange(pub._id, "approved")}
                                className="text-green-600 text-xs font-medium"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    pub._id,
                                    "rejected",
                                    askRejectionReason()
                                  )
                                }
                                className="text-red-500 text-xs font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {!facultyCanAct && !directorateCanAct && (
                            <span className="text-[#98A4AA] text-xs">No actions</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PublicationsPage;