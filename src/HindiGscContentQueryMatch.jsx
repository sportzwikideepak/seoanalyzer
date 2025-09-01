import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HindiGscContentQueryMatch() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc/hi/content-query-match`
      );
      setReports(res.data.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch Hindi content query match reports:", err);
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

  const parseGscQueries = (queriesJson) => {
    try {
      const queries = JSON.parse(queriesJson);
      return queries.slice(0, 5).map(q => q.keys[0]).join(', ');
    } catch (err) {
      return "N/A";
    }
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
          🔍 CA Hindi Content Query Match
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            marginBottom: "8px",
          }}
        >
          Content-Query Matching Analysis for Hindi Domain
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
                      <span style={{ color: "#6b7280" }}>Top Queries:</span>{" "}
                      <span style={{ fontWeight: "600" }}>
                        {parseGscQueries(report.gsc_queries)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#6b7280" }}>Impressions:</span>{" "}
                      <span style={{ fontWeight: "600" }}>
                        {formatNumber(report.impressions)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#6b7280" }}>Clicks:</span>{" "}
                      <span style={{ fontWeight: "600" }}>
                        {formatNumber(report.clicks)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#6b7280" }}>CTR:</span>{" "}
                      <span style={{ fontWeight: "600" }}>
                        {formatCTR(report.ctr)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#6b7280" }}>Position:</span>{" "}
                      <span style={{ fontWeight: "600" }}>
                        {formatPosition(report.position)}
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
      )}
    </div>
  );
}

export default HindiGscContentQueryMatch;
