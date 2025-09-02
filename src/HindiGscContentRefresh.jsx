import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HindiGscContentRefresh() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const fetchReports = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc/hi/content-refresh?page=${pageNum}`
      );
      setReports(res.data.data || []);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Failed to fetch Hindi content refresh reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const formatMarkdown = (text) => {
    if (!text) return "कोई सुझाव उपलब्ध नहीं है।";

    return text
      .replace(
        /^(\d+\.\s+.*)/gm,
        '<h3 style="font-weight: 700; color: #374151; margin-bottom: 6px;">$1</h3>'
      )
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/^- (.*)/gm, '<li style="margin-bottom: 4px;">$1</li>')
      .replace(/---/g, '<hr style="margin: 16px 0; border-color: #e5e7eb;" />')
      .replace(/[\*#]+/g, "")
      .replace(/\n/g, "<br />");
  };

  // Helper functions for safe formatting
  const formatPosition = (position) => {
    if (position === null || position === undefined) return "N/A";
    const num = parseFloat(position);
    return isNaN(num) ? "N/A" : num.toFixed(1);
  };

  const formatCTR = (ctr) => {
    if (ctr === null || ctr === undefined) return "0.00%";
    const num = parseFloat(ctr);
    return isNaN(num) ? "0.00%" : (num * 100).toFixed(2) + "%";
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    const parsed = parseFloat(num);
    return isNaN(parsed) ? "0" : parsed.toLocaleString();
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        padding: "16px",
        color: "#1f2937",
        fontFamily: "sans-serif",
      }}
    >
      <div
        className="header"
        style={{ textAlign: "center", marginBottom: "32px" }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#4f46e5",
            marginBottom: "4px",
          }}
        >
          🔄 CA Hindi Content Refresh
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            marginBottom: "8px",
          }}
        >
          Content Refresh Recommendations for Hindi Domain
        </p>
        <div
          style={{
            fontSize: "14px",
            color: "#9ca3af",
            padding: "8px 16px",
            background: "#f3f4f6",
            borderRadius: "20px",
            display: "inline-block",
          }}
        >
          Cricket Addictor (Hindi) • https://hindi.cricketaddictor.com
        </div>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            fontSize: "18px",
            color: "#6b7280",
          }}
        >
          Loading...
        </div>
      ) : reports.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            fontSize: "18px",
            color: "#6b7280",
          }}
        >
          No data found
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "8px",
                        wordBreak: "break-all",
                      }}
                    >
                      {report.url}
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "12px",
                        fontSize: "14px",
                      }}
                    >
                      <div>
                        <span style={{ color: "#6b7280" }}>Keyword:</span>{" "}
                        <span style={{ fontWeight: "600" }}>
                          {report.keyword || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>Old Position:</span>{" "}
                        <span style={{ fontWeight: "600" }}>
                          {formatPosition(report.old_position)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>New Position:</span>{" "}
                        <span style={{ fontWeight: "600" }}>
                          {formatPosition(report.new_position)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>Old Clicks:</span>{" "}
                        <span style={{ fontWeight: "600" }}>
                          {formatNumber(report.old_clicks)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>New Clicks:</span>{" "}
                        <span style={{ fontWeight: "600" }}>
                          {formatNumber(report.new_clicks)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>Old Impressions:</span>{" "}
                        <span style={{ fontWeight: "600" }}>
                          {formatNumber(report.old_impressions)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>New Impressions:</span>{" "}
                        <span style={{ fontWeight: "600" }}>
                          {formatNumber(report.new_impressions)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleDropdown(report.id)}
                    style={{
                      background: "#4f46e5",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {openDropdownId === report.id ? 'Hide' : 'View'}
                  </button>
                </div>

                {openDropdownId === report.id && (
                  <div
                    style={{
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: "16px",
                      marginTop: "16px",
                    }}
                  >
                    <div
                      style={{
                        background: "#f9fafb",
                        padding: "16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: formatMarkdown(report.deepseek_output),
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "32px",
              }}
            >
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #d1d5db",
                  background: page === 1 ? "#f3f4f6" : "white",
                  color: page === 1 ? "#9ca3af" : "#374151",
                  borderRadius: "6px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>
              <span style={{ color: "#6b7280" }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #d1d5db",
                  background: page === totalPages ? "#f3f4f6" : "white",
                  color: page === totalPages ? "#9ca3af" : "#374151",
                  borderRadius: "6px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HindiGscContentRefresh;
