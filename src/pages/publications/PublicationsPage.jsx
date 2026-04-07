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

      let filteredData = res.data || [];

      // Faculty and Student -> only own publications
      if (user?.role === "faculty" || user?.role === "student") {
        filteredData = filteredData.filter(
          (pub) => pub.uploadedBy?._id === user?._id
        );
      }

      // Admin -> only their department publications
      if (user?.role === "admin") {
        filteredData = filteredData.filter(
          (pub) => pub.department === user?.department
        );
      }

      // special_user -> all university publications
      // super_admin -> all
      // directorate -> all

      setPublications(filteredData);
    } catch (error) {
      console.error("FETCH PUBLICATIONS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `${API_BASE}/api/publications/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPublications();
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this publication?")) return;

    try {
      await axios.delete(`${API_BASE}/api/publications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchPublications();
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  const canAdd =
    user?.role === "super_admin" ||
    user?.role === "faculty" ||
    user?.role === "student";

  const canApproveReject =
    user?.role === "super_admin" || user?.role === "directorate";

  const canDelete = user?.role === "super_admin";

  const canDownload =
    user?.role === "super_admin" || user?.role === "directorate";

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-apolloBlue">Publications</h1>

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
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#6F7C83] border-b">
                <th className="py-3">Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Uploaded By</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {publications.map((pub) => (
                <tr key={pub._id} className="border-b hover:bg-[#F7F8F8]">
                  <td className="py-3 font-medium text-[#17313C]">
                    {pub.title || "Untitled"}
                  </td>

                  <td>{pub.department || "-"}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        pub.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : pub.status === "rejected"
                          ? "bg-red-100 text-red-500"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {pub.status || "pending"}
                    </span>
                  </td>

                  <td>{pub.uploadedBy?.name || "-"}</td>

                  <td>
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

                  <td className="flex gap-2 py-3">
                    {canApproveReject && (
                      <>
                        <button
                          onClick={() => handleStatusChange(pub._id, "approved")}
                          className="text-green-600 text-xs"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleStatusChange(pub._id, "rejected")}
                          className="text-red-500 text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(pub._id)}
                        className="text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    )}

                    {!canApproveReject && !canDelete && (
                      <span className="text-[#98A4AA] text-xs">View only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PublicationsPage;