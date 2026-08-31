import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { PUBLICATION_TYPES } from "../../config/publicationTypes";

const API_BASE = "https://rms-897z.onrender.com";

const exportTypeOptions = [
  { value: "all", label: "All Publications" },
  ...PUBLICATION_TYPES.map((type) => ({
    value: type.value,
    label: type.label,
  })),
];

const formatReportDate = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

// ============================================================
// METRICS PAGE
// ============================================================

const MetricsPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ==========================================================
  // DEFAULT DATES
  // ==========================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];


  // ==========================================================
  // STATE
  // ==========================================================

  const [fromDate, setFromDate] =
    useState(firstDayOfMonth);

  const [toDate, setToDate] =
    useState(today);

  const [chartData, setChartData] =
    useState([]);

  const [totalPublications, setTotalPublications] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [downloading, setDownloading] =
    useState(false);

  const [exportType, setExportType] =
    useState("all");

  const [errorMsg, setErrorMsg] =
    useState("");

  const maxChartValue = Math.max(
    ...chartData.map((item) => Number(item.value) || 0),
    1
  );


  // ==========================================================
  // FETCH METRICS
  // ==========================================================

  const fetchMetrics = async () => {

    try {

      setLoading(true);
      setErrorMsg("");

      const response =
        await axios.get(
          `${API_BASE}/api/reports/publications`,
          {
            params: {
              from: fromDate,
              to: toDate,
            },

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      console.log(
        "METRICS RESPONSE:",
        response.data
      );


      setChartData(
        response.data.data || []
      );


      setTotalPublications(
        response.data.total || 0
      );


    } catch (error) {

      console.error(
        "METRICS FETCH ERROR:",
        error.response?.data ||
          error.message
      );


      setErrorMsg(
        error.response?.data?.message ||
          "Failed to load publication metrics"
      );


      setChartData([]);
      setTotalPublications(0);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    if (token) {
      fetchMetrics();
    }

  }, []);


  // ==========================================================
  // APPLY DATE FILTER
  // ==========================================================

  const handleApply = () => {

    setErrorMsg("");


    if (!fromDate || !toDate) {

      setErrorMsg(
        "Please select both From Date and To Date"
      );

      return;

    }


    if (fromDate > toDate) {

      setErrorMsg(
        "From Date cannot be greater than To Date"
      );

      return;

    }


    fetchMetrics();

  };


  // ==========================================================
  // DOWNLOAD EXCEL
  // IMPORTANT:
  // Uses SAME fromDate and toDate
  // ==========================================================

  const handleDownloadExcel = async (
    selectedType = exportType
  ) => {

    try {

      setErrorMsg("");


      if (!fromDate || !toDate) {

        setErrorMsg(
          "Please select both From Date and To Date"
        );

        return;

      }


      if (fromDate > toDate) {

        setErrorMsg(
          "From Date cannot be greater than To Date"
        );

        return;

      }


      setDownloading(true);


      const response =
        await axios.get(
          `${API_BASE}/api/reports/publications/excel`,
          {
            params: {
              type: selectedType,
              from: fromDate,
              to: toDate,
            },

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            responseType: "blob",
          }
        );


      // ======================================================
      // CREATE DOWNLOAD
      // ======================================================

      const blob =
        new Blob(
          [response.data],
          {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }
        );


      const downloadUrl =
        window.URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      link.href =
        downloadUrl;


      link.download =
        `publication-report-${fromDate}-to-${toDate}.xlsx`;


      document.body.appendChild(link);


      link.click();


      link.remove();


      window.URL.revokeObjectURL(
        downloadUrl
      );


    } catch (error) {

      console.error(
        "EXCEL DOWNLOAD ERROR:",
        error
      );


      // ======================================================
      // IMPORTANT:
      // Axios returns the error response as Blob
      // ======================================================

      setErrorMsg(
        "Failed to download Excel report"
      );

    } finally {

      setDownloading(false);

    }

  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <DashboardLayout>

      <div>

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="page-header-row">

          <div className="page-header-col">

            <h1 className="page-title">
              Performance Metrics
            </h1>

            <p className="page-subtitle">
              View publication performance based on
              the selected date range.
            </p>

          </div>


          {/* ================================================= */}
          {/* EXCEL BUTTON */}
          {/* ================================================= */}

          {user?.role === "super_admin" && (

            <div className="export-dropdown-group">

              <select
                value={exportType}
                onChange={(event) =>
                  setExportType(event.target.value)
                }
                className="export-dropdown"
                aria-label="Select publication type for Excel export"
              >

                {exportTypeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}

              </select>

              <button
                type="button"
                onClick={() =>
                  handleDownloadExcel(exportType)
                }
                disabled={downloading}
                className="btn-teal"
              >

                {downloading
                  ? "Downloading..."
                  : "Download Excel"}

              </button>

            </div>

          )}

        </div>


        {/* ================================================== */}
        {/* DATE FILTER */}
        {/* ================================================== */}

        <div className="filter-card-lg">

          <div className="filter-grid">


            {/* ============================================== */}
            {/* FROM DATE */}
            {/* ============================================== */}

            <div>

              <label className="form-label-sm">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(event) =>
                  setFromDate(
                    event.target.value
                  )
                }
                className="form-input-date"
              />

            </div>


            {/* ============================================== */}
            {/* TO DATE */}
            {/* ============================================== */}

            <div>

              <label className="form-label-sm">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(event) =>
                  setToDate(
                    event.target.value
                  )
                }
                className="form-input-date"
              />

            </div>


            {/* ============================================== */}
            {/* APPLY */}
            {/* ============================================== */}

            <div>

              <button
                type="button"
                onClick={handleApply}
                disabled={loading}
                className="btn-teal-solid"
              >

                {loading
                  ? "Loading..."
                  : "Apply"}

              </button>

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {errorMsg && (

          <div className="alert-error">
            {errorMsg}
          </div>

        )}


        {/* ================================================== */}
        {/* TOTAL PUBLICATIONS */}
        {/* ================================================== */}

        <div className="content-card-xl mb-6">

          <div>

            <p className="text-muted">
              Total Publications
            </p>

            <h2
              className="text-3xl font-bold"
            >
              {totalPublications}
            </h2>

            <p className="text-muted">
              {fromDate} → {toDate}
            </p>

          </div>

        </div>


        {/* ================================================== */}
        {/* CHART */}
        {/* ================================================== */}

        <div className="metrics-chart-card">
          {loading ? (

            <div className="metrics-chart-empty">
              Loading metrics...
            </div>

          ) : chartData.length === 0 ? (

            <div className="metrics-chart-empty">
              No data available for selected range
            </div>

          ) : (

            <div className="metrics-chart">
              <div className="metrics-chart-heading">
                <h2 className="section-heading">
                  Publications by Type
                </h2>
                <p className="text-muted">
                  {formatReportDate(fromDate)} to {formatReportDate(toDate)}
                </p>
              </div>

              <div className="metrics-chart-rows">
                {chartData.map((item) => {
                  const value = Number(item.value) || 0;
                  const width = `${(value / maxChartValue) * 100}%`;

                  return (
                    <div className="metrics-chart-row" key={item.label}>
                      <span className="metrics-chart-label">{item.label}</span>
                      <span className="metrics-chart-track">
                        <span
                          className="metrics-chart-bar"
                          style={{ width }}
                        />
                      </span>
                      <span className="metrics-chart-value">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          )}

        </div>

      </div>

    </DashboardLayout>

  );

};


export default MetricsPage;