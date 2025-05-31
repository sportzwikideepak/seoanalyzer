// ArticleSummaries.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function ArticleSummaries() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSummaries(page);
  }, [page]);

  const fetchSummaries = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://hammerhead-app-jkdit.ondigitalocean.app/api/article_summaries?page=${pageNum}`);
      if (res.data.success) {
        setSummaries(res.data.data);
        setTotalPages(res.data.totalPages);
      } else {
        setSummaries([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch summaries:", err);
      setSummaries([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Article Summaries</h1>
      {loading ? (
        <p>Loading summaries...</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>#</th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>URL</th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Created At</th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {summaries.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 20, textAlign: "center" }}>
                    No summaries found.
                  </td>
                </tr>
              )}
              {summaries.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <tr>
                    <td style={{ padding: 8 }}>{(page - 1) * 10 + idx + 1}</td>
                    <td style={{ padding: 8 }}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: "#1a73e8" }}>
                        {item.url}
                      </a>
                    </td>
                    <td style={{ padding: 8 }}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td style={{ padding: 8 }}>
                      <button
                        onClick={() => toggleOpen(item.id)}
                        style={{ cursor: "pointer", background: "none", border: "none", color: "#1a73e8" }}
                        aria-expanded={openId === item.id}
                        aria-controls={`details-${item.id}`}
                      >
                        {openId === item.id ? "Hide" : "Show"} Summaries
                      </button>
                    </td>
                  </tr>
                  {openId === item.id && (
                    <tr>
                      <td colSpan={4} style={{ background: "#f9f9f9", padding: 16, fontSize: 14 }}>
                        <div style={{ marginBottom: 12 }}>
                          <strong>60-word summary:</strong>
                          <p>{item.summary_60 || "Not available."}</p>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <strong>100-word summary:</strong>
                          <p>{item.summary_100 || "Not available."}</p>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <strong>250-word summary:</strong>
                          <p>{item.summary_250 || "Not available."}</p>
                        </div>
                        <div>
                          <strong>600-900 word summary:</strong>
                          <p>{item.summary_900 || "Not available."}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                marginRight: 10,
                padding: "8px 12px",
                cursor: page <= 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{
                marginLeft: 10,
                padding: "8px 12px",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ArticleSummaries;
