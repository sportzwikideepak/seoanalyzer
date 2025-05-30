// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function GscAiReports() {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openDropdownId, setOpenDropdownId] = useState(null);

//   useEffect(() => {
//     async function fetchReports() {
//       try {
//         const res = await axios.get('https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-ai-reports');
//         setReports(res.data.data || []);
//       } catch (err) {
//         console.error('❌ Failed to fetch reports:', err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchReports();
//   }, []);

//   const toggleDropdown = (id) => {
//     setOpenDropdownId(openDropdownId === id ? null : id);
//   };

//   const formatMarkdown = (text) => {
//     if (!text) return 'No suggestions available.';

//     return text
//       .replace(/^(\d+\.\s+.*)/gm, '<h3 style="font-weight: 700; color: #374151; margin-bottom: 6px;">$1</h3>')
//       .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//       .replace(/^- (.*)/gm, '<li style="margin-bottom: 4px;">$1</li>')
//       .replace(/---/g, '<hr style="margin: 16px 0; border-color: #e5e7eb;" />')
//       .replace(/[\*#]+/g, '')
//       .replace(/\n/g, '<br />');
//   };

//   return (
//     <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '16px', color: '#1f2937', fontFamily: 'sans-serif' }}>
//       <div className="header" style={{ textAlign: 'center', marginBottom: '32px' }}>
//         <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5', marginBottom: '4px' }}>📈 GSC AI Recommendations</h1>
//         <p style={{ fontSize: '14px', color: '#6b7280' }}>Based on Google Search Console + AI SEO Insights</p>
//       </div>

//       <div className="container" style={{ maxWidth: '1280px', margin: 'auto' }}>
//         <div className="card" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', overflowX: 'auto' }}>
//           <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px', marginTop: '4px' }}>Top Performing URLs</h2>

//           {loading ? (
//             <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Loading...</p>
//           ) : (
//             <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>URL</th>
//                   <th>Impr.</th>
//                   <th>Clicks</th>
//                   <th>CTR</th>
//                   <th>Pos</th>
//                   <th>Date</th>
//                   <th>More</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reports.map((r, i) => (
//                   <React.Fragment key={r.id || i}>
//                     <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
//                       <td>{i + 1}</td>
//                       <td>
//                         <a href={r.url} style={{ color: '#2563eb', textDecoration: 'underline', display: 'block', wordBreak: 'break-all' }} target="_blank" rel="noopener noreferrer">
//                           {r.url}
//                         </a>
//                       </td>
//                       <td>{r.impressions}</td>
//                       <td>{r.clicks}</td>
//                       <td>{(r.ctr * 100).toFixed(2)}%</td>
//                       <td>{r.position.toFixed(2)}</td>
//                       <td>{new Date(r.created_at).toLocaleDateString()}</td>
//                       <td>
//                         <button onClick={() => toggleDropdown(r.id || i)} style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer' }}>
//                           Details {openDropdownId === (r.id || i) ? '⬆️' : '⬇️'}
//                         </button>
//                       </td>
//                     </tr>
//                     {openDropdownId === (r.id || i) && (
//                       <tr>
//                         <td colSpan="8">
//                           <div className="dropdown-box" style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                             <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#7c3aed', marginBottom: '12px' }}>🔍 AI SEO Suggestions</h2>
//                             <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
//                               <strong>URL:</strong>{' '}
//                               <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>{r.url}</a>
//                             </p>
//                             <div className="suggestions" style={{ fontSize: '14px', color: '#374151' }} dangerouslySetInnerHTML={{ __html: formatMarkdown(r.deepseek_output) }} />
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GscAiReports;

//pagination

import React, { useEffect, useState } from "react";
import axios from "axios";

function GscAiReports() {
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
        `https://hammerhead-app-jkdit.ondigitalocean.app/api/gsc-ai-reports?page=${pageNum}`
      );
      setReports(res.data.data || []);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
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
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Based on Google Search Console + AI SEO Insights
        </p>
      </div>

      <div className="container" style={{ maxWidth: "1280px", margin: "auto" }}>
        <div
          className="card"
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "16px",
            overflowX: "auto",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "16px",
              marginTop: "4px",
            }}
          >
            Top Performing URLs
          </h2>

          {loading ? (
            <p style={{ color: "#6b7280", fontStyle: "italic" }}>Loading...</p>
          ) : (
            <>
              <table
                className="seo-table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>URL</th>
                    <th>Impr.</th>
                    <th>Clicks</th>
                    <th>CTR</th>
                    <th>Pos</th>
                    <th>Date</th>
                    <th>More</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => (
                    <React.Fragment key={r.id || i}>
                      <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td>{(page - 1) * 80 + i + 1}</td>
                        <td>
                          <a
                            href={r.url}
                            style={{
                              color: "#2563eb",
                              textDecoration: "underline",
                              display: "block",
                              wordBreak: "break-all",
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {r.url}
                          </a>
                        </td>
                        <td>{r.impressions}</td>
                        <td>{r.clicks}</td>
                        <td>{(r.ctr * 100).toFixed(2)}%</td>
                        <td>{r.position.toFixed(2)}</td>
                        <td>{new Date(r.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => toggleDropdown(r.id || i)}
                            style={{
                              color: "#4f46e5",
                              background: "none",
                              border: "none",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            Details{" "}
                            {openDropdownId === (r.id || i) ? "⬆️" : "⬇️"}
                          </button>
                        </td>
                      </tr>
                      {openDropdownId === (r.id || i) && (
                        <tr>
                          <td colSpan="8">
                            <div
                              className="dropdown-box"
                              style={{
                                background: "white",
                                padding: "16px",
                                borderRadius: "8px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              }}
                            >
                              <h2
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "700",
                                  color: "#7c3aed",
                                  marginBottom: "12px",
                                }}
                              >
                                🔍 AI SEO Suggestions
                              </h2>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#6b7280",
                                  marginBottom: "12px",
                                }}
                              >
                                <strong>URL:</strong>{" "}
                                <a
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#2563eb",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {r.url}
                                </a>
                              </p>
                              <div
                                className="suggestions"
                                style={{ fontSize: "14px", color: "#374151" }}
                                dangerouslySetInnerHTML={{
                                  __html: formatMarkdown(r.deepseek_output),
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  style={{
                    marginRight: "10px",
                    padding: "8px 12px",
                    backgroundColor: "#4f46e5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: page <= 1 ? "not-allowed" : "pointer",
                  }}
                >
                  ◀ Previous
                </button>
                <span style={{ fontSize: "14px", margin: "0 10px" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page >= totalPages}
                  style={{
                    marginLeft: "10px",
                    padding: "8px 12px",
                    backgroundColor: "#4f46e5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: page >= totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next ▶
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GscAiReports;
