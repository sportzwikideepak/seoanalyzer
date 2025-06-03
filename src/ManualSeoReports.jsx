import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

function ManualSeoReports() {
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReportData, setSelectedReportData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const fetchReports = async (pageNum = 1) => {
    const res = await axios.get(`${API_BASE}/manual-seo-reports?page=${pageNum}`);
    setReports(res.data.data);
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);
  };

  const handleSelectReport = async (id) => {
    if (selectedReportId === id) {
      setSelectedReportId(null);
      setSelectedReportData(null);
      return;
    }

    const res = await axios.get(`${API_BASE}/manual-seo-reports/${id}`);
    setSelectedReportId(id);
    setSelectedReportData(res.data.data);
  };

  const parseReport = (text) => {
    if (!text) return { tableMarkdown: null, rewrite: "" };

    const lines = text.split("\n");
    const tableStart = lines.findIndex(line =>
      line.toLowerCase().includes("| section") && line.includes("|")
    );

    if (tableStart === -1) return { tableMarkdown: null, rewrite: text };

    const tableLines = [];
    for (let i = tableStart; i < lines.length; i++) {
      if (!lines[i].includes("|")) break;
      tableLines.push(lines[i]);
    }

    const tableMarkdown = tableLines.join("\n").trim();
    const rewrite = lines.slice(tableStart + tableLines.length).join("\n").trim();

    return { tableMarkdown, rewrite };
  };

  const renderMarkdownTable = (markdown) => {
    if (!markdown) return <p>No SEO GAP Report found.</p>;

    const lines = markdown.trim().split("\n").filter(Boolean);
    const headers = lines[0].split("|").map((h) => h.trim()).filter(Boolean);
    const rows = lines.slice(2).map(line =>
      line.split("|").map(cell => cell.trim()).filter(Boolean)
    );

    return (
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginTop: "10px" }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              {headers.map((cell, i) => (
                <th key={i} style={{ padding: "8px", border: "1px solid #e5e7eb", fontWeight: 600 }}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "8px", border: "1px solid #e5e7eb", whiteSpace: "pre-wrap" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '16px', color: '#1f2937', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5' }}>📘 Manual SEO Reports</h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Review content analyzed before publishing</p>
      </div>

      <div style={{ maxWidth: '1280px', margin: 'auto' }}>
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px' }}>
          {reports.map((report, i) => {
            const isOpen = selectedReportId === report.id;
            const parsed = isOpen && selectedReportData ? parseReport(selectedReportData.result) : {};

            return (
              <div key={report.id} style={{ borderBottom: "1px solid #f3f4f6", padding: "12px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ maxWidth: "85%" }}>
                    <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: 600 }}>
                      {(page - 1) * 50 + i + 1}. #{report.id}
                    </span><br />
                    <strong>{report.title}</strong><br />
                    <span style={{ color: '#2563eb', wordBreak: 'break-all' }}>{report.url || "(no pre-publish slug)"}</span>
                  </div>
                  <button
                    onClick={() => handleSelectReport(report.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4f46e5',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '6px'
                    }}
                  >
                    {isOpen ? "Hide ⬆️" : "View Report ⬇️"}
                  </button>
                </div>

                {isOpen && (
                  <div style={{ marginTop: '16px', background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#4b5563' }}>📊 SEO GAP REPORT</h3>
                    {renderMarkdownTable(parsed.tableMarkdown)}

                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#4b5563', marginTop: '20px' }}>✍️ Recommended Rewrite</h3>
                    <pre style={{ background: '#fff', padding: '12px', borderRadius: '6px', fontSize: '14px', whiteSpace: 'pre-wrap', border: '1px solid #eee' }}>
                      {parsed.rewrite || "No rewrite content found."}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page <= 1}
              style={{
                marginRight: '10px',
                padding: '8px 12px',
                backgroundColor: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: page <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ◀ Previous
            </button>
            <span style={{ fontSize: '14px', margin: '0 10px' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={page >= totalPages}
              style={{
                marginLeft: '10px',
                padding: '8px 12px',
                backgroundColor: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManualSeoReports;
