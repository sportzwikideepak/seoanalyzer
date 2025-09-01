import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HindiGscRankingWatchdog() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc/hi/ranking-watchdog`
      );
      setReports(res.data.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch Hindi ranking watchdog reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for safe formatting
  const formatPosition = (position) => {
    if (position === null || position === undefined) return "N/A";
    const num = parseFloat(position);
    return isNaN(num) ? "N/A" : num.toFixed(1);
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    const parsed = parseFloat(num);
    return isNaN(parsed) ? "0" : parsed.toLocaleString();
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
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
          🚨 CA Hindi Ranking Watchdog
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            marginBottom: "8px",
          }}
        >
          Ranking Drop Alerts for Hindi Domain
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
          No alerts found
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
                borderLeft: `4px solid ${getSeverityColor(report.severity)}`,
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
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
                  <span
                    style={{
                      background: getSeverityColor(report.severity),
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {report.severity}
                  </span>
                </div>
                
                <div
                  style={{
                    background: "#fef3c7",
                    border: "1px solid #f59e0b",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <p style={{ margin: 0, color: "#92400e", fontWeight: "500" }}>
                    {report.message}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: "12px",
                    fontSize: "14px",
                  }}
                >
                  <div>
                    <span style={{ color: "#6b7280" }}>Alert Type:</span>{" "}
                    <span style={{ fontWeight: "600", textTransform: "capitalize" }}>
                      {report.alert_type?.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Clicks:</span>{" "}
                    <span style={{ fontWeight: "600" }}>
                      {formatNumber(report.clicks)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Impressions:</span>{" "}
                    <span style={{ fontWeight: "600" }}>
                      {formatNumber(report.impressions)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HindiGscRankingWatchdog;
