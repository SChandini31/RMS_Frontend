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

      setPublications(res.data || []);
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

  const canAdd =
    user?.role === "faculty" || user?.role === "student";

  const canDownload =
    user?.role === "super_admin" ||
    user?.role === "faculty" ||
    user?.role === "directorate";

  const isFaculty = user?.role === "faculty";
  const isDirectorate = user?.role === "directorate";

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

        {canAdd && (
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
          <table className="w-full min-w-[1200px] text-sm">
            <thead>
              <tr className="text-left text-[#6F7C83] border-b">
                <th className="py-3 pr-4">Title</th>
                <th className="pr-4">Department</th>
                <th className="pr-4">Uploaded By</th>
                <th className="pr-4">Faculty Status</th>
                <th className="pr-4">Directorate Status</th>
                <th className="pr-4">Final Status</th>
                <th className="pr-4">File</th>
                <th>Actions</th>
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
                  <tr key={pub._id} className="border-b hover:bg-[#F7F8F8] align-top">
                    <td className="py-3 pr-4 font-medium text-[#17313C]">
                      {pub.title || "Untitled"}
                    </td>

                    <td className="pr-4">{pub.department || "-"}</td>

                    <td className="pr-4">{pub.uploadedBy?.name || "-"}</td>

                    <td className="pr-4">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeClass(
                          pub.facultyApprovalStatus
                        )}`}
                      >
                        {pub.facultyApprovalStatus || "pending"}
                      </span>
                    </td>

                    <td className="pr-4">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeClass(
                          pub.directorateApprovalStatus
                        )}`}
                      >
                        {pub.directorateApprovalStatus || "pending"}
                      </span>
                    </td>

                    <td className="pr-4">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeClass(
                          pub.finalStatus
                        )}`}
                      >
                        {pub.finalStatus || "pending"}
                      </span>
                    </td>

                    <td className="pr-4">
                      {pub.upload && canDownload ? (
                        <a
                          href={pub.upload}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#1B7F8B] underline"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-[#98A4AA]">Not allowed</span>
                      )}
                    </td>

                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        {facultyCanAct && (
                          <>
                            <button
                              onClick={() => handleStatusChange(pub._id, "approved")}
                              className="text-green-600 text-xs font-medium"
                            >
                              Faculty Approve
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
                              Faculty Reject
                            </button>
                          </>
                        )}

                        {directorateCanAct && (
                          <>
                            <button
                              onClick={() => handleStatusChange(pub._id, "approved")}
                              className="text-green-600 text-xs font-medium"
                            >
                              Directorate Approve
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
                              Directorate Reject
                            </button>
                          </>
                        )}

                        {!facultyCanAct && !directorateCanAct && (
                          <span className="text-[#98A4AA] text-xs">View only</span>
                        )}
                      </div>
                    </td>
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