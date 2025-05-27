


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./DeepSeekReports.css"; // Styling for tables + cards

// // const API_BASE = "http://localhost:5000/api";
// const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

// function DeepSeekReports() {
//   const [reports, setReports] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedReport, setSelectedReport] = useState(null);
//   console.log(selectedReport,"seeeeeeeeeee")

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     const res = await axios.get(`${API_BASE}/deepseek-reports`);
//     setReports(res.data.data);
//   };

//   const handleSelectReport = async (id) => {
//     const res = await axios.get(`${API_BASE}/deepseek-reports/${id}`);
//     setSelectedReport(res.data.data);
//   };

//   const filtered = reports.filter((r) =>
//     r.url.toLowerCase().includes(search.toLowerCase())
//   );

// const parseReport = (text) => {
//   if (!text) return { tableMarkdown: null, rewrite: "" };

//   const lines = text.split("\n");

//   const tableStart = lines.findIndex(line =>
//     line.toLowerCase().includes("| section") && line.includes("|")
//   );

//   if (tableStart === -1) return { tableMarkdown: null, rewrite: text };

//   const tableLines = [];
//   for (let i = tableStart; i < lines.length; i++) {
//     if (!lines[i].includes("|")) break;
//     tableLines.push(lines[i]);
//   }

//   const tableMarkdown = tableLines.join("\n").trim();
//   const rewrite = lines.slice(tableStart + tableLines.length).join("\n").trim();

//   return { tableMarkdown, rewrite };
// };


// const renderMarkdownTable = (markdown) => {
//   if (!markdown) return <p>No SEO GAP Report found.</p>;

//   const lines = markdown.trim().split("\n").filter(Boolean);
//   const headers = lines[0].split("|").map((h) => h.trim()).filter(Boolean);
//   const rows = lines.slice(2).map(line =>
//     line.split("|").map(cell => cell.trim()).filter(Boolean)
//   );

//   return (
//     <div className="table-wrapper">
//       <table className="seo-table-markdown">
//         <thead>
//           <tr>{headers.map((cell, i) => <th key={i}>{cell}</th>)}</tr>
//         </thead>
//         <tbody>
//           {rows.map((row, i) => (
//             <tr key={i}>
//               {row.map((cell, j) => (
//                 <td key={j} style={{ whiteSpace: 'pre-wrap' }}>{cell}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };



//   return (
//     <div className="report-container">
//       <h2 className="report-title">📚 Saved DeepSeek SEO Reports</h2>

//       <input
//         type="text"
//         placeholder="🔍 Search by URL..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="search-input"
//       />

//       <div className="report-list">
//         {filtered.map((report) => (
//           <div key={report.id} className="report-card">
//             <div className="report-meta">
//               <span className="report-id">#{report.id}</span>
//               <a
//                 href={report.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="report-url"
//               >
//                 {report.url}
//               </a>
//             </div>
//             <button
//               className="view-btn"
//               onClick={() => handleSelectReport(report.id)}
//             >
//               View Report
//             </button>
//           </div>
//         ))}
//       </div>

// {selectedReport && (
//   <div className="report-output">
//     <h3 className="report-subtitle">📝 SEO Report</h3>
//     <p className="report-url-title">{selectedReport.url}</p>

//     {renderMarkdownTable(parseReport(selectedReport.result).tableMarkdown)}

//     <h4>✍️ Recommended Rewrite</h4>
//     <pre className="report-content">
//       {parseReport(selectedReport.result).rewrite}
//     </pre>
//   </div>
// )}
//     </div>
//   );
// }

// export default DeepSeekReports;



import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://hammerhead-app-jkdit.ondigitalocean.app/api";

function DeepSeekReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReportData, setSelectedReportData] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await axios.get(`${API_BASE}/deepseek-reports`);
    setReports(res.data.data);
  };

  const handleSelectReport = async (id) => {
    if (selectedReportId === id) {
      setSelectedReportId(null);
      setSelectedReportData(null);
      return;
    }

    const res = await axios.get(`${API_BASE}/deepseek-reports/${id}`);
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

  const filtered = reports.filter((r) =>
    r.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '16px', color: '#1f2937', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5' }}>📚 DeepSeek SEO Reports</h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Browse past SEO Gap analyses with AI-powered rewrites</p>
      </div>

      <div style={{ maxWidth: '1280px', margin: 'auto' }}>
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px' }}>
          <input
            type="text"
            placeholder="🔍 Search by URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          />

          {filtered.map((report, i) => {
            const isOpen = selectedReportId === report.id;
            const parsed = isOpen && selectedReportData ? parseReport(selectedReportData.result) : {};

            return (
              <div key={report.id} style={{ borderBottom: "1px solid #f3f4f6", padding: "12px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ maxWidth: "85%" }}>
                    <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: 600 }}>#{report.id}</span><br />
                    <a href={report.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', wordBreak: 'break-all' }}>
                      {report.url}
                    </a>
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
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#4b5563' }}>📊 SEO GAP TABLE</h3>
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
        </div>
      </div>
    </div>
  );
}

export default DeepSeekReports;
