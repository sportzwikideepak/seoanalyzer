import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GscAiReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchReports(page, sortBy, sortOrder);
  }, [page, sortBy, sortOrder]);

  const fetchReports = async (pageNum, sortField, order) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-ai-reports?page=${pageNum}&sortBy=${sortField}&sortOrder=${order}`
      );
      setReports(res.data.data || []);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Failed to fetch reports:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReports(page, sortBy, sortOrder);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const formatMarkdown = (text) => {
    if (!text) return "No suggestions available.";
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

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    
    const date = new Date(dateString);
    
    // Format: "8:01AM 21st November"
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    
    // Convert to 12-hour format
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const minutesStr = minutes.toString().padStart(2, '0');
    
    // Get day suffix (st, nd, rd, th)
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    const formattedDate = `${hour12}:${minutesStr}${ampm} ${day}${getDaySuffix(day)} ${month}`;
    
    return {
      full: formattedDate,
      relative: formattedDate
    };
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return '↕️';
    }
    return sortOrder === 'asc' ? '↑' : '↓';
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
          📈 GSC AI Recommendations
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            marginBottom: "8px",
          }}
        >
          Based on Google Search Console + AI SEO Insights
        </p>
        <div
          style={{
            fontSize: "14px",
            color: "#9ca3af",
            padding: "8px 16px",
            background: "#f3f4f6",
            borderRadius: "20px",
            display: "inline-block",
            marginBottom: "16px",
          }}
        >
          Cricket Addictor (English) • https://cricketaddictor.com
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          style={{
            background: refreshing ? "#9ca3af" : "#4f46e5",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: refreshing || loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0 auto",
          }}
        >
          {refreshing ? "🔄 Refreshing..." : "🔄 Refresh Data"}
        </button>
      </div>

      {/* Sort Controls */}
      {!loading && reports.length > 0 && (
        <div
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "16px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#6b7280", fontSize: "14px", fontWeight: "600" }}>
              Sort by:
            </span>
            <button
              onClick={() => handleSort('impressions')}
              style={{
                padding: "6px 12px",
                border: sortBy === 'impressions' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                background: sortBy === 'impressions' ? "#eef2ff" : "white",
                color: sortBy === 'impressions' ? "#4f46e5" : "#374151",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: sortBy === 'impressions' ? "600" : "500",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Impressions {getSortIcon('impressions')}
            </button>
            <button
              onClick={() => handleSort('clicks')}
              style={{
                padding: "6px 12px",
                border: sortBy === 'clicks' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                background: sortBy === 'clicks' ? "#eef2ff" : "white",
                color: sortBy === 'clicks' ? "#4f46e5" : "#374151",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: sortBy === 'clicks' ? "600" : "500",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Clicks {getSortIcon('clicks')}
            </button>
            <button
              onClick={() => handleSort('ctr')}
              style={{
                padding: "6px 12px",
                border: sortBy === 'ctr' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                background: sortBy === 'ctr' ? "#eef2ff" : "white",
                color: sortBy === 'ctr' ? "#4f46e5" : "#374151",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: sortBy === 'ctr' ? "600" : "500",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              CTR {getSortIcon('ctr')}
            </button>
            <button
              onClick={() => handleSort('position')}
              style={{
                padding: "6px 12px",
                border: sortBy === 'position' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                background: sortBy === 'position' ? "#eef2ff" : "white",
                color: sortBy === 'position' ? "#4f46e5" : "#374151",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: sortBy === 'position' ? "600" : "500",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Position {getSortIcon('position')}
            </button>
            <button
              onClick={() => handleSort('created_at')}
              style={{
                padding: "6px 12px",
                border: sortBy === 'created_at' ? "2px solid #4f46e5" : "1px solid #d1d5db",
                background: sortBy === 'created_at' ? "#eef2ff" : "white",
                color: sortBy === 'created_at' ? "#4f46e5" : "#374151",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: sortBy === 'created_at' ? "600" : "500",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Date Added {getSortIcon('created_at')}
            </button>
          </div>
        </div>
      )}

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
            {reports.map((report) => {
              const dateInfo = formatDate(report.created_at);
              return (
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
                      
                      {/* Date Display */}
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          marginBottom: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ color: "#9ca3af" }}>📅</span>
                        <span>
                          Added: {dateInfo.full}
                        </span>
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
                          <span style={{ color: "#6b7280" }}>Impressions:</span>{" "}
                          <span style={{ fontWeight: "600" }}>
                            {report.impressions?.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "#6b7280" }}>Clicks:</span>{" "}
                          <span style={{ fontWeight: "600" }}>
                            {report.clicks?.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "#6b7280" }}>CTR:</span>{" "}
                          <span style={{ fontWeight: "600" }}>
                            {((report.ctr || 0) * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "#6b7280" }}>Position:</span>{" "}
                          <span style={{ fontWeight: "600" }}>
                            {report.position?.toFixed(1)}
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
              );
            })}
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

export default GscAiReports;