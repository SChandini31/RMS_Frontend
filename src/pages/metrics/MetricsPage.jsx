import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const API_BASE = "https://rms-897z.onrender.com";

const MetricsPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const today = new Date().toISOString().split("T")[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.get(
        `${API_BASE}/api/reports/publications?from=${fromDate}&to=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChartData(res.data.data || []);
    } catch (error) {
      console.error("METRICS FETCH ERROR:", error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || "Failed to load metrics");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMetrics();
    }
  }, []);

  const handleApply = () => {
    if (!fromDate || !toDate) {
      setErrorMsg("Please select both from and to dates");
      return;
    }

    if (fromDate > toDate) {
      setErrorMsg("From date cannot be greater than To date");
      return;
    }

    fetchMetrics();
  };

  const handleDownload = async (type) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/reports/publications/export/${type}?from=${fromDate}&to=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type:
          type === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        type === "excel"
          ? `publication-report-${fromDate}-to-${toDate}.xlsx`
          : `publication-report-${fromDate}-to-${toDate}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`DOWNLOAD ${type.toUpperCase()} ERROR:`, error.response?.data || error.message);
      setErrorMsg(
        error.response?.data?.message || `Failed to download ${type.toUpperCase()} file`
      );
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-apolloBlue">Performance Metrics</h1>
            <p className="text-sm text-[#7A878E] mt-1">
              View performance trends based on selected date range and download reports.
            </p>
          </div>

          {user?.role === "super_admin" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload("excel")}
                className="px-4 py-2 rounded-xl bg-[#0A6F8F] text-white text-sm hover:bg-[#08586F] transition"
              >
                Excel
              </button>
              <button
                onClick={() => handleDownload("pdf")}
                className="px-4 py-2 rounded-xl bg-[#F4B400] text-white text-sm hover:bg-[#D99A00] transition"
              >
                PDF
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow border border-apolloBorder mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-[#6F7C83] mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-apolloBorder px-4 py-3 outline-none focus:ring-2 focus:ring-[#BFE5EC]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6F7C83] mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-apolloBorder px-4 py-3 outline-none focus:ring-2 focus:ring-[#BFE5EC]"
              />
            </div>

            <div>
              <button
                onClick={handleApply}
                className="w-full rounded-xl bg-[#1B7F8B] text-white px-4 py-3 font-medium hover:bg-[#176B75] transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow border border-apolloBorder">
          {loading ? (
            <p className="text-[#7A878E]">Loading chart...</p>
          ) : chartData.length === 0 ? (
            <div className="h-[320px] flex items-center justify-center text-[#98A4AA]">
              No data available for selected range
            </div>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0A6F8F"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MetricsPage;